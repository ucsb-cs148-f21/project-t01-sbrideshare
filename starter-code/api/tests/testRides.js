const request = require('supertest');
const mongoose = require('mongoose');
const assert = require('assert');

const app = require("../app");

// wait until app connects to Mongo
before(function (done) {
  app.on("mongoConnected", function(){
    done();
  });
}); 

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
describe("POST /rides validation", function() {

  after(function(done) {
    mongoose.connection.db.dropDatabase().then(res => {
      done();
    })
  });

  it("400 on missing name", function(done) {
    request(app)
      .post("/rides")
      .send({
        "leave_datetime": "2021-10-12T00:07:46.443+00:00",
        "start_location": "Santa Barbara",
        "end_location": "Los Angeles",
        "price": 1000,
        "seats_available": 1,
        "driver_id": 123
      })
      .set('Accept', 'application/json')
      .expect(400)
      .then(res => {
        done();
      })
  });

  it("400 on missing datetime", function(done) {
    request(app)
      .post("/rides")
      .send({
        "name": "John",
        "start_location": "Santa Barbara",
        "end_location": "Los Angeles",
        "price": 1000,
        "seats_available": 1,
        "driver_id": 123
      })
      .set('Accept', 'application/json')
      .expect(400)
      .then(res => {
        done();
      })
  });

  it("400 on invalid datetime format", function(done) {
    request(app)
      .post("/rides")
      .send({
        "name": "John",
        "leave_datetime": "2021-10-12T00:07:46.443+00:0",
        "start_location": "Santa Barbara",
        "end_location": "Los Angeles",
        "price": 1000,
        "seats_available": 1,
        "driver_id": 123
      })
      .set('Accept', 'application/json')
      .expect(400)
      .then(res => {
        done();
      })
  });

  it("400 on negative price", function(done) {
    request(app)
      .post("/rides")
      .send({
        "name": "John",
        "leave_datetime": "2021-10-12T00:07:46.443+00:00",
        "start_location": "Santa Barbara",
        "end_location": "Los Angeles",
        "price": -1,
        "seats_available": 1,
        "driver_id": 123
      })
      .set('Accept', 'application/json')
      .expect(400)
      .then(res => {
        done();
      })
  });

  it("400 on negative seats", function(done) {
    request(app)
      .post("/rides")
      .send({
        "name": "John",
        "leave_datetime": "2021-10-12T00:07:46.443+00:00",
        "start_location": "Santa Barbara",
        "end_location": "Los Angeles",
        "price": 500,
        "seats_available": -1,
        "driver_id": 123
      })
      .set('Accept', 'application/json')
      .expect(400)
      .then(res => {
        done();
      })
  });

  it("400 on zero seats", function(done) {
    request(app)
      .post("/rides")
      .send({
        "name": "John",
        "leave_datetime": "2021-10-12T00:07:46.443+00:00",
        "start_location": "Santa Barbara",
        "end_location": "Los Angeles",
        "price": 500,
        "seats_available": 0,
        "driver_id": 123
      })
      .set('Accept', 'application/json')
      .expect(400)
      .then(res => {
        done();
      })
  });

  it("200 on valid inputs", function(done) {
    request(app)
      .post("/rides")
      .send({
        "name": "John",
        "leave_datetime": "2021-10-12T00:07:46.443+00:00",
        "start_location": "Santa Barbara",
        "end_location": "Los Angeles",
        "price": 1000,
        "seats_available": 1,
        "driver_id": 123
      })
      .set('Accept', 'application/json')
      .expect(200)
      .then(res => {
        done();
      })
  });
});

describe("POST /rides", function() {

  after(function(done) {
    mongoose.connection.db.dropDatabase().then(res => {
      done();
    })
  });

  const data = {
    name: "Will",
    leave_datetime: "2021-10-12T00:07:46.443+00:00",
    start_location: "Santa Barbara",
    end_location: "Los Angeles",
    price: 1000.23,
    seats_available: 2,
    driver_id: 123
  }

  it("no lost data on post and get", function(done) {

    request(app)
      .post("/rides")
      .send(data)
      .set('Accept', 'application/json')
      .expect(200)
      .then(res => {
        return request(app)
          .get("/rides")
          .set('Accept', 'application/json')
          .expect(200)
      })
      .then(res => {
        const body = res.body[0]
        assert(body.name === data.name);
        assert(Date.parse(body.leave_datetime) === Date.parse(data.leave_datetime));
        assert(body.start_location === data.start_location);
        assert(body.end_location === data.end_location);
        assert(body.price === data.price);
        assert(body.seats_available === data.seats_available);
        assert(body.riders.length === 0);
      })
      .then(res => {
        done();
      })
      .catch(err => done(err))
  });
});

