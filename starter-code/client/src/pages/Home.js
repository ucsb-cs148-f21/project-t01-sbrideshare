import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import styled from "styled-components";
import Container from "react-bootstrap/Container";
import axios from "axios";
import { Carousel } from "react-bootstrap";

import Layout from "../components/Layout";
import getUser from "../utils/get-user";
import getBackendURL from "../utils/get-backend-url";
import CarImg from "../images/home_pic.png";
import "../styles/home.css";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import mapache from '../images/mapache.png';
import coconutPalm from '../images/coconut-palm-tree.png';

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
    <Layout id="layout" user={user}>
      <Container id="home">
        <div id="home-title">
            <h1>Welcome to SB RideShare!</h1>
        </div>

        <div id="home-text">
            {/*<TextWrapper>
            <h5>A web application designed for UCSB students on the go.</h5>
              Users can either browse current rides and join them as passengers, or
              post one of their own rides as drivers that they are willing to take
              passengers for.
              <br />
              Happy carpooling!
            </TextWrapper>*/}
        </div>
        <Carousel fade prevIcon="">
          
          <Carousel.Item>
          <div id="first-card">
          <Card id="left-card">
              <CardActionArea component={RouterLink} to="/rides">
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
                    Join a ride from another UCSB student.
                  </Typography>
                  {//<img src={mapache} id="mapache-pic"/>
                  }
                </CardContent>
              </CardActionArea>
          </Card>
            <Carousel.Caption>
              {/*<h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>*/}
            </Carousel.Caption>
            </div>
          </Carousel.Item>
          <Carousel.Item>
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
                  {//<img src={coconutPalm} id="coconut-palm-pic"/>
                  }
                </CardContent>
              </CardActionArea>
            </Card>

            <Carousel.Caption>
              {/*<h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>*/}
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        {/*
        <div className="card-row">
          <div className="column">
          <Card id="left-card">
              <CardActionArea component={RouterLink} to="/rides">
                <CardMedia
                  component=""
                  height="140"
                  image=""
                  alt=""
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Find A Ride
                  </Typography>
                  <img src={mapache} id="mapache-pic"/>
                </CardContent>
              </CardActionArea>
          </Card>
          </div>
          
          <div className="column">
          <Card id="right-card">
            <CardActionArea component={RouterLink} to="/ride">
              <CardMedia
                component=""
                height="140"
                image=""
                alt=""
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Create A Ride
                </Typography>
                <img src={coconutPalm} id="coconut-palm-pic"/>
              </CardContent>
            </CardActionArea>
           </Card>
          </div>
        </div> */}
      </Container>
    </Layout>
  );
}
