import React, { useState } from "react";
import "../App.css";
import NavBar from "../Components/NavBar";
import Routes from "./Routes";
import LoadingOverlay from "react-loading-overlay";
import { connect } from "react-redux";

function App(props) {
  const [reportLink, setReportLink] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  return (
    <LoadingOverlay
      className="myLoading"
      active={props.isActive}
      styles={{
        overlay: (base) => ({
          ...base,
          position: "fixed",
        }),
      }}
      spinner
      text="Loading..."
    >
      <div className="App">
        <NavBar
          reportLink={reportLink}
          loggedIn={loggedIn}
          userLoggedIn={userLoggedIn}
        />
        <div style={{ position: "relative", top: "55px" }}>
          <Routes
            setReportLink={setReportLink}
            setLoggedIn={setLoggedIn}
            userLoggedIn={userLoggedIn}
            setUserLoggedIn={setUserLoggedIn}
          />
        </div>
      </div>
    </LoadingOverlay>
  );
}

const mapStateToProps = (state) => {
  return {
    isActive: state.loading.isLoading,
  };
};

export default connect(mapStateToProps)(App);