describe("POST /rides/:ride_id/riders", function() {

  afterEach(function(done) {
    mongoose.connection.db.dropDatabase().then(res => {
      done();
    })
  });

  it("400 on missing rider_id", function(done){
    request(app)
    .post('/rides/1234/riders')
    .set('Accept', 'application/json')
    .expect(400)
    .then(res => {
      done()
    })
    .catch(err => done(err))
  });

  it("404 on unknown ride _id", function(done){
    request(app)
    .post('/rides/2134/riders')
    .send({rider_id: 877})
    .set('Accept', 'application/json')
    .expect(404)
    .then(res=> {
      done()
    })
    .catch(err => done(err))
  });

  const data = {
    name: "Will",
    leave_datetime: "2021-10-12T00:07:46.443+00:00",
    start_location: "Santa Barbara",
    end_location: "Los Angeles",
    price: 1000.23,
    seats_available: 2,
    driver_id: 123
  }

  it("200 on successful rider add", function(done){
    request(app)
      .post("/rides")
      .send(data)
      .set('Accept', 'application/json')
      .expect(200)
      .then(res => {
        return request(app)
          .get("/rides")
          .set('Accept', 'application/json')
          .expect(200)
      })
      .then(res => {
        const body = res.body[0];
        const id = body._id;
        return request(app)
          .post(`/rides/${id}/riders`)
          .send({rider_id: 877})
          .set('Accept', 'application/json')
          .expect(200)
      })
      .then(res => {
        done()
      })
      .catch(err => done(err))
  })

  it("409 on rider_id already a rider", function(done){
    const data = {
      name: "Will",
      leave_datetime: "2021-10-12T00:07:46.443+00:00",
      start_location: "Santa Barbara",
      end_location: "Los Angeles",
      price: 1000.23,
      seats_available: 2,
      driver_id: 123
    }
    var id = "";

    request(app)
        .post("/rides")
        .send(data)
        .set('Accept', 'application/json')
        .expect(200)
    .then(res => {
      return request(app)
          .get("/rides")
          .set('Accept', 'application/json')
          .expect(200)
    })
    .then(res => {
      const body = res.body[0];
      id = body._id;
      return request(app)
        .post(`/rides/${id}/riders`)
        .send({rider_id: 877})
        .set('Accept', 'application/json')
        .expect(200)
    })
    .then(res => {
      return request(app)
          .post(`/rides/${id}/riders`)
          .send({rider_id: 877})
          .set('Accept', 'application/json')
          .expect(409)
    })
    .then(res => {
      done();
    })
    .catch(err => done(err))
  });

  it("409 on ride is full", function(done){
    const data = {
      name: "Will",
      leave_datetime: "2021-10-12T00:07:46.443+00:00",
      start_location: "Santa Barbara",
      end_location: "Los Angeles",
      price: 1000.23,
      seats_available: 1,
      driver_id: 123
    }
    var id = "";

    request(app)
        .post("/rides")
        .send(data)
        .set('Accept', 'application/json')
        .expect(200)
    .then(res => {
      return request(app)
          .get("/rides")
          .set('Accept', 'application/json')
          .expect(200)
    })
    .then(res => {
      const body = res.body[0];
      id = body._id;
      return request(app)
        .post(`/rides/${id}/riders`)
        .send({rider_id: 877})
        .set('Accept', 'application/json')
        .expect(200)
    })
    .then(res => {
      return request(app)
          .post(`/rides/${id}/riders`)
          .send({rider_id: 878})
          .set('Accept', 'application/json')
          .expect(409)
    })
    .then(res => {
      done();
    })
    .catch(err => done(err))
  });

});

describe("DELETE /rides/:ride_id/riders", function() {

  afterEach(function(done) {
    mongoose.connection.db.dropDatabase().then(res => {
      done();
    })
  });

  it("404 on unknown ride_id", function(done){
    const invalid_ride_id = 21348

    request(app)
          .delete(`/rides/${invalid_ride_id}/riders`)
          .send({rider_id: 1234})
          .set('Accept', 'application/json')
          .expect(404)
    .then(res => {
      done();
    })
  })

  it("test invalid and valid delete", function(done){

    const data = {
      name: "Will",
      leave_datetime: "2021-10-12T00:07:46.443+00:00",
      start_location: "Santa Barbara",
      end_location: "Los Angeles",
      price: 1000.23,
      seats_available: 2,
      driver_id: 123
    }
    var id = "";
    const rider_id = 2134871290;

    request(app)
        .post("/rides")
        .send(data)
        .set('Accept', 'application/json')
        .expect(200)
    .then(res => {
      return request(app)
          .get("/rides")
          .set('Accept', 'application/json')
          .expect(200)
    })
    // Fail on rider not part of rider array
    .then(res => {
      const body = res.body[0];
      id = body._id;
      return request(app)
          .delete(`/rides/${id}/riders/${rider_id}`)
          .set('Accept', 'application/json')
          .expect(409)
    })
    .then(res => {
      return request(app)
        .post(`/rides/${id}/riders`)
        .send({rider_id: rider_id})
        .set('Accept', 'application/json')
        .expect(200)
    })
    .then(res => {
      return request(app)
          .delete(`/rides/${id}/riders/${rider_id}`)
          .set('Accept', 'application/json')
          .expect(200)
    })
    .then(res => {
      return request(app)
          .get("/rides")
          .set('Accept', 'application/json')
          .expect(200)
    })
    .then(res => {
      const body = res.body[0]
      assert(body.riders.indexOf(rider_id) === -1)
      assert(body.seats_available === 2)
    })
    .then(res => {
      done();
    })
    .catch(err => done(err))

  });

});
