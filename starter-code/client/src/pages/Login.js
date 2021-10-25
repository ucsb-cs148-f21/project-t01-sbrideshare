import React from "react";
import styled from "styled-components";
import "../styles/login.css";

import getUser from "../utils/get-user";
import Layout from "../components/Layout";
import Container from "react-bootstrap/Container";

const TextWrapper = styled.div`
  width: 700px;
  max-width: 100%;
`;

export default function Login() {
  const user = getUser();
    return (

    <Container id="login-container">
        <h1>SB RideShare</h1>
        <p>To continue, please sign in with a valid "ucsb.edu" email.</p>
        <TextWrapper>
        </TextWrapper>
        <br />
        <div id="login-button" />
    </Container>
);
}
