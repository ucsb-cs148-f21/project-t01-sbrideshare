var express = require('express');
var router = express.Router();
//var ObjectId = require('mongoose').Types.ObjectId;

const Users = require('../models/users');

router.get("/", function(req, res, next) {
  const body = req.body;
  Users.find({}, (err, users) => {
      return res.status(200).json(users).end();
  })

});

router.post("/",    
    function(req, res, next) {
        const body = req.body;
        Users.create({
            _id: body.id,
            full_name: body.fullName,
            given_name: body.givenName,
            family_name: body.familyName,
            email: body.email,
            drives: [],
            rides: [],
            history: []
        }).then(user => {
            user.save(err => {
                if (err) {
                    console.log(err);
                    return res.status(500).end();
                }
                return res.status(200).end();
            })
        }).catch((error) => {
          console.log('User already in database. \n[', error.message, ']\n');
        })
    }
);

module.exports = router;
