import React, { useState } from "react";
import './index2.css';


import Layout from "../components/Layout";
import getUser from "../utils/get-user";


export default function Ride() {
  const [values, setValues] = useState({
    name:"",
    leaveTime: "",
    numRiders: "",
    destination: "",
    cost: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);
  const user = getUser();

  const handleNameInputChange = (event) =>{
    setValues({...values, name: event.target.value})
  }

  const handleLeaveTimeInputChange = (event) =>{
    setValues({...values, leaveTime: event.target.value})
  }
  const handleNumberRidersInputChange = (event) =>{
    setValues({...values, numRiders: event.target.value})
  }
  const handleDestinationInputChange = (event) =>{
    setValues({...values, destination: event.target.value})
  }
  const handleCostInputChange = (event) =>{
    setValues({...values, cost: event.target.value})
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if(values.name && values.leaveTime && values.numRiders && values.destination && values.cost) {
      setValid(true);
    }
    setSubmitted(true);
  }
  

  return (
    <Layout user={user}>
      <br />
       <div class="form-box">
      <form className="register-form" onSubmit={handleSubmit}>
        {submitted && valid? <div className="success-message">Success! Thank you for registering </div> :null}
        <input
          onChange={handleNameInputChange}
          value={values.name}
          className="form-field"
          placeholder="Name"
          name="name" />
          {submitted && !values.name ? <span>Please enter a name</span> : null}
        <input
          onChange={handleLeaveTimeInputChange}
          value={values.leaveTime}
          className="form-field"
          placeholder="Leave Time"
          name="leaveTime" />
          {submitted && !values.leaveTime ? <span>Please enter a leave time</span> : null}
        <input
          onChange={handleNumberRidersInputChange}
          value={values.numRiders}
          className="form-field"
          placeholder="Number of Riders"
          name="numRiders" />
          {submitted && !values.numRiders ? <span>Please enter number of riders</span> : null}
          <input
          onChange={handleDestinationInputChange}
          value={values.destination}
          className="form-field"
          placeholder="Destination"
          name="destination" />
          {submitted && !values.destination ? <span>Please enter your destination</span> : null}
          <input
          onChange={handleCostInputChange}
          value={values.cost}
          className="form-field"
          placeholder="Cost"
          name="cost" />
          {submitted && !values.cost ? <span>Please enter price</span> : null}

        <button class="form-field" type="submit">
          Submit
        </button>
      </form>
    </div>
    <br />
    </Layout>
  );
}
