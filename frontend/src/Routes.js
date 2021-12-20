import React, { useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Main from "./Main";
import Help from "./Help";
import Report from "./Report";
import Login from "./Login";
import Register from "./Register";
import Assessment from "./Assessment";

const Routes = ({ setReportLink }) => {
  const [aoiSelected, setAoiSelected] = useState(null);
  const [aoiAssembled, setAoiAssembled] = useState([]);
  return (
    <Switch>
      <Route exact path="/">
        <Main
          aoiSelected={aoiSelected}
          setAoiSelected={setAoiSelected}
          aoiAssembled={aoiAssembled}
          setAoiAssembled={setAoiAssembled}
          setReportLink={setReportLink}
        />
      </Route>
      <Route exact path="/register">
        <Register />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/help">
        <Help />
      </Route>
      <Route exact path="/report">
        <Report aoiSelected={aoiSelected} />
      </Route>
      {aoiAssembled >= 2 ? (
        <Route exact path="/assessment">
          <Assessment
            aoiAssembled={aoiAssembled}
            setAoiSelected={setAoiSelected}
            setReportLink={setReportLink}
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
