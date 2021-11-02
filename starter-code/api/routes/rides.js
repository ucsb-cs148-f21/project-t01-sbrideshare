var express = require("express");
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId

const { body, validationResult } = require('express-validator');

const Rides = require('../models/rides')
const Users = require('../models/users')

router.get("/", function(req, res, next) {
    const body = req.body;

    Rides.find({}, (err, rides) => {
        return res.status(200).json(rides).end();
    })

});

router.patch("/:ride_id", 
    body("leave_datetime")
        .isISO8601().withMessage('leave_datetime must be in ISO8601'), 
    body("price")
        .isFloat({min: 0}).withMessage('price must be a positive number.'),
    // Maybe add check so that you can't remove seats when riders are alrady signed up for them?
    body("seats_available")
        .isInt({min: 1}).withMessage('seats_available must be an integer at least 1.'),
    function(req, res, next) {
        const body = req.body;

        var ride_id = "";
        try {
            ride_id = ObjectId(req.params.ride_id);
        }
        catch {
            return res.status(404).send("Unable to find ride with specified ride_id.").end()
        }

        const update_doc = {
            leave_datetime: body.leave_datetime,
            start_location: body.start_location,
            end_location: body.end_location,
            price: body.price,
            seats_available: body.seats_available
        }

        Rides.findByIdAndUpdate(ride_id, update_doc, (err, docs) => {
            if (err) {
                console.log(err);
                return res.status(500).end();
            }
            return res.status(200).end();
        });
});

router.post("/", 
    body("name")
        .exists().withMessage('name is required.').bail()
        .notEmpty().withMessage('name is required.').bail(), 
    body("leave_datetime")
        .exists().withMessage('leave_datetime is required.').bail()
        .notEmpty().withMessage('leave_datetime is required.').bail()
        .isISO8601().withMessage('leave_datetime must be in ISO8601'), 
    // May want to add a check if valid address later
    body("start_location")
        .exists().withMessage('start_location is required.').bail()
        .notEmpty().withMessage('start_location is required.').bail(), 
    body("end_location")
        .exists().withMessage('end_location is required.').bail()
        .notEmpty().withMessage('end_location is required.').bail(), 
    body("price")
        .exists().withMessage('price is required.').bail()
        .notEmpty().withMessage('price is required.').bail()
        .isFloat({min: 0}).withMessage('price must be a positive number.').bail(),
    body("seats_available")
        .exists().withMessage('seats_available is required.').bail()
        .notEmpty().withMessage('seats_available is required.').bail()
        .isInt({min: 1}).withMessage('seats_available must be an integer at least 1.'),
    body("driver_id")
        .exists().withMessage('driver_id is required.').bail()
        .notEmpty().withMessage('driver_id is required.').bail(),
    function(req, res, next) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const body = req.body;
        
        const ride = new Rides({
            name: body.name,
            leave_datetime: body.leave_datetime,
            start_location: body.start_location,
            end_location: body.end_location,
            price: body.price,
            seats_available: body.seats_available,
            driver_id: body.driver_id,
            riders: []
        })

        // Put reference of drive into user's drives
        Users.findOne({id: body.driver_id}, (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).end();
            }

            if (doc == undefined || doc == null) {
                return res.status(404).send("driver_id does not exist as a user.")
            }

            ride.save().then(saved_doc => {
                const ride_id = saved_doc._id
                doc.drives.push(ride_id)
                doc.save()
                return res.status(200).end()
            })
            .catch(err => {
                console.log(err)
                return res.status(500).end()
            })
        
        })
});

router.post("/:ride_id/riders",
    body("rider_id")
        .exists().withMessage('rider_id is required.').bail()
        .notEmpty().withMessage('rider_id is required.').bail(),
    function(req, res, next) {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }

            const body = req.body;
            var ride_id = "";
            try {
                ride_id = ObjectId(req.params.ride_id);
            }
            catch {
                return res.status(404).send("Unable to find ride with specified ride_id.").end()
            }

            Rides.findById(ride_id, (err, ride) => {
                if (err) {
                    return res.status(500).end();
                }

                if (ride === null) {
                    return res.status(404).send("Unable to find ride with specified ride_id.").end();
                }

                const max_seats = ride.seats_available

                if (ride.riders.includes(body.rider_id)) {
                    return res.status(409).send("rider_id is already a rider on this ride.").end();
                }
                else if (max_seats === 0) {
                    return res.status(409).send("There are no more seats available for this ride.").end()
                }
                else {
                    ride.seats_available -= 1
                    ride.riders.push(body.rider_id)
                }

                Users.findOne({id: body.rider_id}, (err, user) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).end();
                    }
        
                    if (user == undefined || user == null) {
                        return res.status(404).send("rider_id does not exist as a user.")
                    }

                    const ride_id = ride._id
                    user.rides.push(ride_id)

                    user.save().then(saved_doc => {
                        ride.save().then(saved_doc => {
                            return res.status(200).end()
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        return res.status(500).end()
                    })
                
                })

            })
        }
);

router.delete("/:ride_id/riders/:rider_id",
    function(req, res, next) {

        const body = req.body;
        var ride_id = "";
        try {
            ride_id = ObjectId(req.params.ride_id);
        }
        catch {
            return res.status(404).send("Unable to find ride with specified ride_id.").end()
        }

        Rides.findById(ride_id, (err, ride) => {
            if (err) {
                return res.status(500).end();
            }

            if (ride === null) {
                return res.status(404).send("Unable to find ride with specified ride_id.").end();
            }

            if (req.params.rider_id === undefined || req.params.rider_id === null) {
                return res.status(400).send("rider_id cannot be undefined or null")
            }

            const index = ride.riders.indexOf(req.params.rider_id)

            if (index == -1) {
                return res.status(409).send("rider_id is not a rider on this ride.").end();
            }

            ride.riders.splice(index, 1)
            ride.seats_available += 1

            Users.findOne({id: req.params.rider_id}, (err, user) => {
                if (err) {
                    console.log(err);
                    return res.status(500).end();
                }
    
                if (user == undefined || user == null) {
                    return res.status(404).send("rider_id does not exist as a user.")
                }

                const ride_id = ride._id
                const index = user.rides.indexOf(ride_id)
                
                user.rides.splice(index, 1);

                user.save().then(saved_doc => {
                    ride.save().then(saved_doc => {
                        return res.status(200).end()
                    })
                })
                .catch(err => {
                    console.log(err)
                    return res.status(500).end()
                })
            })

        })

    }
);

module.exports = router;