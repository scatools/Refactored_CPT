import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const arrowIcon = (
  <FontAwesomeIcon icon={faArrowLeft} color="white" size="lg" />
);

const SidebarDismiss = ({ setActiveSidebar }) => {
  return (
    <div
      id="dismiss"
      onClick={() => {
        setActiveSidebar(false);
      }}
    >
      {arrowIcon}
    </div>
  );
};

export default SidebarDismiss;
