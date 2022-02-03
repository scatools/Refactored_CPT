import React, { useState, useEffect } from "react";
import { Button, Container, Jumbotron } from "react-bootstrap";
import { useHistory } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { calculateArea, aggregate, getStatus } from "./helper/aggregateHex";
import { input_aoi, setLoader } from "./action";
import "./App.css";

const UserData = ({ userLoggedIn }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [ username, setUsername ] = useState(null);
  const [ password, setPassword ] = useState(null);
  const [ firstName, setFirstName ] = useState(null);
  const [ lastName, setLastName ] = useState(null);
  const [ email, setEmail ] = useState(null);
  const [ admin, setAdmin ] = useState(false);
  const [ userFileList, setUserFileList ] = useState([]);
  const [ userReportList, setUserReportList ] = useState([]);
  const [ fileDeleted, setFileDeleted ] = useState(null);
  const [ reportDeleted, setReportDeleted ] = useState(null);
  
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

  const getUserFile = async () => {
    // For development on local server
    // const result = await axios.post(
    //   'http://localhost:5000/user/shapefile',
    //   { username: userLoggedIn }
    // );
    
    // For production on Heroku
    const result = await axios.post(
      'https://sca-cpt-backend.herokuapp.com/user/shapefile',
      { username: userLoggedIn }
    );
    if (result) {
      setUserFileList(result.data.rows.map((row) => row.file_name));
    };
  };

  const getUserReport = async () => {
    // For development on local server
    // const result = await axios.post(
    //   'http://localhost:5000/user/report',
    //   { username: userLoggedIn }
    // );
    
    // For production on Heroku
    const result = await axios.post(
      'https://sca-cpt-backend.herokuapp.com/user/report',
      { username: userLoggedIn }
    );
    if (result) {
      setUserReportList(result.data.rows.map((row) => row.report_name));
    };
  };

  const deleteUserFile = async (file) => {
    // For development on local server
    // const result = await axios.post(
    //   'http://localhost:5000/delete/shapefile',
    //   { file_name: file }
    // );
    
    // For production on Heroku
    const result = await axios.post(
      'https://sca-cpt-backend.herokuapp.com/delete/shapefile',
      { file_name: file }
    );
    if (result) {
      alert("You have deleted the AOI named " + file);
    };
  };

  const deleteUserReport = async (report) => {
    // For development on local server
    // const result = await axios.post(
    //   'http://localhost:5000/delete/report',
    //   { report_name: report }
    // );
    
    // For production on Heroku
    const result = await axios.post(
      'https://sca-cpt-backend.herokuapp.com/delete/report',
      { report_name: report }
    );
    if (result) {
      alert("You have deleted the report named " + report);
    };
  };
  
  const viewUserFile = async (file) => {
    dispatch(setLoader(true));
    // let loadTimer = setTimeout(() => timeoutHandler(), 30000);

    // For development on local server
    // const result = await axios.post(
    //   'http://localhost:5000/user/shapefile',
    //   { username: userLoggedIn }
    // );
    
    // For production on Heroku
    const result = await axios.post(
      'https://sca-cpt-backend.herokuapp.com/user/shapefile',
      { username: userLoggedIn }
    );
    const fileList = result.data.rows.filter(row => row.file_name === file);
    const fileFeature = JSON.parse(JSON.parse(fileList[0].geometry.slice(1, -1)));
    // console.log(fileFeature);
    const newList = [fileFeature];
    const data = fileFeature.geometry;

    // For development on local server
    // const res = await axios.post('http://localhost:5000/data', { data });

    // For production on Heroku
    const res = await axios.post(
      "https://sca-cpt-backend.herokuapp.com/data",
      { data }
    );
    const planArea = calculateArea(newList);
    dispatch(
      input_aoi({
        name: file,
        geometry: newList,
        hexagons: res.data.data,
        rawScore: aggregate(res.data.data, planArea),
        scaleScore: getStatus(aggregate(res.data.data, planArea)),
        speciesName: res.data.speciesName,
        id: uuid(),
      })
    );
    history.push("/map");
    dispatch(setLoader(false));
    // clearTimeout(loadTimer);
  };

  useEffect(() => {
    getUserData();
    getUserFile();
    getUserReport();
  }, [userLoggedIn]);

  useEffect(() => {
    getUserFile();
  }, [fileDeleted]);

  useEffect(() => {
    getUserReport();
  }, [reportDeleted]);
  
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
          {userFileList.length > 0 ? (
            userFileList.map((file) => (
              <div className="d-flex" key={uuid()}>
                <span className="mr-auto">{file}</span>
                <Button
                  className="btn btn-success ml-1"
                  onClick={() => viewUserFile(file)}
                >
                  Add AOI to Map
                </Button>
                <Button 
                  className="btn btn-danger ml-1" 
                  onClick={() => {
                    deleteUserFile(file);
                    setFileDeleted(file);
                  }}
                >
                  Delete AOI
                </Button>
              </div>
            ))
          ) : (
            <p className="lead">No shapefile saved yet!</p>
          )}

          <hr className="my-4" />
          <p className="h3">Saved Reports</p>
          <br />
          {userReportList.length > 0 ? (
            userReportList.map((report) => (
              <div className="d-flex" key={uuid()}>
                <span className="mr-auto">{report}</span>
                <Button className="btn btn-success ml-1">View Report</Button>
                <Button 
                  className="btn btn-danger ml-1" 
                  onClick={() => {
                    deleteUserReport(report);
                    setReportDeleted(report);
                  }}
                >
                  Delete Report
                </Button>
              </div>
            ))
          ) : (
            <p className="lead">No report saved yet!</p>
          )}
        </Jumbotron>
      </Container>
    );
  }
};

export default UserData;
