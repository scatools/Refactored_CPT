import React, { useState } from "react";
import Select from "react-select";
import { Container, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setLoader, input_aoi } from "../../../Redux/action";
import {
  calculateArea,
  aggregate,
  getStatus,
} from "../../../helper/aggregateHex";
import { v4 as uuid } from "uuid";

const AddBoundary = ({
  hucList,
  hucNameList,
  hucIDList,
  hucNameSelected,
  setHucNameSelected,
  hucIDSelected,
  setHucIDSelected,
  hucBoundary,
  setHucBoundary,
  setFilterList,
  setView,
  setAlertText,
  setAlertType,
}) => {
  const dispatch = useDispatch();
  const [retrievingOptions, setRetrievingOptions] = useState("");

  const handleSubmitBoundaryAsSingle = async () => {
    if (hucNameSelected.length === 0 && hucIDSelected.length === 0) {
      setAlertType("danger");
      setAlertText("At least one of the existing boundaries is required.");
    } else {
      if (hucBoundary) {
        setHucBoundary(false);
      }
      setAlertText(false);
      const newList = hucList.filter(
        (feature) =>
          hucNameSelected
            .map((hucName) => hucName.value)
            .includes(feature.properties.NAME) ||
          hucIDSelected
            .map((hucID) => hucID.value)
            .includes(feature.properties.HUC12)
      );
      // console.log(newList);
      const data = {
        type: "MultiPolygon",
        coordinates: newList.map((feature) => feature.geometry.coordinates),
      };

      // For development on local server
      // const res = await axios.post('http://localhost:5000/data', { data });
      // For production on Heroku
      dispatch(setLoader(true));
      const res = await axios.post(
        "https://sca-cpt-backend.herokuapp.com/data",
        { data }
      );
      const planArea = calculateArea(newList);
      dispatch(
        input_aoi({
          name: "Combined Watershed Area",
          geometry: newList,
          hexagons: res.data.data,
          rawScore: aggregate(res.data.data, planArea),
          scaleScore: getStatus(aggregate(res.data.data, planArea)),
          speciesName: res.data.speciesName,
          id: uuid(),
        })
      );
      dispatch(setLoader(false));
      setView("viewCurrent");
      setHucNameSelected([]);
      setHucIDSelected([]);
      setFilterList([]);
    }
  };

  const handleSubmitBoundaryAsMultiple = () => {
    if (hucNameSelected.length === 0 && hucIDSelected.length === 0) {
      setAlertType("danger");
      setAlertText("At least one of the existing boundaries is required.");
      window.setTimeout(() => setAlertText(false), 4000);
    } else {
      if (hucBoundary) {
        setHucBoundary(false);
      }
      setAlertText(false);
      const newList = hucList.filter(
        (feature) =>
          hucNameSelected
            .map((hucName) => hucName.value)
            .includes(feature.properties.NAME) ||
          hucIDSelected
            .map((hucID) => hucID.value)
            .includes(feature.properties.HUC12)
      );
      // console.log(newList);

      newList.forEach(async (feature) => {
        const data = feature.geometry;
        // For development on local server
        // const res = await axios.post('http://localhost:5000/data', { data });
        // For production on Heroku
        dispatch(setLoader(true));
        const res = await axios.post(
          "https://sca-cpt-backend.herokuapp.com/data",
          { data }
        );
        const planArea = calculateArea([feature]);
        // Geometry needs to be a list
        dispatch(
          input_aoi({
            name: feature.properties.NAME,
            geometry: [feature],
            hexagons: res.data.data,
            rawScore: aggregate(res.data.data, planArea),
            scaleScore: getStatus(aggregate(res.data.data, planArea)),
            speciesName: res.data.speciesName,
            id: uuid(),
          })
        );
        dispatch(setLoader(false));
      });
      setView("viewCurrent");
      setHucNameSelected([]);
      setHucIDSelected([]);
      setFilterList([]);
    }
  };

  const dropdownStyles2 = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "white" : "black",
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      return { ...provided, opacity };
    },
    menu: (provided, state) => ({
      ...provided,
      bottom: "100%",
      top: "auto",
    }),
    menuPlacement: "auto",
  };

  return (
    <Container className="m-auto" style={{ width: "80%" }}>
      <div>
        <p style={{ fontSize: "110%" }}>Select a HUC 12 Watershed by: </p>
        <Select
          placeholder="Select an option"
          options={[
            { value: "hucName", label: "Watershed Name" },
            { value: "hucID", label: "Watershed ID" },
            {
              value: "hucBoundary",
              label: "Watershed Boundary",
            },
          ]}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: "gray",
              primary25: "lightgray",
            },
          })}
          styles={dropdownStyles2}
          onChange={(e) => {
            setRetrievingOptions(e.value);
            setHucNameSelected([]);
            setHucIDSelected([]);
            setFilterList([]);
            if (e.value === "hucBoundary") {
              setHucBoundary(true);
            } else {
              setHucBoundary(false);
            }
          }}
        />
      </div>
      <br></br>
      {retrievingOptions === "hucName" && (
        <div>
          <p
            style={{ fontSize: "16px", paddingBottom: "0", marginBottom: "0" }}
          >
            Below, select one or more HUC 12 Watersheds by Name.
          </p>
          <p style={{ fontSize: "16px" }}>
            Once selected, you can add the watersheds as either a single
            comibned AOI, or as multiple individual AOIs.
          </p>
          <Select
            options={hucNameList}
            isMulti
            isClearable={true}
            isSearchable={true}
            placeholder="Select watersheds from the list"
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: "gray",
                primary25: "lightgray",
              },
            })}
            styles={dropdownStyles2}
            value={hucNameSelected}
            onChange={(selectedOption) => {
              setHucNameSelected(selectedOption);
            }}
          />
        </div>
      )}
      {retrievingOptions === "hucID" && (
        <div>
          <p
            style={{ fontSize: "16px", paddingBottom: "0", marginBottom: "0" }}
          >
            Below, select one or more HUC 12 Watersheds by ID.
          </p>
          <p style={{ fontSize: "16px" }}>
            Once selected, you can add the watersheds as either a single
            comibned AOI, or as multiple individual AOIs.
          </p>
          <Select
            options={hucIDList}
            isMulti
            isClearable={true}
            isSearchable={true}
            placeholder="Select watersheds from the list"
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: "gray",
                primary25: "lightgray",
              },
            })}
            styles={dropdownStyles2}
            value={hucIDSelected}
            onChange={(selectedOption) => {
              setHucIDSelected(selectedOption);
            }}
          />
        </div>
      )}
      <br />
      {hucNameSelected && hucNameSelected.length ? (
        <div>
          <Button
            variant="primary"
            style={{ float: "left" }}
            onClick={handleSubmitBoundaryAsSingle}
          >
            Add as Single AOI
          </Button>
          <Button
            variant="primary"
            style={{ float: "right" }}
            onClick={handleSubmitBoundaryAsMultiple}
          >
            Add as Multiple AOIs
          </Button>
        </div>
      ) : hucIDSelected && hucIDSelected.length ? (
        <div>
          <Button
            variant="primary"
            style={{ float: "left" }}
            onClick={handleSubmitBoundaryAsSingle}
          >
            Add as Single AOI
          </Button>
          <Button
            variant="primary"
            style={{ float: "right" }}
            onClick={handleSubmitBoundaryAsMultiple}
          >
            Add as Multiple AOIs
          </Button>
        </div>
      ) : retrievingOptions === "hucBoundary" ? (
        <div>
          <Button
            variant="primary"
            style={{ float: "left" }}
            onClick={handleSubmitBoundaryAsSingle}
          >
            Add as Single AOI
          </Button>
          <Button
            variant="primary"
            style={{ float: "right" }}
            onClick={handleSubmitBoundaryAsMultiple}
          >
            Add as Multiple AOIs
          </Button>
        </div>
      ) : (
        <div>
          <Button
            disabled
            variant="secondary"
            style={{ float: "left" }}
            onClick={handleSubmitBoundaryAsSingle}
          >
            Add as Single AOI
          </Button>
          <Button
            disabled
            variant="secondary"
            style={{ float: "right" }}
            onClick={handleSubmitBoundaryAsMultiple}
          >
            Add as Multiple AOIs
          </Button>
        </div>
      )}
    </Container>
  );
};

export default AddBoundary;
