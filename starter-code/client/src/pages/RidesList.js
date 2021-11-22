import React, { useEffect, useState } from "react";
import axios from "axios";

import getUser from "../utils/get-user";
import Layout from "../components/Layout";
import Container from "react-bootstrap/Container";
import List from "./ride-files/List";
import getBackendURL from "../utils/get-backend-url";
import Search from "../components/Search";
import {ThemeProvider} from '@mui/material/styles';
import getTheme from "./ride-files/ListTheme";

export default function RidesList() {
  const theme = getTheme();
  const user = getUser();

  const [list, makeList] = React.useState(
    "Attempting to connect to the server...",
  );

  var baseURL = getBackendURL() + "/rides";
  useEffect(() => {
    axios
      .get(baseURL)
      .then(function (response) {
        makeList(<List rideInfo={response.data} />);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <Layout user={user} navBarActive={"Find A Ride"}>
      <ThemeProvider theme={theme}> 
        <Container>
          <br />
          <h1>Rides</h1>
          To join a ride, select the green sign-up button.
          <hr />
          <Search />
          <p />
          {list}
        </Container>
      </ ThemeProvider>
    </Layout>
  );
}
