import React from "react";
import { Container, Jumbotron } from "react-bootstrap";
import "./App.css";

const Login = () => {
  return (
    <Container>
      <Jumbotron>
        <div class="form-container">
          <h2>Welcome back, please login</h2>
          <hr />
          <form action="#" id="login-form" method="POST">
            <div class="form-group">
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
            </div>
            <div class="form-btn-container">
              <button class="btn btn-success" type="submit">
                Log in
              </button>
              <a href="/" class="btn btn-secondary">
                Back to home
              </a>
            </div>
          </form>
        </div>
      </Jumbotron>
    </Container>
  );
};

export default Login;
