import React from 'react';

const Legend = ({ aoiList, aoiColors }) => {
	return (
		<div class="legend">
			<div class="legend-title">Areas of Interest</div>
			<div class="legend-scale">
				<ul class="legend-labels">
					{aoiList.length > 0 && aoiList.map(aoi =>
						<li>
							<span style={{background:aoiColors[aoiList.indexOf(aoi)], opacity:0.5}} />{aoi.name}
						</li>
					)}	
				</ul>
			</div>
		</div>
	);
};
export default Legend;
