import React from 'react';

const SidebarDismiss = ({setActiveSidebar}) => {
	return (
		<div
			id="dismiss"
			onClick={() => {
				setActiveSidebar(false);
			}}
		>
			X
		</div>
	);
};

export default SidebarDismiss;
