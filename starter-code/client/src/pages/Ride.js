import React, { useEffect, useRef, useState } from "react";
import "./index2.css";
import Container from "react-bootstrap/Container";

import Layout from "../components/Layout";
import getUser from "../utils/get-user";
import ucsbAccount from "../utils/ucsb-account";
import axios from "axios";
import getBackendURL from "../utils/get-backend-url";
import TextField from "@mui/material/TextField";
import DateTimePicker from "@mui/lab/DateTimePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import FormLabel from "@mui/material/FormLabel";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import usePlacesAutocomplete from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import NumberFormat from "react-number-format";
import Slider from "@mui/material/Slider";
import Tooltip from "@mui/material/Tooltip";
import HelpIcon from "@mui/icons-material/Help";

export default function Ride() {
  const google_user = getUser();
  const user_id = google_user.id;

  const [location, setLocation] = useState("");
  const [shouldShowContact, setShouldShowContact] = useState(false);
  const [shouldPickupRiders, setShouldPickupRiders] = useState(false);

  const [values, setValues] = useState({
    name: google_user.fullName,
    leave_datetime: new Date(),
    start_location: "",
    end_location: "",
    price: "",
    seats_available: "",
    driver_id: user_id,
    contact: "",
    rider_radius: "0",
  });
  const [shouldPickup, setShouldPickup] = useState(false);
  const [shouldAddNumber, setShouldAddNumber] = useState(false);
  const [rangeValue, setRangeValue] = useState(10);
  const [startPlaceId, setStartPlaceId] = useState("");
  const [endPlaceId, setEndPlaceId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState({});
  const [hasErrors, setHasErrors] = useState(false);
  const user = getUser();
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });
  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleStartSelect = ({ description, place_id }) => () => {
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    setValue(description, false);

    clearSuggestions();

    setValues({
      ...values,
      start_location: description,
    });
    setStartPlaceId(place_id);
  };

  const handleEndSelect = ({ description, place_id }) => () => {
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    setValue(description, false);

    clearSuggestions();
    setValues({
      ...values,
      end_location: description,
    });
    setEndPlaceId(place_id);
  };

  const renderStartSuggestions = (location) =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={
            location === "start_location"
              ? handleStartSelect(suggestion, place_id)
              : handleEndSelect(suggestion, place_id)
          }
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  const renderEndSuggestions = (location) =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={
            location === "start_location"
              ? handleStartSelect(suggestion)
              : handleEndSelect(suggestion)
          }
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  const handleRadioBtnChange = (event) => {
    const shouldShow = event.target.value === "yes";
    setShouldShowContact(shouldShow);
  };

  const handlePickupRadioBtnChange = (event) => {
    const shouldPickup = event.target.value === "yes";
    setShouldPickupRiders(shouldPickup);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "start_location":
        setValue(value);
        setLocation("start");
        setValues((prev) => {
          return {
            ...prev,
            [name]: value,
          };
        });
        break;
      case "end_location":
        setValue(value);
        setLocation("end");
        setValues((prev) => {
          return {
            ...prev,
            [name]: value,
          };
        });
        break;
      default:
        if (name !== "leave_datetime") {
          setValues((prev) => {
            return {
              ...prev,
              [name]: value,
            };
          });
        }
        break;
    }
  };

  const handlePickupChange = (event) => {
    if (event.target.checked) {
      setShouldPickup(true);
    } else {
      setShouldPickup(false);
      //if (!submitted) {
      setValues((prev) => {
        return {
          ...prev,
          rider_radius: "0",
        };
      });
      //}
    }
  };

  const handleNumberChange = (event) => {
    if (event.target.checked) {
      setShouldAddNumber(true);
    } else {
      setShouldAddNumber(false);
      //if (!submitted) {
      setValues((prev) => {
        return {
          ...prev,
          contact: "",
        };
      });
      //}
    }
  };

  const handleLeave_DatetimeInputChange = (date) => {
    setValues({ ...values, leave_datetime: date });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let isValid = false;
    const keys = Object.keys(values);
    const errors = {
      name: "",
      leave_datetime: new Date(),
      start_location: "",
      end_location: "",
      price: "",
      seats_available: "",
      rider_radius: "",
      contact: "",
      driver_id: "",
    };

    switch (true) {
      case keys.includes("leave_datetime"):
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
          errors["seats_available"] =
            "Number of riders should not be less than 1.";
        } else if (seats_available > 10) {
          isValid = false;
          errors["seats_available"] =
            "Number of riders should be less than 11.";
        } else {
          isValid = true;
          errors["seats_available"] = "";
        }

      case keys.includes("rider_radius"):
        if (shouldPickupRiders) {
          const rider_radius = parseInt(values.rider_radius, 10);
          if (values.rider_radius === "") {
            isValid = false;
            errors["rider_radius"] = "This is a required field.";
          } else if (values.rider_radius === "0") {
            isValid = false;
            errors["rider_radius"] = "Rider radius must be greater than zero.";
          } else {
            isValid = true;
            errors["rider_radius"] = "";
          }
        } //else {
      //   isValid = true;
      //   errors["rider_radius"] = "";
      // }

      case keys.includes("start_location"):
        if (values.start_location === "") {
          isValid = false;
          errors["start_location"] = "This is a required field.";
        } else if (values.start_location?.length < 4) {
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
        } else if (values.end_location?.length < 4) {
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

      case keys.includes("contact"):
        if (shouldShowContact) {
          const contact = values.contact;
          const contactNumber = contact.replace(/\D+/g, "");
          if (contactNumber === "") {
            isValid = false;
            errors["contact"] = "This is a required field.";
          } else if (contactNumber.length !== 10) {
            isValid = false;
            errors["contact"] = "Please enter number in form (XXX) XXX-XXXX";
          } else {
            isValid = true;
            errors["contact"] = "";
          }
        }
    }

    setErrorMsgs(errors);

    const objectKeys = Object.keys(errors);
    const isError = objectKeys.some((key) => {
      return errors[key] != "";
    });
    setHasErrors(isError);
    if (isError === false) {
      setValid(true);
      setSubmitted(true);
      const contactNumber = values.contact.replace(/\D+/g, "");
      axios
        .post(getBackendURL() + "/rides", {
          ...values,
          start_location: startPlaceId,
          end_location: endPlaceId,
          contact: shouldShowContact ? contactNumber : "",
          rider_radius: shouldPickupRiders ? values.rider_radius : "0",
        })
        .then((response) => {
          setHasErrors(false);
          setSubmitted(true);
          setTimeout(() => {
            setSubmitted(false);
          }, 2000);
          setValues({
            name: google_user.fullName,
            leave_datetime: new Date(),
            start_location: "",
            end_location: "",
            price: "",
            seats_available: "",
            rider_radius: "0",
            contact: "",
            driver_id: user_id,
          });
          setShouldPickup(false);
          setShouldAddNumber(false);
          setShouldPickupRiders(false);
          setShouldShowContact(false);
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
    <Layout user={user} navBarActive={"Create A Ride"}>
      <Container>
        <br />
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
            onChange={handleInputChange}
            value={values.name}
            className="form-field"
            placeholder="Name"
            name="google_user.id"
            autoComplete="off"
          />
          {errorMsgs.name && <p className="error-msg">{errorMsgs.name}</p>}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              onChange={handleLeave_DatetimeInputChange}
              value={values.leave_datetime}
              className="form-field"
              placeholder="Leave/Datetime"
              name="leave_datetime"
              autoComplete="off"
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          {errorMsgs.leave_datetime && (
            <p className="error-msg">{errorMsgs.leave_datetime}</p>
          )}
          <div ref={ref}>
            <input
              value={values.start_location}
              name="start_location"
              onChange={handleInputChange}
              placeholder="Start Location"
              className="form-field"
              autoComplete="off"
            />
            {/* We can use the "status" to decide whether we should display the dropdown or not */}
            {status === "OK" && location === "start" && (
              <ul>{renderStartSuggestions("start_location")}</ul>
            )}
          </div>
          {errorMsgs.start_location && (
            <p className="error-msg">{errorMsgs.start_location}</p>
          )}
          <div ref={ref}>
            <input
              value={values.end_location}
              name="end_location"
              onChange={handleInputChange}
              placeholder="End Location"
              className="form-field"
              autoComplete="off"
            />
            {/* We can use the "status" to decide whether we should display the dropdown or not */}
            {status === "OK" && location === "end" && (
              <ul>{renderEndSuggestions("end_location")}</ul>
            )}
          </div>
          {errorMsgs.end_location && (
            <p className="error-msg">{errorMsgs.end_location}</p>
          )}
          <input
            onChange={handleInputChange}
            value={values.price}
            className="form-field"
            placeholder="Price"
            name="price"
            autoComplete="off"
          />
          {errorMsgs.price && <p className="error-msg">{errorMsgs.price}</p>}
          <input
            type="number"
            onChange={handleInputChange}
            value={values.seats_available}
            className="form-field"
            placeholder="Seats Available"
            name="seats_available"
            autoComplete="off"
          />
          {errorMsgs.seats_available && (
            <p className="error-msg">{errorMsgs.seats_available}</p>
          )}
          <div>
            Are you willing to pickup riders?
            <div className="radio-btn">
              <div>
                <input
                  type="radio"
                  name="should_pickup"
                  value="yes"
                  checked={shouldPickupRiders}
                  onChange={handlePickupRadioBtnChange}
                />{" "}
                Yes
              </div>
              <div>
                <input
                  type="radio"
                  name="should_pickup"
                  value="no"
                  checked={!shouldPickupRiders}
                  onChange={handlePickupRadioBtnChange}
                />{" "}
                No
              </div>
            </div>
          </div>
          {shouldPickupRiders && (
            <div>
              How far are you willing to pickup riders from your start location
              (in meters)
              <Tooltip title="1600 meters = 0.99 miles">
                <HelpIcon />
              </Tooltip>
              <div>
                <Slider
                  name="rider_radius"
                  onChange={handleInputChange}
                  value={values.rider_radius}
                  step={250}
                  min={500}
                  max={3000}
                  aria-label="Default"
                  valueLabelDisplay="auto"
                />
              </div>
              {errorMsgs.rider_radius && (
                <p className="error-msg">{errorMsgs.rider_radius}</p>
              )}
            </div>
          )}
          <div>
            Do you want to enter your contact Information?
            <div className="radio-btn">
              <div>
                <input
                  type="radio"
                  name="contact_info"
                  value="yes"
                  checked={shouldShowContact}
                  onChange={handleRadioBtnChange}
                />{" "}
                Yes
              </div>
              <div>
                <input
                  type="radio"
                  name="contact_info"
                  value="no"
                  checked={!shouldShowContact}
                  onChange={handleRadioBtnChange}
                />{" "}
                No
              </div>
            </div>
          </div>
          <div
            className={`contact-number ${shouldShowContact ? "show" : "hide"}`}
          >
            <NumberFormat
              type="tel"
              onChange={handleInputChange}
              // required
              value={values.contact}
              className="form-field"
              placeholder="Contact Number"
              name="contact"
              autoComplete="off"
              format="(###) ###-####"
              mask="_"
            />
            {errorMsgs.contact && (
              <p className="error-msg">{errorMsgs.contact}</p>
            )}
          </div>
          <button className="form-field" type="submit">
            Submit
          </button>
        </form>
      </div>
      <br />
    </Layout>
  );
}
