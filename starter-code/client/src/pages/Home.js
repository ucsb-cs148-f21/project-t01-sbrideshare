import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Container from "react-bootstrap/Container";
import axios from 'axios';

import Layout from "../components/Layout";
import getUser from "../utils/get-user";
import getBackendURL from "../utils/get-backend-url";
import CarImg from "../images/home_pic.png";

const TextWrapper = styled.div`
  width: 700px;
  max-width: 100%;
`;

const Car = styled.img`
  width: 500px;
  max-width: 100%;
  height: AudioTrack;
`;

export default function Home() {
  const user = getUser();
  var baseURL = getBackendURL()+"/users";
  useEffect(() => {
    axios.post(baseURL, user)
    .then(() => console.log('User Created'))
    .catch(function(error) {console.log(error)})
  },[]);

  return (
    <Layout user={user}>
      <Container>
        <h1>Welcome to SB RideShare!</h1>
        <h5>A web application designed for UCSB students on the go.</h5>
        <hr />
        <TextWrapper>
          Users can either browse current rides and join them as passengers,
          or post one of their own rides as drivers that they are willing to take passengers for.
        </TextWrapper>
        <br />
        <TextWrapper>
          To search for available rides, go to the <a href="/Rides">Find A Ride</a> page.
        </TextWrapper>
        <br />
        <TextWrapper>
          To post your own ride, go to the <a href="/Ride">Create A Ride</a> page.
        </TextWrapper>
        <br />
        <TextWrapper>
          Happy carpooling!
        </TextWrapper>
      </Container>
    </Layout>
  );
}
