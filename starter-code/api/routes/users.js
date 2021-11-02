var express = require('express');
var router = express.Router();
//var ObjectId = require('mongoose').Types.ObjectId;
const { body, validationResult } = require('express-validator');

const Users = require('../models/users');
const Rides = require('../models/rides');

router.get("/:user_id", function(req, res, next) {

  Users.findOne({id: req.params.user_id}, (err, user) => {
    if (user == undefined || user == null) {
        return res.status(404).send("user does not exist.").end()
    }

    return res.status(200).json(user).end();
  })

});

router.get("/:user_id/drives", function(req, res, next) {

    Users.findOne({id: req.params.user_id}, (err, user) => {

        if (err) {
            return res.status(500).end();
        }

        if (user == undefined || user == null) {
            return res.status(404).send("user does not exist.").end()
        }

        const user_drives = user.drives

        Rides.find({_id: {$in: user_drives}}, (err, drives) => {
            if (err) {
                return res.status(500).end();
            }

            return res.status(200).json(drives).end();
        })
    })
  
});

router.get("/:user_id/rides", function(req, res, next) {

    Users.findOne({id: req.params.user_id}, (err, user) => {

        if (err) {
            return res.status(500).end();
        }

        if (user == undefined || user == null) {
            return res.status(404).send("user does not exist.").end()
        }

        const user_rides = user.rides

        Rides.find({_id: {$in: user_rides}}, (err, rides) => {
            if (err) {
                return res.status(500).end();
            }

            return res.status(200).json(rides).end();
        })
    })
  
});

router.post("/",  
    body("full_name")
        .exists().withMessage('full_name is required.').bail()
        .notEmpty().withMessage('full_name is required.').bail(), 
    body("given_name")
        .exists().withMessage('given_name is required.').bail()
        .notEmpty().withMessage('given_name is required.').bail(), 
    body("family_name")
        .exists().withMessage('family_name is required.').bail()
        .notEmpty().withMessage('family_name is required.').bail(), 
    body("email")
        .exists().withMessage('email is required.').bail()
        .notEmpty().withMessage('email is required.').bail(), 
    body("id")
        .exists().withMessage('id is required.').bail()
        .notEmpty().withMessage('id is required.').bail(), 

    function(req, res, next) {
        const errors = validationResult(req);
        const body = req.body;

        /*Users.findOne({email: body.email}, (err, user) => {
            exists = true;
        });*/

       Users.find({email : body.email}, function (err, docs) {
            let exists = false;
            if (docs.length){
                exists = true;
            }

            if (!errors.isEmpty() || exists) {
                return res.status(400).json({errors: errors.array()});
            }    

            Users.create({
                full_name: body.full_name,
                given_name: body.given_name,
                family_name: body.family_name,
                email: body.email,
                id: body.id,
                drives: [],
                rides: [],
                history: []
            }).then(user => {
                user.save(err => {
                    if (err) {
                        return res.status(500).end();
                    }
                    return res.status(200).end();
                })
            }).catch((error) => {
              console.log(error.message);
              return res.status(409).end();
            })
        });
    }
);

module.exports = router;
