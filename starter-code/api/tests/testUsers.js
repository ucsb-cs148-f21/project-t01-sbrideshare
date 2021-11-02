const request = require('supertest');
const mongoose = require('mongoose');
const assert = require('assert');

const app = require("../app");

// wait until app connects to Mongo
/*
before(function (done) {
  app.on("mongoConnected", function(){
    done();
  });
}); */

// destroy test DB after all tests and close connection
after(function() {
  mongoose.connection.db.dropDatabase().then(res => {
    mongoose.connection.close()
  })
});

// Can run basic get on server
describe("GET /testAPI", function() {
  it("it should has status code 200", function(done) {
    request(app)
      .get("/testAPI")
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        return done();
      });
  });
});

// validation tests
describe("POST /users validation", function() {

    after(function(done) {
      mongoose.connection.db.dropDatabase().then(res => {
        done();
      })
    });
  
    it("400 on missing full_name", function(done) {
      request(app)
        .post("/users")
        .send({
            "given_name": "Joe", 
            "family_name": "Goldberg", 
            "email": "joegoldber@ucsb.edu",
            "id": "21358971895"
        })
        .set('Accept', 'application/json')
        .expect(400)
        .then(res => {
          done();
        })
    });

    it("400 on missing given_name", function(done) {
        request(app)
          .post("/users")
          .send({
              "full_name": "Joe Goldberg",
              "family_name": "Goldberg", 
              "email": "joegoldber@ucsb.edu",
              "id": "21358971895"
          })
          .set('Accept', 'application/json')
          .expect(400)
          .then(res => {
            done();
          })
      });

    it("400 on missing family_name", function(done) {
    request(app)
        .post("/users")
        .send({
            "full_name": "Joe Goldberg",
            "given_name": "Joe", 
            "email": "joegoldber@ucsb.edu",
            "id": "21358971895"
        })
        .set('Accept', 'application/json')
        .expect(400)
        .then(res => {
        done();
        })
    });
  
    it("400 on missing email", function(done) {
      request(app)
        .post("/users")
        .send({
          "full_name": "Joe Goldberg",
          "given_name": "Joe", 
          "family_name": "Goldberg", 
          "id": "21358971895"
        })
        .set('Accept', 'application/json')
        .expect(400)
        .then(res => {
          done();
        })

    it("400 on missing id", function(done) {
    request(app)
            .post("/users")
            .send({
              "full_name": "Joe Goldberg",
              "given_name": "Joe", 
              "family_name": "Goldberg", 
              "email": "joegoldber@ucsb.edu"
            })
          .set('Accept', 'application/json')
          .expect(400)
          .then(res => {
            done();
          })
    });
  
    it("200 on valid inputs", function(done) {
      request(app)
        .post("/users")
        .send({
          "full_name": "Joe Goldberg",
          "given_name": "Joe", 
          "family_name": "Goldberg", 
          "email": "joegoldberg@ucsb.edu",
          "id": "21358971895"
        })
        .set('Accept', 'application/json')
        .expect(200)
        .then(res => {
          done();
        })
    });
  });
});
  
describe("POST /users", function() {
  
    after(function(done) {
      mongoose.connection.db.dropDatabase().then(res => {
        done();
      })
    });

    const user_id = 21358971895
    const data = {
      full_name: "Joe Goldberg",  
      given_name: "Joe", 
      family_name: "Goldberg", 
      email: "joegoldberg@ucsb.edu", 
      id: user_id
    };
  
    it("no lost data on post and get", function(done) {
      request(app)
        .post("/users")
        .send(data)
        .set('Accept', 'application/json')
        .expect(200)
        .then(res => {
          return request(app)
            .get(`/users/${user_id}`)
            .set('Accept', 'application/json')
            .expect(200)
        })
        .then(res => {
          const body = res.body;
          assert(body.full_name === data.full_name);
          assert(body.given_name === data.given_name);
          assert(body.family_name === data.family_name);
          assert(body.email === data.email);
          assert(body.id === data.id);
          assert(body.drives.length === 0);
          assert(body.rides.length === 0);
          assert(body.history.length === 0);

        })
        .then(res => {
          done();
        })
        .catch(err => done(err))
    });

    it("400 on duplicate inputs", function(done) {
      request(app)
          .post("/users")
          .send(data)
          .send(data)
          .set('Accept', 'application/json')
          .expect(400)
          .then(res => {
            done();
          })
    });
});
  