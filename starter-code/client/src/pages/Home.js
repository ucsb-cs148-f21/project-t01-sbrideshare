import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import styled from "styled-components";
import Container from "react-bootstrap/Container";
import axios from "axios";
import { Carousel } from "react-bootstrap";

import Layout from "../components/Layout";
import getUser from "../utils/get-user";
import getBackendURL from "../utils/get-backend-url";
import "../styles/home.css";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

const TextWrapper = styled.div`
  width: 700px;
  max-width: 100%;
`;

export default function Home() {
  const user = getUser();
  var baseURL = getBackendURL() + "/users";
  useEffect(() => {
    const formattedUser = {
      full_name: user.fullName,
      given_name: user.givenName,
      family_name: user.familyName,
      image_url: user.imageUrl,
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
    <Layout id="layout" user={user} navBarActive={"Home"}>
      <Container id="home">
        <div id="home-title">
            <h1>Welcome to SB RideShare!</h1>
        </div>
        <Carousel fade prevIcon="">
          
          <Carousel.Item>
          <div id="first-card">
          <Card id="left-card">
              <CardActionArea component={RouterLink} to="/rides" root="text-decoration: none">
                <CardMedia
                  component=""
                  underline="none"
                  height="140"
                  image=""
                  alt=""
                />
                <CardContent>
                  <br />
                  <Typography className="typography" gutterBottom variant="h2" component="div">
                    Find A Ride
                  </Typography>

                  <Typography variant="p" component="div"> 
                    Join a ride from another UCSB student.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <div id="second-card">
            <Card id="right-card">
              <CardActionArea component={RouterLink} to="/ride">
                <CardMedia
                  component=""
                  height="140"
                  image=""
                  alt=""
                />
                <CardContent>
                  <br />
                  <Typography gutterBottom variant="h2" component="div">
                    Create A Ride
                  </Typography>

                  <Typography variant="p" component="div"> 
                    Drive on the platform with the largest network of UCSB students.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            </div>
          </Carousel.Item>
        </Carousel>
      </Container>
    </Layout>
  );
}
