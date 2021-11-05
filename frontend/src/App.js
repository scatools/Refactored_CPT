import React from "react";
import "./App.css";
import NavBar from "./NavBar";
import Routes from "./Routes";
import LoadingOverlay from "react-loading-overlay";
import BarLoader from "react-spinners/BarLoader";
import { connect } from "react-redux";

function App(props) {
  return (
    <LoadingOverlay
      className="myLoading"
      active={props.isActive}
      spinner
      text="Loading..."
    >
      <div className="App">
        <NavBar />
        <div style={{ position: "relative", top: "55px" }}>
          <Routes />
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
