import React, {useEffect,useState} from "react";
import axios from 'axios';
import styled from "styled-components";

import getUser from "../utils/get-user";
import Layout from "../components/Layout";
import Container from "react-bootstrap/Container";
import List from "./ride-files/List";

export default function RidesList() {
  const user = getUser();
  
  const [list, makeList] = React.useState("Unable to connect to the server.");

  useEffect(() => {
    axios.get("http://localhost:9000/testAPI/testRides")
    .then(function (response) {
      makeList(<List rideInfo={response.data}/>);
    })
    .catch(function(error) {console.log(error)})
  },[]);

  
  return (
    <Layout user={user}>
      <Container>
        <h1>Rides</h1>
        <br />
        <hr/>
        {list}

      </Container>
    </Layout>
  );
}
