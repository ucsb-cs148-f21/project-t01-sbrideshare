var express = require("express");
var router = express.Router();

const Rides = require('../models/rides')
const TestRides = require('../models/rides')

router.get("/", function(req, res, next) {
    res.send("API is working properly");
});
//attempted backend request
router.get("/testRides", function(req, res, next){
    var id = [0,1,2,3,4,5,6,7,8,9];
    var name = ["Speed Demon", "Turtle", "Grandma", "Joe", "The Fast",
        "Ben Quadinaros", "A Ghost", "Someone", "Not You", "Google"];
    var startLocation = ["Here","UCSB","IV","Santa Barbara","Goleta",
        "California","The Ocean","Behind You","The Moon","Space"];
    var endLocation = ["There","Home","Dreams","Nowhere","Somewhere",
        "Fires","Flooding","Grave","Mars","Darkness"];
    var dayLeave = ["Today","Never","Tomorrow","Sometime","Monday",
        "Yesterday","Future","Now","Soon","idk"];
    var timeLeave = ["14:00","12:00","13:00","5:00","4:00",
        "3:00","25:00","o'Clock","TM","in a bit"];
    var numSeats = [4,4,4,4,4,4,4,4,4,4]
    var list = [];
    for(var i=0;i<10;i++){
        var tempRide = new TestRides(
            {
                id: id[i],
                name: name[i],
                startLocation: startLocation[i],
                endLocation: endLocation[i],
                dayLeave: dayLeave[i],
                timeLeave: timeLeave[i],
                numSeats: numSeats[i]
            }
        )
        list[i]=[tempRide];
    }
    res.send(list);
});

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
