import React, { useState } from "react";
import "./index2.css";
import Container from "react-bootstrap/Container";

import Layout from "../components/Layout";
import getUser from "../utils/get-user";
import ucsbAccount from "../utils/ucsb-account";
import axios from "axios";
import getBackendURL from "../utils/get-backend-url";
import DateTimePicker from "react-datetime-picker";

export default function Ride() {
  const google_user = getUser();
  const user_id = google_user.id;

  const [values, setValues] = useState({
    name: "",
    leave_datetime: new Date(),
    start_location: "",
    end_location: "",
    price: "",
    seats_available: "",
    driver_id: user_id,
  });
  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState({});
  const [hasErrors, setHasErrors] = useState(false);
  const user = getUser();

  const handleNameInputChange = (event) => {
    setValues({ ...values, name: event.target.value });
  };
  const handleLeave_DatetimeInputChange = (date) => {
    setValues({ ...values, leave_datetime: date });
  };
  const handleStart_LocationInputChange = (event) => {
    setValues({ ...values, start_location: event.target.value });
  };
  const handleEnd_LocationInputChange = (event) => {
    setValues({ ...values, end_location: event.target.value });
  };
  const handlePriceInputChange = (event) => {
    setValues({ ...values, price: event.target.value });
  };
  const handleSeats_AvailableInputChange = (event) => {
    setValues({ ...values, seats_available: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let isValid = false;
    const {
      name,
      leave_datetime,
      seats_available,
      start_location,
      end_location,
      price,
    } = values;
    const keys = Object.keys(values);
    const errors = {
      name: "",
      leave_datetime: new Date(),
      start_location: "",
      end_location: "",
      price: "",
      seats_available: "",
      driver_id: "",
    };

    switch (true) {
      case keys.includes("leave_datetime"):
        // 2020-07-10 15:00:00.000
        if (values.leave_datetime === "") {
          isValid = false;
          errors["leave_datetime"] = "This is a required field.";
        } else if (
          values.leave_datetime.length <= 22 ||
          values.leave_datetime.length >= 24
        ) {
          isValid = false;
          errors["leave_datetime"] =
            "The leave/datetime should be in ISO8601 format(23 characters only: 2020-07-10 15:00:00.000).";
        } else {
          isValid = true;
          errors["leave_datetime"] = "";
        }

      case keys.includes("name"):
        if (values.name === "") {
          isValid = false;
          errors["name"] = "This is a required field.";
        } else if (values.name.length <= 3) {
          isValid = false;
          errors["name"] = "Please enter at-least 4 characters.";
        } else {
          isValid = true;
          errors["name"] = "";
        }

      case keys.includes("seats_available"):
        const seats_available = parseInt(values.seats_available, 10);
        if (values.seats_available === "") {
          isValid = false;
          errors["seats_available"] = "This is a required field.";
        } else if (seats_available < 1) {
          isValid = false;
          errors["seats_available"] = "Number of riders should be less than 1.";
        } else if (seats_available > 4) {
          isValid = false;
          errors["seats_available"] = "Number of riders should be less than 5.";
        } else {
          isValid = true;
          errors["seats_available"] = "";
        }
      case keys.includes("start_location"):
        if (values.start_location === "") {
          isValid = false;
          errors["start_location"] = "This is a required field.";
        } else if (values.start_location.length < 4) {
          isValid = false;
          errors["start_location"] = "Please enter at-least 4 characters.";
        } else {
          isValid = true;
          errors["start_location"] = "";
        }
      case keys.includes("end_location"):
        if (values.end_location === "") {
          isValid = false;
          errors["end_location"] = "This is a required field.";
        } else if (values.end_location.length < 4) {
          isValid = false;
          errors["end_location"] = "Please enter at-least 4 characters.";
        } else {
          isValid = true;
          errors["end_location"] = "";
        }
      case keys.includes("price"):
        const price = values.price;
        if (price === "") {
          isValid = false;
          errors["price"] = "This is a required field.";
        } else if (price.match(/^(?:\d*\.\d{2})$/g)) {
          isValid = true;
          errors["price"] = "";
        } else {
          isValid = false;
          errors["price"] = "Please enter value in the format 00.00.";
        }
    }

    setErrorMsgs(errors);

    const objectKeys = Object.keys(errors);
    const isError = objectKeys.some((error) => {
      return errors[error] != "";
    });
    setHasErrors(isError);
    if (isError === false) {
      setValid(true);
      setSubmitted(true);
      axios
        .post(getBackendURL() + "/rides", values)
        .then((response) => {
          //console.log(response.data)
          setHasErrors(false);
          setSubmitted(true);
          setTimeout(() => {
            setSubmitted(false);
          }, 2000);
          setValues({
            name: "",
            leave_datetime: new Date(),
            start_location: "",
            end_location: "",
            price: "",
            seats_available: "",
            driver_id: user_id,
          });
        })
        .catch((error) => {
          console.log("error", error.errors);
        });
    } else {
      setValid(false);
      setSubmitted(false);
    }
  };

  if (!ucsbAccount(user)) {
    return (
      <Layout user={user}>
        <Container>
          <h1>Account Error: please login with your UCSB email!</h1>
        </Container>
      </Layout>
    );
  }
  return (
    <Layout user={user}>
      <Container>
        <h1>Create A Ride</h1>
        To make a personal drive available for passengers, please fill out the
        form below. This will allow users to sign up for your ride!
        <hr />
      </Container>

      <br />
      <div className="form-box">
        <form className="register-form" onSubmit={handleSubmit}>
          {!hasErrors && submitted ? (
            <div className="success-message">
              Success! Thank you for registering{" "}
            </div>
          ) : null}
          <input
            onChange={handleNameInputChange}
            value={values.name}
            className="form-field"
            placeholder="Name"
            name="name"
          />
          {errorMsgs.name && <p>{errorMsgs.name}</p>}
          <label>Leave/Datetime</label>
          <DateTimePicker
            onChange={handleLeave_DatetimeInputChange}
            value={values.leave_datetime}
            className="form-field"
            placeholder="Leave/Datetime"
            name="leaveTime"
          />
          {errorMsgs.leave_datetime && <p>{errorMsgs.leave_datetime}</p>}
          {/*<input
          onChange={handleLeave_DatetimeInputChange}
          value={values.leave_datetime}
          className="form-field"
          placeholder="Leave/Datetime"
          name="leaveTime" />
        {errorMsgs.leave_datetime && <p>{errorMsgs.leave_datetime}</p>} */}
          <input
            onChange={handleStart_LocationInputChange}
            value={values.start_location}
            className="form-field"
            placeholder="Start Location"
            name="start_location"
          />
          {errorMsgs.start_location && <p>{errorMsgs.start_location}</p>}
          <input
            onChange={handleEnd_LocationInputChange}
            value={values.end_location}
            className="form-field"
            placeholder="End Location"
            name="end_location"
          />
          {errorMsgs.end_location && <p>{errorMsgs.end_location}</p>}
          <input
            onChange={handlePriceInputChange}
            value={values.price}
            className="form-field"
            placeholder="Price"
            name="cost"
          />
          {errorMsgs.price && <p>{errorMsgs.price}</p>}
          <input
            type="number"
            onChange={handleSeats_AvailableInputChange}
            value={values.seats_available}
            className="form-field"
            placeholder="Seats Available"
            name="seats_available"
          />
          {errorMsgs.seats_available && <p>{errorMsgs.seats_available}</p>}
          <button className="form-field" type="submit">
            Submit
          </button>
        </form>
      </div>
      <br />
    </Layout>
  );
}
