import React, { useState, useEffect } from "react";
import { Button, Container, Jumbotron, Modal } from "react-bootstrap";
import { useHistory } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { calculateArea, aggregate, getStatus } from "./helper/aggregateHex";
import { input_aoi, setLoader } from "./action";
import "./App.css";

const UserData = ({
  userLoggedIn,
  setReportScript,
  setAlertText,
  setAlertType,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [ username, setUsername ] = useState(null);
  const [ password, setPassword ] = useState(null);
  const [ newPassword, setNewPassword ] = useState(null);
  const [ firstName, setFirstName ] = useState(null);
  const [ newFirstName, setNewFirstName ] = useState(null);
  const [ lastName, setLastName ] = useState(null);
  const [ newLastName, setNewLastName ] = useState(null);
  const [ email, setEmail ] = useState(null);
  const [ newEmail, setNewEmail ] = useState(null);
  const [ admin, setAdmin ] = useState(false);
  const [ userFileList, setUserFileList ] = useState([]);
  const [ userReportList, setUserReportList ] = useState([]);
  const [ fileDeleted, setFileDeleted ] = useState(null);
  const [ reportDeleted, setReportDeleted ] = useState(null);
  const [ updateInfo, setUpdateInfo ] = useState(false);
  const [ updatePassword, setUpdatePassword ] = useState(false);

  const showUpdateInfo = () => setUpdateInfo(true);

  const closeUpdateInfo = () => {
    setUpdateInfo(false);
    getUserData();
  };

  const showUpdatePassword = () => setUpdatePassword(true);
  
  const closeUpdatePassword = () => {
    setUpdatePassword(false);
    setPassword(null);
    setNewPassword(null);
  };

  const getUserData = async () => {
    // For development on local server
    // const result = await axios.post(
    //   'http://localhost:5000/user',
    //   { username: userLoggedIn }
    // );

    // For production on Heroku
    const result = await axios.post(
      "https://sca-cpt-backend.herokuapp.com/user",
      { username: userLoggedIn }
    );

    setUsername(result.data.rows[0].username);
    setFirstName(result.data.rows[0].first_name);
    setNewFirstName(result.data.rows[0].first_name);
    setLastName(result.data.rows[0].last_name);
    setNewLastName(result.data.rows[0].last_name);
    setEmail(result.data.rows[0].email);
    setNewEmail(result.data.rows[0].email);
    setAdmin(result.data.rows[0].is_admin);
  };

  const updateUserInfo = async () => {
    // For development on local server
    // const result = await axios.post(
    //   'http://localhost:5000/update/information',
    //   {
    //     username: userLoggedIn,
    //     email: newEmail,
    //     first_name: newFirstName,
    //     last_name: newLastName
    //   }
    // );
    
    // For production on Heroku
    const result = await axios.post(
      'https://sca-cpt-backend.herokuapp.com/update/information',
      {
        username: userLoggedIn,
        email: newEmail,
        first_name: newFirstName,
        last_name: newLastName
      }
    );
    if (result) {
      setAlertType("success");
      setAlertText("You have updated your profile!");
      closeUpdateInfo();
    };
  };

  const updateUserPassword = async () => {
    // For development on local server
    // const verification = await axios.post(
    //   'http://localhost:5000/login',
    //   { username: userLoggedIn, password: password }
    // );

    // For production on Heroku
    const verification = await axios.post(
      'https://sca-cpt-backend.herokuapp.com/login',
      { username: userLoggedIn, password: password }
    );

    if (!verification.data.validLogin) {
      setAlertType("danger");
			setAlertText("Incorrect password! Please enter again.");
		} else {
      // For development on local server
      // const result = await axios.post(
      //   'http://localhost:5000/update/password',
      //   {
      //     username: userLoggedIn,
      //     password: newPassword
      //   }
      // );
      
      // For production on Heroku
      const result = await axios.post(
        'https://sca-cpt-backend.herokuapp.com/update/password',
        {
          username: userLoggedIn,
          password: newPassword
        }
      );
      if (result) {
        setAlertType("success");
        setAlertText("You have updated your password!");
        closeUpdatePassword();
      };
		}
  };

  const getUserFile = async () => {
    // For development on local server
    // const result = await axios.post(
    //   'http://localhost:5000/user/shapefile',
    //   { username: userLoggedIn }
    // );

    // For production on Heroku
    const result = await axios.post(
      "https://sca-cpt-backend.herokuapp.com/user/shapefile",
      { username: userLoggedIn }
    );
    if (result) {
      setUserFileList(result.data.rows.map((row) => row.file_name));
    }
  };

  const getUserReport = async () => {
    // For development on local server
    // const result = await axios.post(
    //   'http://localhost:5000/user/report',
    //   { username: userLoggedIn }
    // );

    // For production on Heroku
    const result = await axios.post(
      "https://sca-cpt-backend.herokuapp.com/user/report",
      { username: userLoggedIn }
    );
    if (result) {
      setUserReportList(result.data.rows.map((row) => row.report_name));
    }
  };

  const deleteUserFile = async (file) => {
    // For development on local server
    // const result = await axios.post(
    //   'http://localhost:5000/delete/shapefile',
    //   { file_name: file }
    // );

    // For production on Heroku
    const result = await axios.post(
      "https://sca-cpt-backend.herokuapp.com/delete/shapefile",
      { file_name: file }
    );
    if (result) {
      setAlertType("warning");
      setAlertText("You have deleted the AOI named " + file);
    }
  };

  const deleteUserReport = async (report) => {
    // For development on local server
    // const result = await axios.post(
    //   'http://localhost:5000/delete/report',
    //   { report_name: report }
    // );

    // For production on Heroku
    const result = await axios.post(
      "https://sca-cpt-backend.herokuapp.com/delete/report",
      { report_name: report }
    );
    if (result) {
      setAlertType("warning");
      setAlertText("You have deleted the report named " + report);
    }
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
      "https://sca-cpt-backend.herokuapp.com/user/shapefile",
      { username: userLoggedIn }
    );
    const fileList = result.data.rows.filter((row) => row.file_name === file);
    const fileFeature = JSON.parse(
      JSON.parse(fileList[0].geometry.slice(1, -1))
    );
    // console.log(fileFeature);
    const newList = [fileFeature];
    const data = fileFeature.geometry;

    // For development on local server
    // const res = await axios.post('http://localhost:5000/data', { data });

    // For production on Heroku
    const res = await axios.post("https://sca-cpt-backend.herokuapp.com/data", {
      data,
    });
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

  const viewUserReport = async (report) => {
    dispatch(setLoader(true));
    // let loadTimer = setTimeout(() => timeoutHandler(), 30000);

    // For development on local server
    // const result = await axios.post(
    //   'http://localhost:5000/user/report',
    //   { username: userLoggedIn }
    // );

    // For production on Heroku
    const result = await axios.post(
      "https://sca-cpt-backend.herokuapp.com/user/report",
      { username: userLoggedIn }
    );
    const reportList = result.data.rows.filter(
      (row) => row.report_name === report
    );
    const reportScript = reportList[0].script;
    setReportScript(reportScript);
    history.push("/user/report");
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
          <p className="lead">
            Please review or modify your personal information here
          </p>
          <hr className="my-4" />
          <p className="h3">User Profile</p>
          <p>Your username: {username}</p>
          <p>Your email: {email}</p>
          <div className="d-flex justify-content-between btn-container">
            {admin && (
              <Button className="btn btn-success">
                Admin Module
              </Button>
            )}
            <Button className="btn btn-success" onClick={showUpdateInfo}>
              Update Information
            </Button>
            <Button className="btn btn-success" onClick={showUpdatePassword}>
              Change Password
            </Button>
            <Button className="btn btn-danger">
              Delete Account
            </Button>
          </div>

          <hr className="my-4" />
          <p className="h3">Saved Shapefiles</p>
          <br />
          {userFileList.length > 0 ? (
            userFileList.map((file) => (
              <div className="d-flex mb-2" key={uuid()}>
                <span className="mr-auto">{file}</span>
                <Button
                  className="btn btn-primary ml-2"
                  onClick={() => viewUserFile(file)}
                >
                  Add AOI to Map
                </Button>
                <Button
                  className="btn btn-danger ml-2"
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
              <div className="d-flex mb-2" key={uuid()}>
                <span className="mr-auto">{report}</span>
                <Button
                  className="btn btn-primary ml-2"
                  onClick={() => viewUserReport(report)}
                >
                  View Report
                </Button>
                <Button
                  className="btn btn-danger ml-2"
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
        <Modal centered show={updateInfo} onHide={closeUpdateInfo} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              Please enter your profile information here
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                Your Username: 
                <input type="text" value={username} disabled></input>
                Your Email: 
                <input
                  type="text"
                  value={newEmail}
                  onChange={(e)=>setNewEmail(e.target.value)}
                  required>
                </input>
                Your First Name: 
                <input
                  type="text"
                  value={newFirstName}
                  onChange={(e)=>setNewFirstName(e.target.value)}
                  required>
                </input>
                Your Last Name: 
                <input
                  type="text"
                  value={newLastName}
                  onChange={(e)=>setNewLastName(e.target.value)}
                  required>
                </input>
                <br/>
                <div className="d-flex justify-content-between">
                  <Button className="btn btn-warning" onClick={closeUpdateInfo}>
                    Cancel
                  </Button>
                  <Button className="btn btn-primary" onClick={updateUserInfo}>
                    Confirm
                  </Button>
                </div>
              </div>
            </form>
          </Modal.Body>
        </Modal>
        <Modal centered show={updatePassword} onHide={closeUpdatePassword} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              Please enter your current and new passwords here
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                Your Username: 
                <input type="text" value={username} disabled></input>
                Your Current Password: 
                <input
                  type="password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  required>
                </input>
                Your New Password: 
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e)=>setNewPassword(e.target.value)}
                  required>
                </input>
                {/* Confirm Your New Password: 
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e)=>setNewPassword(e.target.value)}
                  required>
                </input> */}
                <br/>
                <div className="d-flex justify-content-between">
                  <Button className="btn btn-warning" onClick={closeUpdatePassword}>
                    Cancel
                  </Button>
                  <Button className="btn btn-primary" onClick={updateUserPassword}>
                    Confirm
                  </Button>
                </div>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </Container>
    );
  }
};

export default UserData;
