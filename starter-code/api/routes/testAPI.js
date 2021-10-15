var express = require("express");
var router = express.Router();

const Rides = require('../models/rides')

router.get("/", function(req, res, next) {
    res.send("API is working properly");
});
/*/attempted backend request
router.get("/testRides", function(req, res, next){
    var name = ["Speed Demon", "Turtle", "Grandma", "Joe", "The Fast",
    "Ben Quadinaros", "A Ghost", "Someone", "Not You", "Google"];
    res.send(name);
});
*/

router.post("/testCreateRide", function(req, res, next) {
    const body = req.body;
    var new_rides_entry = new Rides(
        {
            location: body.location,
            name: body.name,
            date: Date.now(),
            price: body.price,
            phone: body.phone,
            seats_available: body.seats_available
        }
    )

    new_rides_entry.save(function(err) {
        if (err){
            console.log(err);
        }
    });

    res.status(200).end();
});

module.exports = router;
