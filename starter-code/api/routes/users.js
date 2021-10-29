var express = require('express');
var router = express.Router();
//var ObjectId = require('mongoose').Types.ObjectId;
const { body, validationResult } = require('express-validator');

const Users = require('../models/users');

router.get("/", function(req, res, next) {
  const body = req.body;
  Users.find({}, (err, users) => {
      return res.status(200).json(users).end();
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
