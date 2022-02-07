import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";

const NavBar = ({ reportLink, loggedIn, userLoggedIn }) => {
  const assessment = useSelector((state) => state.assessment);
  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
            <NavLink to="/" className="ml-3 mt-2" onClick={handleShow}>
              About
            </NavLink>
            <NavLink to="/" className="ml-3 mt-2">
              Map
            </NavLink>
            {reportLink && (
              <NavLink to="/report" className="ml-3 mt-2">
                Report
              </NavLink>
            )}
            {assessment.hasOwnProperty("aoi") && (
              <NavLink to="/assessment" className="ml-3 mt-2">
                Assessment
              </NavLink>
            )}
            <NavLink to="/help" className="ml-3 mt-2">
              Support
            </NavLink>
            <NavDropdown title="More" className="ml-3">
              <NavDropdown.Item
                href="https://www.quest.fwrc.msstate.edu/sca/about-the-project.php"
                target="_blank"
              >
                Strategic Conservation Assessment (SCA) Project
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                href="http://sca-cit.herokuapp.com/"
                target="_blank"
              >
                Conservation Planning Inventory Tool (CIT)
              </NavDropdown.Item>
              <NavDropdown.Item
                href="https://sca-cvt.netlify.app/"
                target="_blank"
              >
                Conservation Visualization Tool (CVT)
              </NavDropdown.Item>
            </NavDropdown>
            {loggedIn ? (
              <div className="nav-right">
                <NavLink to="/user" className="ml-3 mt-2 login">
                  {userLoggedIn}
                </NavLink>
                <NavLink to="/logout" className="ml-3 mt-2 login">
                  Log Out
                </NavLink>
              </div>
            ) : (
              <div className="nav-right">
                <NavLink to="/login" className="ml-3 mt-2 login">
                  Log In
                </NavLink>
                <NavLink to="/register" className="ml-3 mt-2 register">
                  Register
                </NavLink>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="content">
        <Modal centered show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              Welcome to the Conservation Prioritization Tool
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Using this tool, you can create a custom report on your areas of
            interest (up to 10), with our catalog of 26 metrics and address
            particular conservation and restoration concerns.
            <br /> <br />
            <b>Key Features</b>
            <br />
            <ul>
              <li>Create custom prioritization maps</li>
              <li>Export shapefiles, reports and data tables</li>
              <li>Evaluate 26 conservation related metrics</li>
            </ul>
            <b>Intended Use</b>
            <br />
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Conservation Prioritization Tool
              (CPT) is not intended to be prescriptive. Instead this tool was
              designed to provide data to support conservation planning efforts
              across the Gulf Coast Region. All users acknowledge that the CPT
              model is intended to explore ecological and socioeconomic
              co-benefits of proposed areas of land conservation, and should not
              be used in a decision making context.
            </p>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The flexibility of this tool enables
              a user to evaluate conservation alternatives using either a
              multi-criteria decision analysis (MCDA) framework, or user-defined
              values.
            </p>
            <b>Sponsorship</b>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Funding for this project was
              provided by the
              <a href="https://www.restorethegulf.gov/" target="_blank">
                {" "}
                Gulf Coast Ecosystem Restoration Council{" "}
              </a>
              through an agreement (NO. F17AC00267) with the
              <a href="https://www.fws.gov/" target="_blank">
                {" "}
                U.S. Fish and Wildlife Service{" "}
              </a>
              , and was produced with support from the
              <a href="https://www.fwrc.msstate.edu/" target="_blank">
                {" "}
                Forest and Wildlife Research Center{" "}
              </a>
              at Mississippi State University. The findings and conclusions in
              this tool are those of the authors and do not necessarily
              represent the views of the U.S. Fish and Wildlife Service or Gulf
              Coast Ecosystem Restoration Council.
            </p>
            <div className="logo-container">
              <a
                href="https://www.restorethegulf.gov/"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  className="logo"
                  src="/Logo_RESTORE.png"
                  alt="restore council logo"
                />
              </a>
              <a
                href="https://www.fwrc.msstate.edu/"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  className="logo"
                  src="/Logo_FWRC.png"
                  alt="fwrc msu logo"
                />
              </a>
              <a href="https://www.fws.gov/" rel="noreferrer" target="_blank">
                <img className="logo" src="/Logo_USFWS.png" alt="fws logo" />
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
