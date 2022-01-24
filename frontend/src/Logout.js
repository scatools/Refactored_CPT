import React from "react";
import { Container, Jumbotron } from "react-bootstrap";
import "./App.css";

const Logout = ({ setLoggedIn }) => {
  setLoggedIn(false);
  return (
    <Container>
      <Jumbotron>
        <h2>You have successfully logged out.</h2>
        <hr />
        <p className="lead">Thanks for using the SCA Conservation Prioritization Tool!</p>
      </Jumbotron>
    </Container>
  )
};

export default Logout;