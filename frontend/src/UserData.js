import React, { useState, useEffect } from "react";
import { Container, Jumbotron } from "react-bootstrap";
import axios from "axios";
import "./App.css";

let userShapefiles = [];
let userReports = [];

const UserData = ({ userLoggedIn }) => {
  const [ username, setUsername ] = useState(null);
  const [ password, setPassword ] = useState(null);
  const [ firstName, setFirstName ] = useState(null);
  const [ lastName, setLastName ] = useState(null);
  const [ email, setEmail ] = useState(null);
  const [ admin, setAdmin ] = useState(false);
  
  const getUserData = async () => {
    // For development on local server
    // const result = await axios.post(
    //   'http://localhost:5000/user',
    //   { username: userLoggedIn }
    // );

    // For production on Heroku
    const result = await axios.post(
      'https://sca-cpt-backend.herokuapp.com/user',
      { username: userLoggedIn }
    );
    
    setUsername(result.data.rows[0].username);
    setPassword(result.data.rows[0].password);
    setFirstName(result.data.rows[0].first_name);
    setLastName(result.data.rows[0].last_name);
    setEmail(result.data.rows[0].email);
    setAdmin(result.data.rows[0].is_admin);
  };

  useEffect(() => {
    getUserData()
  }, [userLoggedIn]);
  
  if (userLoggedIn) {
    return (
      <Container>
        <Jumbotron>
          <h1 className="display-4">
            Welcome back, {firstName} {lastName}
          </h1>
          <p className="lead">Please review or modify your personal information here</p>
          <hr className="my-4" />
          <p className="h3">User Profile</p>
          <p>Your username: {username}</p>
          <p>Your email: {email}</p>
          <div className="btn-container">
            {admin && (
              <a className="btn btn-success" href="/admin">
                Admin module
              </a>
            )}
            <a className="btn btn-success" href="/users/profile">
              Update user information
            </a>
            <a className="btn btn-success" href="/users/changepassword">
              Change password
            </a>
            <a className="btn btn-danger" href="/">
              Delete user
            </a>
          </div>
  
          <hr className="my-4" />
          <p className="h3">Saved Shapefiles</p>
          <br />
          {userShapefiles.length > 0 ? (
            { userShapefiles }
          ) : (
            <p className="lead">No shapefile saved yet!</p>
          )}

          <hr className="my-4" />
          <p className="h3">Saved Reports</p>
          <br />
          {userReports.length > 0 ? (
            { userReports }
          ) : (
            <p className="lead">No report saved yet!</p>
          )}
        </Jumbotron>
      </Container>
    );
  }
};

export default UserData;
