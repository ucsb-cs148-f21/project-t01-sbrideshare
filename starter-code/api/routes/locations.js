var express = require("express");
var router = express.Router();


const { body, validationResult } = require('express-validator');
const {Client} = require("@googlemaps/google-maps-services-js");

const google_client = new Client({});

router.get("/", 
    body("input")
        .exists().withMessage('input is required.').bail()
        .notEmpty().withMessage('input is required.').bail(),
    function(req, res, next) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const body = req.body;

        google_client.placeAutocomplete({
            params: {
                key: process.env.GOOGLE_API_KEY,
                input: body.input,
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