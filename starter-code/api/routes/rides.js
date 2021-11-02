var express = require("express");
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId

const { body, validationResult } = require('express-validator');

const Rides = require('../models/rides')

router.get("/", function(req, res, next) {
    const body = req.body;

    Rides.find({}, (err, rides) => {
        return res.status(200).json(rides).end();
    })

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
        
        Rides.create({
            name: body.name,
            leave_datetime: body.leave_datetime,
            start_location: body.start_location,
            end_location: body.end_location,
            price: body.price,
            seats_available: body.seats_available,
            driver_id: body.driver_id,
            riders: []
        }).then(ride => {
            ride.save(err => {
                if (err) {
                    console.log(err);
                    return res.status(500).end();
                }
                return res.status(200).end();
            })
        })
    }
);

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

            Rides.findOne({"_id": ride_id}, (err, ride) => {
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

                ride.save(err => {
                    if (err){
                        console.log(err);
                        return res.status(500).end();
                    }
                    return res.status(200).end();
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

        Rides.findOne({"_id": ride_id}, (err, ride) => {
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

            ride.save(err => {
                if (err){
                    console.log(err);
                    return res.status(500).end();
                }
                return res.status(200).end();
            })

        })

    }
);

module.exports = router;