import React, { useState } from "react";
import styled from "styled-components";
import "../styles/login.css";

import getUser from "../utils/get-user";

import Container from "react-bootstrap/Container";
import { Pagination, PaginationItem } from '@mui/material';
import Button from '@mui/material/Button';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

const TextWrapper = styled.div`
  width: 700px;
  max-width: 100%;
`;

export default function Login() {
  const user = getUser();
  const [page, setPage] = useState(1);
  const [showGoogle, setShowGoogle] = useState(false);

  const firstPage = () => (
    <Container>
      <p id="title">SB RideShare</p>
      <br />
    </Container>
  );

  const [componentDisplayed, setComponentDisplayed] = useState(firstPage);

  const secondPage = () => (
    <Container id="secondPage">
      <p>SB RideShare is an application designed to simplify the process of </p>
      <p>creating and joining rideshares from the UCSB area.</p>
      <p>To continue, please sign in with a valid "ucsb.edu" email.</p>
      <br />
      <div id="login-button" />
    </Container>
  );
  const handleChange = (event, value) => {
    if(value == 1) {
      setComponentDisplayed(firstPage);
      setShowGoogle(false);
    }else if(value == 2){
      setComponentDisplayed(secondPage);
      setShowGoogle(true);
    }else {
      setComponentDisplayed(secondPage);
      setShowGoogle(true);
      setPage(2);
      return;
    }
    setPage(value);
  };

    return (
      <Container id="login-container">

        {componentDisplayed}
        <Button id="get-started-button" variant="contained" size="large" onClick={handleChange} style={{display: !showGoogle ? "flex" : "none"}}>Get Started &nbsp; {<DoubleArrowIcon fontSize="large"/>}</Button>
        <div id="login-button" style={{display: showGoogle ? "flex" : "none"}}/>

        <Pagination 
          id="pagination" 
          count={2} 
          page={page} 
          hideNextButton={true} 
          hidePrevButton={true} 
          onChange={handleChange} 
          component={componentDisplayed} 
          color="primary" 
          shape="rounded"
          sx={{displayPrint: 'none'}}
          variant="outlined"
        />
      
      </Container>
    );
}
