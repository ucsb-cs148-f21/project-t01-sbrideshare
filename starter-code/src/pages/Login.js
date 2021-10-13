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
        <br />
        <h1>SBRideShare Login Page!</h1>
        <TextWrapper>
        It will look a lot better once I style it
        </TextWrapper>
        <div id="login-button" />
    </Container>
);
}
