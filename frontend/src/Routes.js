import React, { useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Main from "./Main";
import Help from "./Help";
import Report from "./Report";
import Login from "./Login";
import Logout from "./Logout";
import Register from "./Register";
import UserData from "./UserData";
import Assessment from "./Assessment";

const Routes = ({ setReportLink, setLoggedIn, userLoggedIn, setUserLoggedIn }) => {
  const [aoiSelected, setAoiSelected] = useState(null);
  const [aoiAssembled, setAoiAssembled] = useState([]);
  const [customizedMeasures, setCustomizedMeasures] = useState({
    hab: [],
    wq: [],
    lcmr: [],
    cl: [],
    eco: [],
  });

  return (
    <Switch>
      <Route exact path="/">
        <Main
          aoiSelected={aoiSelected}
          setAoiSelected={setAoiSelected}
          aoiAssembled={aoiAssembled}
          setAoiAssembled={setAoiAssembled}
          setReportLink={setReportLink}
          customizedMeasures={customizedMeasures}
          userLoggedIn={userLoggedIn}
        />
      </Route>
      <Route exact path="/register">
        <Register setLoggedIn={setLoggedIn} setUserLoggedIn={setUserLoggedIn} />
      </Route>
      <Route exact path="/login">
        <Login setLoggedIn={setLoggedIn} setUserLoggedIn={setUserLoggedIn} />
      </Route>
      <Route exact path="/logout">
        <Logout setLoggedIn={setLoggedIn} setUserLoggedIn={setUserLoggedIn} />
      </Route>
      <Route exact path="/user">
        <UserData userLoggedIn={userLoggedIn} />
      </Route>
      <Route exact path="/help">
        <Help />
      </Route>
      <Route exact path="/report">
        <Report aoiSelected={aoiSelected} userLoggedIn={userLoggedIn}/>
      </Route>
      {aoiAssembled.length > 1 ? (
        <Route exact path="/assessment">
          <Assessment
            aoiAssembled={aoiAssembled}
            setAoiSelected={setAoiSelected}
            setReportLink={setReportLink}
            customizedMeasures={customizedMeasures}
            userLoggedIn={userLoggedIn}
          />
        </Route>
      ) : (
        <Route>
          <Redirect to="/" />
        </Route>
      )}
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
};

export default Routes;
