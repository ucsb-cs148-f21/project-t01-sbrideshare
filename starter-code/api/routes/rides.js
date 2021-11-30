var express = require("express");
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId

const { body, validationResult } = require('express-validator');
const {Client} = require("@googlemaps/google-maps-services-js");

const Rides = require('../models/rides')
const Users = require('../models/users')

const google_client = new Client({});

// Returns Great Circle Distance between two lat/lon points with haversine formula
function gc_distance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // meters
    const p1 = lat1 * Math.PI/180; // p, l in radians
    const p2 = lat2 * Math.PI/180;
    const sp = (lat2-lat1) * Math.PI/180;
    const sl = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(sp/2) * Math.sin(sp/2) +
            Math.cos(p1) * Math.cos(p2) *
            Math.sin(sl/2) * Math.sin(sl/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // in meters
    return d;
}

router.get("/", async function(req, res, next) {
    const query = req.query;

    var ride_query = {
        price: {},
        leave_datetime: {}
    }

    // Populate query fields
    for (const [key, value] of Object.entries(query)) {
        switch(key) {
            case "min_price":
                ride_query["price"]["$gte"] = value;
                break;
            case "max_price":
                ride_query["price"]["$lte"] = value;
                break;
            case "min_leave_datetime":
                ride_query["leave_datetime"]["$gte"] = value;
                break;
            case "max_leave_datetime":
                ride_query["leave_datetime"]["$lte"] = value;
                break;
        }
    }

    // Delete unused queries
    for (const [key, value] of Object.entries(ride_query)) {
        if (Object.keys(ride_query[key]).length == 0) {
            delete ride_query[key];
        }
    }

    Rides.find(ride_query, async (err, rides) => {

        if (err) {
            console.log(err);
            return res.status(500).end();
        }

        var start_location_geo = {}
        var end_location_geo = {}
        
        // Get geocode of start and end locations
        if (query.start_location != undefined) {
            await google_client.geocode({
                params: {
                    key: process.env.GOOGLE_API_KEY,
                    place_id: query.start_location
                }
            }).then(r => {
                start_location_geo = r.data.results[0]

                // Remove rides that are out of range of driver's dropoff distance
                rides.reduceRight(function(acc, ride, index) {
                    const pickup_distance = gc_distance(ride.start_location.lat, ride.start_location.lng,
                        start_location_geo.geometry.location.lat, start_location_geo.geometry.location.lng)

                    if (pickup_distance > query.start_location_radius) {
                      rides.splice(index, 1);
                    }
                  }, []);
            })
            .catch(e => {
                console.log(e.response.data.error_message);
                return res.status(500).send("start_location place_id is not valid.").end()
            })
        }

        if(query.end_location != undefined) {
            await google_client.geocode({
                params: {
                    key: process.env.GOOGLE_API_KEY,
                    place_id: query.end_location
                }
            }).then(r => {
                end_location_geo = r.data.results[0]

                // Remove rides that are out of range of driver's dropoff distance
                rides.reduceRight(function(acc, ride, index) {
                    const dropoff_distance = gc_distance(ride.end_location.lat, ride.end_location.lng,
                        end_location_geo.geometry.location.lat, end_location_geo.geometry.location.lng)

                    if (dropoff_distance > query.end_location_radius) {
                      rides.splice(index, 1);
                    }
                  }, []);
            })
            .catch(e => {
                console.log(e.response.data.error_message);
                return res.status(500).send("end_location place_id is not valid").end()
            })
        }

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
    async function(req, res, next) {
        const body = req.body;

        var ride_id = "";
        try {
            ride_id = ObjectId(req.params.ride_id);
        }
        catch {
            return res.status(404).send("Unable to find ride with specified ride_id.").end()
        }

        var start_location_geo = {}
        var end_location_geo = {}
        
        // Get geocode of start and end locations
        if (body.start_location != undefined) {
            await google_client.geocode({
                params: {
                    key: process.env.GOOGLE_API_KEY,
                    place_id: body.start_location
                }
            }).then(r => {
                start_location_geo = r.data.results[0]
            })
            .catch(e => {
                console.log(e.response.data.error_message);
                return res.status(500).send("start_location place_id is not valid.").end()
            })
        }

        if(body.end_location != undefined) {
            await google_client.geocode({
                params: {
                    key: process.env.GOOGLE_API_KEY,
                    place_id: body.end_location
                }
            }).then(r => {
                end_location_geo = r.data.results[0]
            })
            .catch(e => {
                console.log(e.response.data.error_message);
                return res.status(500).send("end_location place_id is not valid.").end()
            })
        }

        const formatted_start_location = 
        { 
            formatted_address: start_location_geo.formatted_address,
            lat: start_location_geo.geometry.location.lat,
            lng: start_location_geo.geometry.location.lng
        }
        const formatted_end_location = 
        {
            formatted_address: end_location_geo.formatted_address,
            lat: end_location_geo.geometry.location.lat,
            lng: end_location_geo.geometry.location.lng,
        }

        const update_doc = {
            leave_datetime: body.leave_datetime,
            start_location: formatted_start_location,
            end_location: formatted_end_location,
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
    body("start_location")
        .exists().withMessage('start_location is required.').bail()
        .notEmpty().withMessage('start_location is required.').bail(), 
    body("end_location")
        .exists().withMessage('end_location is required.').bail()
        .notEmpty().withMessage('end_location is required.').bail(), 
    body("rider_radius")
        .exists().withMessage('rider_radius is required.').bail()
        .notEmpty().withMessage('rider_radius is required.').bail(), 
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
    async function(req, res, next) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const body = req.body;

        var start_location_geo = {}
        var end_location_geo = {}

        // Get geocode of start and end locations
        await google_client.geocode({
            params: {
                key: process.env.GOOGLE_API_KEY,
                place_id: body.start_location
            }
        }).then(r => {
            start_location_geo = r.data.results[0]
        })
        .catch(e => {
            console.log(e.response.data.error_message);
            return res.status(500).send("start_location place_id is not valid.").end()
        })

        await google_client.geocode({
            params: {
                key: process.env.GOOGLE_API_KEY,
                place_id: body.end_location
            }
        }).then(r => {
            end_location_geo = r.data.results[0]
        })
        .catch(e => {
            console.log(e.response.data.error_message);
            return res.status(500).send("end_location place_id is not valid.").end()
        })

        const ride = new Rides({
            name: body.name,
            leave_datetime: body.leave_datetime,
            start_location: 
            {
                formatted_address: start_location_geo.formatted_address,
                lat: start_location_geo.geometry.location.lat,
                lng: start_location_geo.geometry.location.lng,
            },
            end_location: 
            {
                formatted_address: end_location_geo.formatted_address,
                lat: end_location_geo.geometry.location.lat,
                lng: end_location_geo.geometry.location.lng,
            },
            rider_radius: body.rider_radius,
            price: body.price,
            seats_available: body.seats_available,
            driver_id: body.driver_id,
            contact: body.contact == undefined ? "" : body.contact,
            riders: []
        })

        // Put reference of drive into user's drives
        Users.findOne({id: body.driver_id}, (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).end();
            }

            if (doc == undefined || doc == null) {
                return res.status(404).send("driver_id does not exist as a user.").end()
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
    body("rider_name")
        .exists().withMessage('rider_name is required.').bail()
        .notEmpty().withMessage('rider_name is required.').bail(),
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

            Rides.findById(ride_id, async(err, ride) => {
                if (err) {
                    return res.status(500).end();
                }

                if (ride === null) {
                    return res.status(404).send("Unable to find ride with specified ride_id.").end();
                }

                const max_seats = ride.seats_available

                const found = ride.riders.some(element => {
                    return element.rider_id == body.rider_id
                })

                if (found) {
                    return res.status(409).send("rider_id is already a rider on this ride.").end();
                }
                else if (max_seats === 0) {
                    return res.status(409).send("There are no more seats available for this ride.").end()
                }
                else {

                    var location_geo = {}

                    if (body.pickup_address != undefined) {

                        // Forbid adding pickup_location if driver doesn't want to pickup
                        if (ride.rider_radius == 0) {
                            return res.status(409).send("Driver has specified that riders cannot set a pickup_location.").end();
                        }

                        await google_client.geocode({
                            params: {
                                key: process.env.GOOGLE_API_KEY,
                                place_id: body.pickup_address
                            }
                        }).then(r => {
                            location_geo = r.data.results[0]

                            // Ensure pickup_location is within rider radius
                            const distance = gc_distance(location_geo.geometry.location.lat, location_geo.geometry.location.lng, ride.start_location.lat, ride.start_location.lng)
                            if (distance > ride.rider_radius) {
                                return res.status(409).send("pickup_location is outside of the drive's specified rider_radius.").end();
                            }

                            ride.seats_available -= 1
                            const riderData = {
                                rider_id: body.rider_id,
                                rider_name: body.rider_name,
                                pickup_address: body.pickup_address != undefined ? location_geo.formatted_address : "",
                                note_to_driver: body.note_to_driver != undefined ? body.note_to_driver : ""
                            }
        
                            ride.riders.push(riderData)

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
                        .catch(e => {
                            console.log(e.response.data.error_message);
                            return res.status(500).send("pickup_address place_id is not valid.").end()
                        })
                    }
                    else {
                        if (ride.rider_radius != 0) {
                            return res.status(409).send("Driver has specified that they will pickup riders. Please specify a pickup location.").end();
                        }
                    }

                }

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

            // const index = ride.riders.indexOf(req.params.rider_id)
            const index = ride.riders.find(element => {
                return element.rider_id == req.params.rider_id;
            })

            if (index == undefined) {
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