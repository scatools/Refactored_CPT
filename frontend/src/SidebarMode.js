import React from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { useSelector } from "react-redux";

const SidebarMode = ({ view, setView }) => {
  const aoi = useSelector((state) => state.aoi);

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

      {Object.keys(aoi).length > 0 ? (
        <ToggleButton
          type="radio"
          variant="outline-secondary"
          name="viewCurrent"
          value="viewCurrent"
          checked={view === "viewCurrent"}
          onChange={(e) => setView(e.currentTarget.value)}
        >
          Review/Edit Current AOIs
        </ToggleButton>
      ) : (
        <ToggleButton
          disabled
          type="radio"
          variant="outline-secondary"
          name="viewCurrent"
          value="viewCurrent"
          checked={view === "viewCurrent"}
          onChange={(e) => setView(e.currentTarget.value)}
        >
          Review/Edit Current AOIs
        </ToggleButton>
      )}

      {Object.keys(aoi).length > 1 ? (
        <ToggleButton
          type="radio"
          variant="outline-secondary"
          name="createAssess"
          value="createAssess"
          checked={view === "createAssess"}
          onChange={(e) => setView(e.currentTarget.value)}
        >
          Evaluate AOIs
        </ToggleButton>
      ) : (
        <ToggleButton
          disabled
          type="radio"
          variant="outline-secondary"
          name="createAssess"
          value="createAssess"
          checked={view === "createAssess"}
          onChange={(e) => setView(e.currentTarget.value)}
        >
          Evaluate AOIs
        </ToggleButton>
      )}
    </ButtonGroup>
  );
};

export default SidebarMode;
