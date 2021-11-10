var express = require("express");
var axios = require('axios');

var router = express.Router();

const Rides = require('../models/rides')
const TestRides = require('../models/rides')

router.get("/", function(req, res, next) {
    res.send("API is working properly");
});

router.get("/testGoogle", function(req, res, next) {
    const API_KEY = process.env.GOOGLE_API_KEY

    console.log("in here");
    var config = {
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=formatted_address%2Cname%2Cgeometry&key=${API_KEY}`,
        headers: { }
    };
      
    axios(config)
    .then(function (response) {
    console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
    console.log(error);
    });

})


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
