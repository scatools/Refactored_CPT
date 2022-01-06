import React from "react";
import { Container, Jumbotron } from "react-bootstrap";
import "./App.css";

const Register = () => {
  return (
    <Container>
      <Jumbotron>
        <div className="form-container">
          <h2>Welcome! Enter your information to register</h2>
          <hr />
          <form action="#" id="register-form" method="POST">
            <div className="form-group">
              <label for="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter Username"
                required
              ></input>
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter Password"
                required
              ></input>
              <label for="confirm-pass">Confirm Password</label>
              <input
                type="password"
                id="confirm-pass"
                name="confirm-pass"
                placeholder="Reenter Password"
                required
              ></input>
              <label for="f-name">First Name</label>
              <input
                type="text"
                id="f-name"
                name="f-name"
                placeholder="Enter Your First Name"
                required
              ></input>
              <label for="l-name">Last Name</label>
              <input
                type="text"
                id="l-name"
                name="l-name"
                placeholder="Enter Your Last Name"
                required
              ></input>
            </div>
            <div className="form-btn-container">
              <button className="btn btn-success" type="submit">
                Register
              </button>
              <a href="/" className="btn btn-secondary">
                Back to home
              </a>
            </div>
          </form>
        </div>
      </Jumbotron>
    </Container>
  );
};

export default Register;
