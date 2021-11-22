import React, { useState } from "react";
import {
  Alert,
  Button,
  ButtonGroup,
  Container,
  FormControl,
  InputGroup,
  ToggleButton,
} from "react-bootstrap";
import Dropzone from "react-dropzone";
import Select from "react-select";
import SidebarViewDetail from "./SidebarViewDetail";
import SidebarDismiss from "./SidebarDismiss";
import SidebarAssemble from "./SidebarAssemble";
import AddAOIView from "./ViewAddAOI/AddAOIView";
import CurrentAOIView from "./ViewCurrentAOI/CurrentAOIView";
import CreateAssessView from "./ViewCreateAssess/CreateAssessView";

const Sidebar = ({
  activeSidebar,
  setActiveSidebar,
  setActiveTable,
  setDrawingMode,
  featureList,
  aoiSelected,
  setAoiSelected,
  editAOI,
  setEditAOI,
  setViewport,
  hucBoundary,
  setHucBoundary,
  hucIDSelected,
  setHucIDSelected,
  setFilterList,
  setReportLink,
}) => {
  const [view, setView] = useState("add");
  const [alerttext, setAlerttext] = useState(false);

  return (
    <div id="sidebar" className={activeSidebar ? "active" : ""}>
      <SidebarDismiss setActiveSidebar={setActiveSidebar} />
      <div className="ControlWrapper">
        {/* <SidebarMode view={view} setView={setView} /> */}
        <hr />
        /*Before Merge*/
        {view === "add" && (
          <AddAOIView
            setDrawingMode={setDrawingMode}
            setAoiSelected={setAoiSelected}
            featureList={featureList}
            setAlerttext={setAlerttext}
            setView={setView}
            hucBoundary={hucBoundary}
            setHucBoundary={setHucBoundary}
            hucIDSelected={hucIDSelected}
            setHucIDSelected={setHucIDSelected}
            setFilterList={setFilterList}
            setReportLink={setReportLink}
          />

          /*Befre Merge End*/

          /*After Merge */
          // {mode === "add" && (
          //   <div>
          //     <Container className="d-flex">
          //       <ButtonGroup toggle className="m-auto">
          //         <ToggleButton
          //           type="radio"
          //           variant="outline-secondary"
          //           name="draw"
          //           value="draw"
          //           checked={inputMode === "draw"}
          //           onChange={(e) => setInputMode(e.currentTarget.value)}
          //         >
          //           by Drawing
          //         </ToggleButton>
          //         <ToggleButton

          //           type="radio"
          //           variant="outline-secondary"
          //           name="shapefile"
          //           value="shapefile"
          //           checked={inputMode === "shapefile"}
          //           onChange={(e) => setInputMode(e.currentTarget.value)}
          //         >
          //           by Zipped Shapefile
          //         </ToggleButton>
          //         <ToggleButton
          //           type="radio"
          //           variant="outline-secondary"
          //           name="boundary"
          //           value="boundary"
          //           checked={inputMode === "boundary"}
          //           onChange={(e) => {
          //             setInputMode(e.currentTarget.value);
          //           }}
          //         >
          //           by Existing Boundary
          //         </ToggleButton>
          //       </ButtonGroup>
          //     </Container>
          //     <hr />

          // {inputMode === "draw" && (
          //   <Container className="mt-3">
          //     <InputGroup className="m-auto" style={{ width: "80%" }}>
          //       <InputGroup.Prepend>
          //         <InputGroup.Text id="basic-addon1">
          //           AOI Name:
          //         </InputGroup.Text>
          //       </InputGroup.Prepend>
          //       <FormControl
          //         name="planName"
          //         value={aoiName}
          //         onChange={handleNameChange}
          //         placeholder="Name area of interest here..."
          //       />
          //     </InputGroup>
          //     <hr />
          //     <Container className="m-auto" style={{ width: "85%" }}>
          //       <Button
          //         variant="dark"
          //         style={{ float: "left" }}
          //         onClick={() => {
          //           setDrawingMode(true);
          //           setAoiSelected(false);
          //           setReportLink(false);
          //         }}
          //       >
          //         Add a New Shape
          //       </Button>
          //       <Button
          //         variant="dark"
          //         style={{ float: "right" }}
          //         onClick={handleSubmit}
          //       >
          //         Finalize Input
          //       </Button>
          //     </Container>
          //   </Container>
          // )}

          // {inputMode === "shapefile" && (
          //   <Container className="m-auto file-drop">
          //     <Dropzone onDrop={onDrop} accept=".zip">
          //       {({ getRootProps, getInputProps }) => (
          //         <div {...getRootProps()}>
          //           <input {...getInputProps()} />
          //           Click me to upload a file!
          //         </div>
          //       )}
          //     </Dropzone>
          //   </Container>
          // )}

          // {inputMode === "boundary" && (
          //   <Container className="m-auto" style={{ width: "80%" }}>
          //     <div>
          //       <p style={{ fontSize: "110%" }}>Geographic Scale</p>
          //       <Select
          //         placeholder="Select a scale"
          //         options={[
          //           { value: "watershed", label: "Watershed Coastal Zone" },
          //         ]}
          //         theme={(theme) => ({
          //           ...theme,
          //           colors: {
          //             ...theme.colors,
          //             primary: "gray",
          //             primary25: "lightgray",
          //           },
          //         })}
          //         styles={dropdownStyles}
          //       />
          //     </div>
          //     <br></br>
          //     <div>
          //       <p style={{ fontSize: "110%" }}>Retrieving Options</p>
          //       <Select
          //         placeholder="Select an option"
          //         options={[
          //           { value: "hucName", label: "by HUC 12 Watershed Name" },
          //           { value: "hucID", label: "by HUC 12 Watershed ID" },
          //           { value: "hucBoundary", label: "by HUC 12 Watershed Boundary"}
          //         ]}
          //         theme={(theme) => ({
          //           ...theme,
          //           colors: {
          //             ...theme.colors,
          //             primary: "gray",
          //             primary25: "lightgray",
          //           },
          //         })}
          //         styles={dropdownStyles2}
          //         onChange={(e) => {
          // 					setRetrievingOptions(e.value);
          // 					setHucNameSelected([]);
          // 					setHucIDSelected([]);
          // 					setFilterList([]);
          // 					if (e.value === 'hucBoundary') {
          // 						setHucBoundary(true);
          // 					} else {
          // 						setHucBoundary(false);
          // 					};
          // 				}}
          //       />
          //     </div>
          //     <br></br>
          //     {retrievingOptions === "hucName" && (
          //       <div>
          //         <p style={{ fontSize: "110%" }}>Watershed Selection</p>
          //         <Select
          //           options={hucNameList}
          //           isMulti
          //           isClearable={true}
          //           isSearchable={true}
          //           placeholder="Select watersheds from the list"
          //           theme={(theme) => ({
          //             ...theme,
          //             colors: {
          //               ...theme.colors,
          //               primary: "gray",
          //               primary25: "lightgray",
          //             },
          //           })}
          //           styles={dropdownStyles2}
          //           value={hucNameSelected}
          //           onChange={(selectedOption) => {
          //             setHucNameSelected(selectedOption);
          //           }}
          //         />
          //       </div>
          //     )}
          //     {retrievingOptions === "hucID" && (
          //       <div>
          //         <p style={{ fontSize: "110%" }}>Watershed Selection</p>
          //         <Select
          //           options={hucIDList}
          //           isMulti
          //           isClearable={true}
          //           isSearchable={true}
          //           placeholder="Select watersheds from the list"
          //           theme={(theme) => ({
          //             ...theme,
          //             colors: {
          //               ...theme.colors,
          //               primary: "gray",
          //               primary25: "lightgray",
          //             },
          //           })}
          //           styles={dropdownStyles2}
          //           value={hucIDSelected}
          //           onChange={(selectedOption) => {
          //             setHucIDSelected(selectedOption);
          //           }}
          //         />
          //       </div>
          //     )}
          //     <br />
          //     <Button
          //       variant="dark"
          //       style={{ float: "left" }}
          //       onClick={handleSubmitBoundaryAsSingle}
          //     >
          //       Add as Single AOI
          //     </Button>
          //     <Button
          //       variant="dark"
          //       style={{ float: "right" }}
          //       onClick={handleSubmitBoundaryAsMultiple}
          //     >
          //       Add as Multiple AOIs
          //     </Button>
          //   </Container>
          // )}

          //   {alerttext && (
          //     <Alert
          //       className="mt-4"
          //       variant="light"
          //       onClose={() => setAlerttext(false)}
          //       dismissible
          //     >
          //       <p style={{ color: "red" }}>{alerttext}</p>
          //     </Alert>
          //   )}
          // </div>
          /* After Merge end */
        )}
        {view === "viewCurrent" && (
          <Container>
            <CurrentAOIView
              aoiSelected={aoiSelected}
              setAoiSelected={setAoiSelected}
              setViewport={setViewport}
              setView={setView}
            />
            <SidebarViewDetail
              aoiSelected={aoiSelected}
              setActiveTable={setActiveTable}
              setDrawingMode={setDrawingMode}
              editAOI={editAOI}
              setEditAOI={setEditAOI}
              featureList={featureList}
              setAlerttext={setAlerttext}
              setReportLink={setReportLink}
            />
          </Container>
        )}
        {view === "createAssess" && (
          <Container>
            {/* <SidebarAssemble /> */}
            <CreateAssessView setAlerttext={setAlerttext} />

            {/* /*After Merge 

              <SidebarAssemble
                aoiAssembled={aoiAssembled}
                setAoiAssembled={setAoiAssembled}
              />
              /*After Merge End  */}
          </Container>
        )}
        {alerttext && (
          <Alert
            className="mt-4"
            variant="danger"
            onClose={() => setAlerttext(false)}
            dismissible
          >
            <Alert.Heading>You've got an error!</Alert.Heading>
            <p style={{ color: "#842029" }}>{alerttext}</p>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
