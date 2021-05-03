import React from 'react';
import './App.css';
import NavBar from './NavBar';
import Routes from './Routes';

function App() {
	return (
		<div className="App">
			<NavBar />
			<div style={{position:"relative",top:"55px"}}>
				<Routes />
			</div>
		</div>
	);
}

export default App;
