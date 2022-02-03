import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { Container, Jumbotron } from "react-bootstrap";
import axios from "axios";
import "./App.css";

const Login = ({ setLoggedIn, setUserLoggedIn }) => {
  const history = useHistory();
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  
  const onSubmit = async () => {
    // For development on local server
    // const result = await axios.post(
    //   'http://localhost:5000/login',
    //   { username: username, password: password }
    // );

    // For production on Heroku
    const result = await axios.post(
      'https://sca-cpt-backend.herokuapp.com/login',
      { username: username, password: password }
    );

    if (result.data.credentials.length === 0) {
			alert("Username doesn't exist! Please register.");
		} else if (!result.data.validLogin) {
			alert("Incorrect password! Please enter again.");
		} else {
      setLoggedIn(true);
      setUserLoggedIn(username);
      history.push("/user");
		}
  };

  return (
    <Container>
      <Jumbotron>
        <div className="form-container">
          <h2>Welcome back, please login</h2>
          <hr />
          <form id="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter Username"
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
              ></input>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>
            <div className="form-btn-container">
              <button className="btn btn-success" type="button" onClick={onSubmit}>
                Log In
              </button>
              <button href="/" className="btn btn-secondary">
                Go Back
              </button>
            </div>
          </form>
        </div>
      </Jumbotron>
    </Container>
  );
};

export default Login;
