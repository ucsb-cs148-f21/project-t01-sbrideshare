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
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import HailIcon from '@mui/icons-material/Hail';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';


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

  const [backgroundImage, setBackgroundImage] = React.useState("none");

  return (
    <Layout id="layout" user={user} navBarActive={"Home"} background={backgroundImage}>
      <Container id="home">
        <div id="home-title">
            <h1>Welcome to SB RideShare!</h1>
        </div>
        <Carousel fade prevIcon="" nextIcon="" indicators="false">
          
          <Carousel.Item>
          <Tabs defaultActiveKey="ride">
            <Tab eventKey="ride" title={<span>Ride <HailIcon fontSize="large"/></span>}>
            </Tab>
            <Tab eventKey="drive" title={<span>Drive <DriveEtaIcon fontSize="large"/></span>} disabled>
            </Tab>
          </Tabs>
          <Card id="first-card">
              <CardActionArea id="first-card-content" component={RouterLink} to="/rides">
                <CardMedia
                  component=""
                  underline="none"
                  height="140"
                  image=""
                  alt=""
                />
                <CardContent>
                  <br />
                  <Typography gutterBottom variant="h2" component="div">
                    Find A Ride
                  </Typography>

                  <Typography variant="p" component="div"> 
                    Join in on a ride to your destination with a fellow UCSB Gaucho.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Carousel.Item>

          <Carousel.Item>
            <Tabs defaultActiveKey="drive" transition={false} id="first-tab">
              <Tab eventKey="ride" title={<span>Ride <HailIcon fontSize="large"/></span>} tabClassName="first-tab" disabled>
              </Tab>
              <Tab eventKey="drive" title={<span>Drive <DriveEtaIcon fontSize="large"/></span>}>
              </Tab>
            </Tabs>
            <Card id="second-card">
              <CardActionArea id="second-card-content" component={RouterLink} to="/ride">
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
          </Carousel.Item>
        </Carousel>
      </Container>
    </Layout>
  );
}
