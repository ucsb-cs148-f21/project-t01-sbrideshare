const request = require('supertest');
const mongoose = require('mongoose');
const assert = require('assert');

const app = require("../app");

const valid_placeid = "EiMxMjMgVHJpZ28gUm9hZCwgSXNsYSBWaXN0YSwgQ0EsIFVTQSIuKiwKFAoSCR93hRtDP-mAEV9td0-B5FqoEhQKEgkzvx5OfEDpgBFK8yJBwdnBzg";


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

describe("GET /users validation", function() {

  after(function(done) {
    mongoose.connection.db.dropDatabase().then(res => {
      done();
    })
  });

  it("404 on non existent user", function(done) {
    request(app)
      .get(`/users/123`)
      .set('Accept', 'application/json')
      .expect(404)
    .then(res => {
      done()
    })
  })

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
              "image_url": "https://google.com",
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
            "image_url": "https://google.com",
            "email": "joegoldber@ucsb.edu",
            "id": "21358971895"
        })
        .set('Accept', 'application/json')
        .expect(400)
        .then(res => {
        done();
        })
    });

    it("400 on missing image url", function(done) {
      request(app)
              .post("/users")
              .send({
                "full_name": "Joe Goldberg",
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
  
    it("400 on missing email", function(done) {
      request(app)
        .post("/users")
        .send({
          "full_name": "Joe Goldberg",
          "given_name": "Joe", 
          "family_name": "Goldberg", 
          "image_url": "https://google.com",
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
              "image_url": "https://google.com",
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
          "image_url": "https://google.com",
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

    const user_id = "21358971895"
    const data = {
      full_name: "Joe Goldberg",  
      given_name: "Joe", 
      family_name: "Goldberg", 
      image_url: "https://google.com",
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
          assert(body.image_url === data.image_url);
          assert(body.email === data.email);
          assert(body.id == data.id);
          assert(body.drives.length === 0);
          assert(body.rides.length === 0);
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
  
describe("GET /:user_id/drives", function() {

  const id1 = 2341;
  const id2 = 75889;

  const users = [
    {
      "full_name": "Will Wilkins",
      "given_name": "Will", 
      "family_name": "Wilkins", 
      "image_url": "https://google.com",
      "email": "willwilkins@ucsb.edu",
      "id": id1,
    },
    {
    "full_name": "Joe Goldberg",
    "given_name": "Joe", 
    "family_name": "Goldberg", 
    "image_url": "https://google.com",
    "email": "joegoldberg@ucsb.edu",
    "id": id2,
    }
  ]

  const drives = [
    {
      name: "Will",
      leave_datetime: "2021-10-12T00:07:46.443+00:00",
      start_location: valid_placeid,
      end_location: valid_placeid,
      price: 1000.23,
      seats_available: 2,
      rider_radius: 2000,
      driver_id: id1
    },
    {
      name: "Joe",
      leave_datetime: "2021-10-12T00:07:46.443+00:00",
      start_location: valid_placeid,
      end_location: valid_placeid,
      price: 10.23,
      seats_available: 1,
      rider_radius: 2000,
      driver_id: id2
    }
  ]

  before(function (done) {
    request(app)
      .post("/users")
      .send(users[0])
      .set('Accept', 'application/json')
    .then(res => {
      return request(app)
      .post("/users")
      .send(users[1])
      .set('Accept', 'application/json')
    })
    .then(res => {
      done()
    })
  }); 

  after(function(done) {
    mongoose.connection.db.dropDatabase().then(res => {
      done();
    })
  });

  it("test get correct drives which belong to user", function(done) {
    request(app)
      .post("/rides")
      .send(drives[0])
      .set('Accept', 'application/json')
      .expect(200)
    .then(res => {
      return request(app)
      .post("/rides")
      .send(drives[1])
      .set('Accept', 'application/json')
      .expect(200)
    })
    .then(res => {
      return request(app)
      .get(`/users/${id1}/drives`)
      .set('Accept', 'application/json')
      .expect(200)
    })
    .then(res => {
      const body = res.body
      const drive = body[0]

      assert.equal(body.length, 1)
      assert.equal(drive.name, "Will")
      assert.equal(Date.parse(drive.leave_datetime), Date.parse("2021-10-12T00:07:46.443+00:00"))
      assert.notStrictEqual(drive.start_location.formatted_address, undefined)
      assert.notStrictEqual(drive.end_location.formatted_address, undefined)
      assert.equal(drive.price, 1000.23)
      assert.equal(drive.seats_available, 2)
    })
    .then(res => {
      done()
    })
    .catch(err => done(err))
  })

});

describe("GET /:user_id/rides", function() {

  const id1 = 2341;
  const id2 = 75889;

  const users = [
    {
      "full_name": "Will Wilkins",
      "given_name": "Will", 
      "family_name": "Wilkins", 
      "image_url": "https://google.com",
      "email": "willwilkins@ucsb.edu",
      "id": id1,
    },
    {
    "full_name": "Joe Goldberg",
    "given_name": "Joe", 
    "family_name": "Goldberg", 
    "image_url": "https://google.com",
    "email": "joegoldberg@ucsb.edu",
    "id": id2,
    }
  ]

  const drives = [
    {
      name: "Will",
      leave_datetime: "2021-10-12T00:07:46.443+00:00",
      start_location: valid_placeid,
      end_location: valid_placeid,
      price: 1000.23,
      seats_available: 2,
      rider_radius: 2000,
      driver_id: id1
    },
    {
      name: "Joe",
      leave_datetime: "2021-10-12T00:07:46.443+00:00",
      start_location: valid_placeid,
      end_location: valid_placeid,
      price: 10.23,
      seats_available: 1,
      rider_radius: 2000,
      driver_id: id2
    }
  ]

  before(function (done) {
    request(app)
      .post("/users")
      .send(users[0])
      .set('Accept', 'application/json')
    .then(res => {
      return request(app)
      .post("/users")
      .send(users[1])
      .set('Accept', 'application/json')
    })
    .then(res => {
      done()
    })
  }); 

  after(function(done) {
    mongoose.connection.db.dropDatabase().then(res => {
      done();
    })
  });

  it("test get correct rides which belong to user", function(done) {
    var ride_id = ""

    request(app)
      .post("/rides")
      .send(drives[0])
      .set('Accept', 'application/json')
      .expect(200)
    .then(res => {
      return request(app)
      .post("/rides")
      .send(drives[1])
      .set('Accept', 'application/json')
      .expect(200)
    })
    .then(res => {
      return request(app)
      .get('/rides')
      .set('Accept', 'application/json')
      .expect(200)
    })
    .then(res => {
      const body = res.body;
      ride_id = body[0]._id

      return request(app)
      .post(`/rides/${ride_id}/riders`)
      .send({rider_id: id2, pickup_address: valid_placeid})
      .set('Accept', 'application/json')
      .expect(200)
    })
    .then(res => {
      return request(app)
      .get(`/users/${id2}/rides`)
      .set('Accept', 'application/json')
      .expect(200)
    })
    .then(res => {
      const body = res.body
      const ride = body[0]

      assert.equal(body.length, 1)
      assert.equal(ride.name, "Will")
      assert.equal(Date.parse(ride.leave_datetime), Date.parse("2021-10-12T00:07:46.443+00:00"))
      assert.notStrictEqual(ride.start_location.formatted_address, undefined)
      assert.notStrictEqual(ride.end_location.formatted_address, undefined)
      assert.equal(ride.price, 1000.23)
      assert.equal(ride.seats_available, 1)
    })
    .then(res => {
      done()
    })
    .catch(err => done(err))
  })

});