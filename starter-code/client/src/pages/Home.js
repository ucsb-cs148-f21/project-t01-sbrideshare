import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Container from "react-bootstrap/Container";
import axios from "axios";

import Layout from "../components/Layout";
import getUser from "../utils/get-user";
import getBackendURL from "../utils/get-backend-url";
import CarImg from "../images/home_pic.png";
import "../styles/home.css";


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
  var baseURL = getBackendURL() + "/users";
  useEffect(() => {
    const formattedUser = {
      full_name: user.fullName,
      given_name: user.givenName,
      family_name: user.familyName,
      imageUrl: user.image_url,
      email: user.email,
      id: user.id,
    };
    axios
      .post(baseURL, formattedUser)
      .then(() => console.log("User Created"))
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <Layout id="layout" user={user}>
      <Container id="home">
        <div id="home-title">
            <h1>Welcome to SB RideShare!</h1>
        </div>

        <div id="home-text">
            <TextWrapper>
            <h5>A web application designed for UCSB students on the go.</h5>
              Users can either browse current rides and join them as passengers, or
              post one of their own rides as drivers that they are willing to take
              passengers for.
              <br />
              Happy carpooling!
            </TextWrapper>
        </div>
      </Container>
    </Layout>
  );
}
