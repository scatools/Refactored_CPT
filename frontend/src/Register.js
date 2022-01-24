import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { Container, Jumbotron } from "react-bootstrap";
import axios from "axios";
import "./App.css";

const Register = ({ setLoggedIn, setUserLoggedIn }) => {
  const history = useHistory();
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ firstName, setFirstName ] = useState("");
  const [ lastName, setLastName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ admin, setAdmin ] = useState(false);
  
  const onSubmit = async () => {
    try {
      const result = await axios.post('http://localhost:5000/register',{
        username: username,
        password: password,
        email: email,
        first_name: firstName,
        last_name: lastName,
        is_admin: false
      });
      // console.log(result);
      if (result) {
        setLoggedIn(true);
        setUserLoggedIn(username);
        history.push("/user");
      }
    }
    catch (e) {
      alert("Username already exists! Please log in or create a new account.");
      console.error(e);
    };
  };

  return (
    <Container>
      <Jumbotron>
        <div className="form-container">
          <h2>Welcome! Enter your information to register</h2>
          <hr />
          <form id="register-form">
            <div className="form-group">
              <label for="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter Username"
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
              ></input>
              <label for="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Enter Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              ></input>
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
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
                value={firstName}
                required
                onChange={(e) => setFirstName(e.target.value)}
              ></input>
              <label for="l-name">Last Name</label>
              <input
                type="text"
                id="l-name"
                name="l-name"
                placeholder="Enter Your Last Name"
                value={lastName}
                required
                onChange={(e) => setLastName(e.target.value)}
              ></input>
            </div>
            <div className="form-btn-container">
              <button className="btn btn-success" type="button" onClick={onSubmit}>
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
