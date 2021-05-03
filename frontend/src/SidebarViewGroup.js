import React from 'react';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const SidebarViewGroup = ({ aoiSelected, setAoiSelected }) => {
	const aoiList = Object.values(useSelector((state) => state.aoi));
	return (
		<ButtonGroup toggle className="mb-2 " vertical style={{ width: '100%' }}>
			{aoiList.length > 0 &&
				aoiList.map(aoi=>
					<ToggleButton
					    key= {aoi.id}
						type="radio"
						variant="outline-secondary"
						name={aoi.id}
						value={aoi.id}
						checked={aoiSelected === aoi.id}
						onChange={(e) => setAoiSelected(e.currentTarget.value)}
					>
						{aoi.name}
					</ToggleButton>
				)}
		</ButtonGroup>
	);
};

export default SidebarViewGroup;
