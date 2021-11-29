import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Search from "../components/Search";
import getUser from "../utils/get-user";
import Layout from "../components/Layout";
import Container from "react-bootstrap/Container";
import List from "./ride-files/List";
import getBackendURL from "../utils/get-backend-url";
import {ThemeProvider} from '@mui/material/styles';
import getTheme from "./ride-files/ListTheme";

export default function MyRides() {
  const user = getUser();
  const theme = getTheme();

  const [list, makeList] = React.useState(
    "Attempting to connect to the server...",
  );

  var baseURL = getBackendURL() + "/rides";
  useEffect(() => {
    axios
      .get(baseURL)
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          var rider = false;
          if (response.data[i].driver_id == user.id) {
            rider = true;
          }
          for (var j = 0; j < response.data[i].riders.length; j++) {
            if (response.data[i].riders[j].rider_id == user.id) {
              rider = true;
            }
          }
          if (!rider) {
            response.data.splice(i, 1);
            i--;
          }
        }
        makeList(<List rideInfo={response.data} />);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <Layout user={user} navBarActive={"My Rides"}>
      <ThemeProvider theme={theme}> 
        <Container>
          <br />
          <h1>My Rides</h1>
          A list of rides that you are currently signed up for.
          <hr />
          {list}
        </Container>
      </ ThemeProvider>
    </Layout>
  );
}
