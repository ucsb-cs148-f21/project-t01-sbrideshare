import React, { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import CheckingSignedIn from "./pages/CheckingSignedIn";
import Login from "./pages/Login";
import Home from "./pages/Home";
import RidesList from "./pages/RidesList";
import Ride from "./pages/Ride";
import MyRides from "./pages/MyRides";
import PageNotFound from "./pages/PageNotFound";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(null);

  const script = document.createElement("script");
  script.src = "https://apis.google.com/js/platform.js";
  script.onload = () => initGoogleSignIn();
  document.body.appendChild(script);

  function initGoogleSignIn() {
    if (window.gapi === undefined) {
      return;
    }
    window.gapi.load("auth2", () => {
      window.gapi.auth2
        .init({
          client_id: process.env.REACT_APP_AUTH_CLIENT_ID,
        })
        .then(() => {
          const authInstance = window.gapi.auth2.getAuthInstance();
          const isSignedIn = authInstance.isSignedIn.get();
          setIsSignedIn(isSignedIn);

          authInstance.isSignedIn.listen((isSignedIn) => {
            setIsSignedIn(isSignedIn);
          });
        });
    });
    window.gapi.load("signin2", () => {
      window.gapi.signin2.render("login-button", {
        theme: "light",
      });
    });
  }

  function PrivateRoute(props) {
    const { component, ...rest } = props;
    return <Route {...rest} component={isSignedIn ? component : Login} />;
  }

  if (isSignedIn !== null) {
    return (
      <BrowserRouter>
        <Switch>
          {!isSignedIn && <Route exact path="/" component={Login} />}
          <Route exact path="/" component={Home} />
          <PrivateRoute exact path="/rides" component={RidesList} />
          <PrivateRoute exact path="/ride" component={Ride} />
          <PrivateRoute exact path="/myrides" component={MyRides} />
          <Route path="/" component={PageNotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
  const script2 = document.createElement("script");
  script2.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`;
  // script2.onload = () => initGoogleSignIn();
  script2.async = true;
  document.body.appendChild(script2);
  return <CheckingSignedIn />;
}
