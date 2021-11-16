import React, { useState } from "react";
import Select from "react-select";
import { Container, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setLoader, input_aoi } from "../action";
import { calculateArea, aggregate, getStatus } from "../helper/aggregateHex";
import { v4 as uuid } from "uuid";

const AddBoundary = ({ setAlerttext, setView }) => {
  const dispatch = useDispatch();
  const [retrievingOptions, setRetrievingOptions] = useState("hucBoundary");
  const [hucList, setHucList] = useState([]);
  const [hucNameList, setHucNameList] = useState([]);
  const [hucIDList, setHucIDList] = useState([]);
  const [hucNameSelected, setHucNameSelected] = useState([]);
  const [hucIDSelected, setHucIDSelected] = useState([]);

  const handleSubmitBoundaryAsSingle = async () => {
    if (hucNameSelected.length === 0 && hucIDSelected.length === 0) {
      setAlerttext("At least one of the existing boundaries is required.");
      window.setTimeout(() => setAlerttext(false), 4000);
    } else {
      setAlerttext(false);
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
      const res = await axios.post(
        "https://sca-cpt-backend.herokuapp.com/data",
        { data }
      );
      const planArea = calculateArea(newList);
      dispatch(
        input_aoi({
          name: "Watershed Area",
          geometry: newList,
          hexagons: res.data.data,
          rawScore: aggregate(res.data.data, planArea),
          scaleScore: getStatus(aggregate(res.data.data, planArea)),
          id: uuid(),
        })
      );
      setView("viewCurrent");
    }
  };

  const handleSubmitBoundaryAsMultiple = () => {
    if (hucNameSelected.length === 0 && hucIDSelected.length === 0) {
      setAlerttext("At least one of the existing boundaries is required.");
      window.setTimeout(() => setAlerttext(false), 4000);
    } else {
      setAlerttext(false);
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
        const res = await axios.post(
          "https://sca-cpt-backend.herokuapp.com/data",
          { data }
        );
        const planArea = calculateArea(newList);
        // Geometry needs to be a list
        dispatch(
          input_aoi({
            name: "Watershed Area",
            geometry: [feature],
            hexagons: res.data.data,
            rawScore: aggregate(res.data.data, planArea),
            scaleScore: getStatus(aggregate(res.data.data, planArea)),
            id: uuid(),
          })
        );
      });
      setView("viewCurrent");
    }
  };

  const dropdownStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "white" : "black",
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      return { ...provided, opacity };
    },
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
        <p style={{ fontSize: "110%" }}>Geographic Scale</p>
        <Select
          placeholder="Select a scale"
          options={[{ value: "watershed", label: "Watershed Coastal Zone" }]}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: "gray",
              primary25: "lightgray",
            },
          })}
          styles={dropdownStyles}
        />
      </div>
      <br></br>
      <div>
        <p style={{ fontSize: "110%" }}>Retrieving Options</p>
        <Select
          placeholder="Select an option"
          options={[
            { value: "hucName", label: "by HUC 12 Watershed Name" },
            { value: "hucID", label: "by HUC 12 Watershed ID" },
            {
              value: "hucBoundary",
              label: "by HUC 12 Watershed Boundary",
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
          onChange={(e) => setRetrievingOptions(e.value)}
        />
      </div>
      <br></br>
      {retrievingOptions === "hucName" && (
        <div>
          <p style={{ fontSize: "110%" }}>Watershed Selection</p>
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
          <p style={{ fontSize: "110%" }}>Watershed Selection</p>
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
      <Button
        variant="dark"
        style={{ float: "left" }}
        onClick={handleSubmitBoundaryAsSingle}
      >
        Add as Single AOI
      </Button>
      <Button
        variant="dark"
        style={{ float: "right" }}
        onClick={handleSubmitBoundaryAsMultiple}
      >
        Add as Multiple AOIs
      </Button>
    </Container>
  );
};

export default AddBoundary;
