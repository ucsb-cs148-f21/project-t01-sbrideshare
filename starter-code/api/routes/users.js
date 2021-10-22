var express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

const Users = require('../models/users');

router.get("/", function(req, res, next) {
  const body = req.body;

  Users.find({}, (err, users) => {
      return res.status(200).json(users).end();
  })

});

router.put("/createUser",    
    function(req, res, next) {
        const body = req.body;
        Users.create({
            _id: body.email,
            fullName: body.fullName,
            givenName: body.givenName,
            familyName: body.familyName,
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
