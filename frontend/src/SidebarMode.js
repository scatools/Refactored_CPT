import React from 'react';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';

const SidebarMode = ({ mode, setMode }) => {
	return (
		<ButtonGroup toggle className="ml-5">
			<ToggleButton
				type="radio"
				variant="outline-secondary"
				name="add"
				value="add"
				checked={mode === 'add'}
				onChange={(e) => setMode(e.currentTarget.value)}
			>
				Add New
			</ToggleButton>
			<ToggleButton
				type="radio"
				variant="outline-secondary"
				name="view"
				value="view"
				checked={mode === 'view'}
				onChange={(e) => setMode(e.currentTarget.value)}
			>
				View Current
			</ToggleButton>
			<ToggleButton
				type="radio"
				variant="outline-secondary"
				name="assemble"
				value="assemble"
				checked={mode === 'assemble'}
				onChange={(e) => setMode(e.currentTarget.value)}
			>
				Create Assessment
			</ToggleButton>
		</ButtonGroup>
	);
};

export default SidebarMode;
