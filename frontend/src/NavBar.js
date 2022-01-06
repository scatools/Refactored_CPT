import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";

const NavBar = ({ reportLink }) => {
  const assessment = useSelector((state) => state.assessment);
  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div>
      <Navbar bg="dark" variant="dark" fixed="top">
        <Navbar.Brand>
          <NavLink to="/" style={{ color: "white", textDecoration: "None" }}>
            Conservation Prioritization Tool
          </NavLink>
        </Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavLink to="/" className="ml-3">
              Map
            </NavLink>
            {reportLink && (
              <NavLink to="/report" className="ml-3">
                Report
              </NavLink>
            )}
            {assessment.hasOwnProperty("aoi") && (
              <NavLink to="/assessment" className="ml-3">
                Assessment
              </NavLink>
            )}
            <NavLink to="/" className="ml-3" onClick={handleShow}>
              About
            </NavLink>
            <NavLink to="/help" className="ml-3">
              Contacts
            </NavLink>
            {loggedIn ? (
              <div className="nav-right">
                <NavLink to="/user" className="ml-3 login">
                  Profile
                </NavLink>
              </div>
            ) : (
              <div className="nav-right">
                <NavLink to="/login" className="ml-3 login">
                  Login
                </NavLink>
                <NavLink to="/register" className="ml-3 register">
                  Register
                </NavLink>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="content">
        <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              Welcome to the Conservation Prioritization Tool
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Using this tool, you can create a custom report on your areas of
            interest (up to 10), with our catalog of over 20 metrics and address
            particular conservation and restoration concerns.
            <br /> <br />
            <b>Key Features</b>
            <br />
            <ul>
              <li>Quickly create custom prioritization maps</li>
              <li>HTML and CSV outputs</li>
              <li>Over 20 metrics</li>
            </ul>
            <b>Intended Use</b>
            <br />
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Gulf Conservation Prioritization
              Tool (CPT) is <b>not</b> intended to be prescriptive. Instead this
              tool was designed to provide data to <b>support</b> conservation
              planning efforts across the Gulf Coast Region. All users
              acknowledge that the CPT model is intended to <b>explore</b>{" "}
              ecological and socioeconomic co-benefits of proposed areas of land
              conservation, and should <b>not</b> be used in a decision making
              context.
            </p>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The flexibility of this tool enables
              a user to evaluate conservation alternatives using either a
              multi-criteria decision analysis (MCDA) framework, or user-defined
              values.
            </p>
            <b>Sponsorship</b>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Funding for this project was provided by the 
              <a href="https://www.restorethegulf.gov/"> Gulf Coast Ecosystem Restoration Council </a> 
              through an agreement with the 
              <a href="https://www.fws.gov/"> U.S. Fish and Wildlife Service </a>
              (Grant no. F17AC00267), and was produced with support from the 
              <a href="https://www.fwrc.msstate.edu/"> Forest and Wildlife Research Center at Mississippi State University</a>
              . The findings and conclusions in this tool are those of the authors and do not necessarily represent the
              views of the U.S. Fish and Wildlife Service or Gulf Coast Ecosystem Restoration Council.
            </p>
            <div class="d-flex justify-content-between">
              <a href="https://www.restorethegulf.gov/">
                <img src="/Logo_RESTORE.png" alt="image" height="100px"/>
              </a>
              <a href="https://www.fws.gov/">
                <img src="/Logo_USFWS.png" alt="image" height="100px"/>
              </a>
              <a href="https://www.fwrc.msstate.edu/">
                <img src="/Logo_CFR.png" alt="image" height="100px"/>
              </a>
              <a href="https://www.msstate.edu/">
                <img src="/Logo_MSSTATE.png" alt="image" height="100px"/>
              </a>
            </div>
            <br />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default NavBar;
