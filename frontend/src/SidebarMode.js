import React from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";

const SidebarMode = ({ view, setView }) => {
  return (
    <ButtonGroup toggle className="d-flex justify-content-center">
      <ToggleButton
        type="radio"
        variant="outline-secondary"
        name="add"
        value="add"
        checked={view === "add"}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Add New
      </ToggleButton>
      <ToggleButton
        type="radio"
        variant="outline-secondary"
        name="viewCurrent"
        value="viewCurrent"
        checked={view === "viewCurrent"}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        View Current
      </ToggleButton>
      <ToggleButton
        type="radio"
        variant="outline-secondary"
        name="createAssess"
        value="createAssess"
        checked={view === "createAssess"}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Create Assessment
      </ToggleButton>
    </ButtonGroup>
  );
};

export default SidebarMode;
