import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Container, Jumbotron } from "react-bootstrap";
import axios from "axios";
import "./App.css";

const Register = ({
  setLoggedIn,
  setUserLoggedIn,
  setAlertText,
  setAlertType,
}) => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [admin, setAdmin] = useState(false);

  const onSubmit = async () => {
    try {
      // For development on local server
      // const result = await axios.post(
      //   'http://localhost:5000/register',
      //   {
      //     username: username,
      //     password: password,
      //     email: email,
      //     first_name: firstName,
      //     last_name: lastName,
      //     is_admin: false
      //   }
      // );

      // For production on Heroku
      const result = await axios.post(
        "https://sca-cpt-backend.herokuapp.com/register",
        {
          username: username,
          password: password,
          email: email,
          first_name: firstName,
          last_name: lastName,
          is_admin: false,
        }
      );

      if (result) {
        setLoggedIn(true);
        setUserLoggedIn(username);
        history.push("/user");
        setAlertType("success");
        setAlertText("You have successfully registered and logged in.");
        window.setTimeout(() => setAlertText(false), 4000);
      }
    } catch (e) {
      setAlertType("danger");
      setAlertText(
        "There was an error! Please try again, or contact us for more help."
      );
      window.setTimeout(() => setAlertText(false), 4000);
      console.error(e);
    }
  };

  return (
    <Container>
      <Jumbotron>
        <div className="form-container">
          <h2>Welcome! Enter your information to register</h2>
          <hr />
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
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
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
            <label htmlFor="confirm-pass">Confirm Password</label>
            <input
              type="password"
              id="confirm-pass"
              name="confirm-pass"
              placeholder="Reenter Password"
              required
            ></input>
            <label htmlFor="f-name">First Name</label>
            <input
              type="text"
              id="f-name"
              name="f-name"
              placeholder="Enter Your First Name"
              value={firstName}
              required
              onChange={(e) => setFirstName(e.target.value)}
            ></input>
            <label htmlFor="l-name">Last Name</label>
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
        </div>
      </Jumbotron>
    </Container>
  );
};

export default Register;
