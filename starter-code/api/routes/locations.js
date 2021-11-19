var express = require("express");
var router = express.Router();


const { body, validationResult } = require('express-validator');
const {Client} = require("@googlemaps/google-maps-services-js");

const google_client = new Client({});

router.get("/", 
    function(req, res, next) {

        const query = req.query;

        if(query.input === undefined) {
            return res.status(400).send("input is a required parameter.").end();
        }

        google_client.placeAutocomplete({
            params: {
                key: process.env.GOOGLE_API_KEY,
                input: query.input,
                location: [34.4133, -119.8610], //Isla vista
                radius: 10000, //circular bias of 10000 meters
                types: "address"
            }
        }).then(r => {
            return res.status(200).json(r.data).end();
        }) 
        .catch((e) => {
            console.log(e.response.data.error_message);
            return res.status(500).end();
        });
    }
);

module.exports = router;
