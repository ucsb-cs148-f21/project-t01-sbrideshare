import React, {useEffect,useState} from "react";
import axios from 'axios';
import styled from "styled-components";

import getUser from "../utils/get-user";
import Layout from "../components/Layout";
import Container from "react-bootstrap/Container";
import List from "./ride-files/List";
import getBackendURL from "../utils/get-backend-url";



export default function RidesList() {
  const user = getUser();
  
  const [list, makeList] = React.useState("Unable to connect to the server.");

  var baseURL = getBackendURL()+"/rides";
  useEffect(() => {
    axios.get(baseURL)
    .then(function (response) {
      makeList(<List rideInfo={response.data}/>);
    })
    .catch(function(error) {console.log(error)})
  },[]);

  
  return (
    <Layout user={user}>
      <Container>
        <h1>Rides</h1>
        To join a ride, select the green sign-up button.
        <hr/>
        {list}

      </Container>
    </Layout>
  );
}
