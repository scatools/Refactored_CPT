import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar,Nav } from 'react-bootstrap';
import {useSelector} from 'react-redux';

const NavBar = () => {
	const assessment = useSelector(state => state.assessment);
	return (
		<Navbar bg="dark" variant="dark" fixed="top">
			<Navbar.Brand>
				<NavLink to="/" style={{ color: 'white', textDecoration: 'None' }}>
					Conservation Prioritization Tool
				</NavLink>
			</Navbar.Brand>
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto" >
                    <NavLink to="/" className="ml-3">Map</NavLink>
                    {assessment.hasOwnProperty('aoi') && <NavLink to="/assessment" className="ml-3">Assessment</NavLink>}
                    <NavLink to="/help" className="ml-3">Help</NavLink>
                </Nav>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default NavBar;
