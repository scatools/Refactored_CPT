import React, { useState } from "react";
import { Button, Container, Dropdown, Row } from "react-bootstrap";
import MapGL, { Source, Layer, WebMercatorViewport } from "react-map-gl";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { FaChrome } from "react-icons/fa";
import { MdDownload } from "react-icons/md";
//import { download } from "shp-write";
import bbox from "@turf/bbox";
// import axios from 'axios';
import ReportTable from "./ReportTable";
import PDFDownloader from "./PDFDownloader";
import Appendix from "./Appendix";
import Legend from "./Legend";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiY2h1Y2swNTIwIiwiYSI6ImNrMDk2NDFhNTA0bW0zbHVuZTk3dHQ1cGUifQ.dkjP73KdE6JMTiLcUoHvUA";

const Report = ({ aoiSelected }) => {
  const aoi = useSelector((state) => state.aoi);
  // Constant aoi contains all the AOIs provided so those not selected need to be filtered out
  const aoiList = Object.values(aoi).filter((aoi) => aoiSelected === aoi.id);
  const aoiColors = ["#00188f"];

  // Use the selected AOI to calculate the bounding box
  var aoiBbox = bbox({
    type: "FeatureCollection",
    features: aoiList[0].geometry,
  });
  // Format of the bounding box needs to be an array of two opposite corners ([[lon,lat],[lon,lat]])
  var viewportBbox = [
    [aoiBbox[0], aoiBbox[1]],
    [aoiBbox[2], aoiBbox[3]],
  ];
  // Use WebMercatorViewport to get center longitude/latitude and zoom level
  var newViewport = new WebMercatorViewport({
    width: 800,
    height: 600,
  }).fitBounds(viewportBbox, { padding: 200 });
  // console.log(newViewport);

  const [viewport, setViewport] = useState({
    latitude: newViewport.latitude,
    longitude: newViewport.longitude,
    zoom: newViewport.zoom,
  });

  if (!aoiSelected) {
    return <Redirect to="/" />;
  }

  // Download HTML report

  // Download from backend
  // const downloadHTML = async () =>{
  // For development on local server
  // 	const result = await axios.get('http://localhost:5000/report');
  // For production on Heroku
  // 	const result = await axios.get('https://sca-cpt-backend.herokuapp.com/report');
  // 	const url = window.URL.createObjectURL(new Blob([result.data]));
  // 	console.log(url);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', 'file.html');
  //     document.body.appendChild(link);
  //     link.click();
  // }

  // Download from frontend
  const downloadHTML = () => {
    var pageHTMLObject = document.getElementsByClassName("container")[0];
    var pageHTML = pageHTMLObject.outerHTML;
    var tempElement = document.createElement("a");

    tempElement.href =
      "data:text/html;charset=UTF-8," + encodeURIComponent(pageHTML);
    tempElement.target = "_blank";
    tempElement.download = "report.html";
    tempElement.click();
  };

  const downloadFootprint = () => {
    var aoiGeoJson = {
      type: "FeatureCollection",
      features: aoiList[0].geometry,
    };
    var options = {
      folder: "Spatial Footprint",
      types: {
        polygon: aoiList[0].name,
      },
    };
    //download(aoiGeoJson, options);
  };

  return (
    <>
      <div className="reportDownload">
        <Dropdown>
          <Dropdown.Toggle id="assessmentDownloadButton" variant="dark" style={{height: '40px', width : '200px'}}>
            <MdDownload /> Detailed Report
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item variant="dark" onClick={downloadHTML}>
              <FaChrome /> &nbsp; Download as HTML
            </Dropdown.Item>
            <PDFDownloader
              downloadFileName="Report"
              rootElementId="reportOverview"
            />
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="footprintDownload">
        <Button
          id="footprintDownloadButton"
          variant="dark"
          style={{height: '40px', width : '200px'}}
          onClick={downloadFootprint}
        >
          <MdDownload /> Spatial Footprint
        </Button>
      </div>

      <div id="reportOverview">
        <div className="reportNav">
          <a href="#map">Spatial Footprint</a>
          <a href="#checklist">Conservation Checklist</a>
          <a href="#summary">Overall Summary</a>
          <a href="#appendix">Appendix</a>
        </div>
        <Container style={{ position: "relative", top: "100px" }}>
          <Row id="mapHeading">
            <h2>Spatial Footprint:</h2>
          </Row>
          <Row id="map">
            <MapGL
              {...viewport}
              style={{ position: "relative" }}
              width="100vw"
              height="50vh"
              mapStyle="mapbox://styles/mapbox/light-v9"
              onViewportChange={(nextViewport) => setViewport(nextViewport)}
              mapboxApiAccessToken={MAPBOX_TOKEN}
            >
              {aoiList.length > 0 &&
                aoiList.map((aoi) => (
                  <Source
                    type="geojson"
                    data={{
                      type: "FeatureCollection",
                      features: aoi.geometry,
                    }}
                  >
                    <Layer
                      id={aoi.name}
                      type="fill"
                      paint={{
                        "fill-color": aoiColors[aoiList.indexOf(aoi)],
                        "fill-opacity": 0.5,
                      }}
                    />
                  </Source>
                ))}
              {aoiList.length > 0 && (
                <Legend aoiList={aoiList} aoiColors={aoiColors}></Legend>
              )}
            </MapGL>
          </Row>
          <br />
          <Row id="checklist">
            <h2>Conservation Checklist:</h2>
            <ReportTable aoiSelected={aoiSelected} />
          </Row>
          <hr />
          <Row id="summary">
            <h2>Overall Summary:</h2>
            <p>
              This report evaluates the area of <b>{aoiList[0].name}</b>, with
              approximately <b>{aoiList[0].scaleScore.hab0}</b> of land. &nbsp;
              {aoiList[0].scaleScore.hab1 === "Yes"
                ? aoiList[0].name +
                  " is within 1 km of currently protected land, according to the PAD-US layer."
                : aoiList[0].name +
                  " is not within 1 km of currently protected land, according to the PAD-US layer."}{" "}
              &nbsp;
              {aoiList[0].scaleScore.hab2 === "0%"
                ? aoiList[0].name +
                  " does not have any land classified as a hub or corridor by the EPA National Ecological Framework (NEF)."
                : [
                    aoiList[0].name +
                      " also supports structural connectivity, as ",
                    <b>{aoiList[0].scaleScore.hab2}</b>,
                    " percent of the area is classified as a hub or corridor by the EPA National Ecological Framework (NEF).",
                  ]}{" "}
              &nbsp;
              {/* Need to double check */}
              {aoiList[0].scaleScore.hab3 === "Insufficient data"
                ? "There is insufficient data to determine the future threat of development for " +
                  aoiList[0].name +
                  "."
                : aoiList[0].scaleScore.hab3 === "No Threat"
                ? aoiList[0].name + " is currently urbanized."
                : [
                    aoiList[0].name + " is expected to have a ",
                    <b>{aoiList[0].scaleScore.hab3}</b>,
                    " threat of development by the year 2060, according to the SLEUTH urbanization model.",
                  ]}{" "}
              &nbsp;
              {/* Missing Information */}
              {aoiList[0].scaleScore.hab4 === "0%"
                ? aoiList[0].name +
                  " is not known to house any habitat deemed high priority."
                : [
                    aoiList[0].name +
                      " houses habitats deemed high priority, occupying roughly ",
                    <b>{aoiList[0].scaleScore.hab4}</b>,
                    " of the total area.",
                  ]}
            </p>
            <p>
              {/* Missing Information */}
              {aoiList[0].scaleScore.wq1 === "0%"
                ? "There is no stream or river recognized within " +
                  aoiList[0].name +
                  "."
                : [
                    aoiList[0].name +
                      " also buffers water flowing into the" +
                      ",report_table_1$Impaired_Name," +
                      ", a waterbody with known impairments, and preservation would allow this landscape to continue to provide such water quality protections. " +
                      "Approximately ",
                    <b>{aoiList[0].scaleScore.wq1}</b>,
                    " of the waterways within " +
                      aoiList[0].name +
                      " are designated as impaired according to the EPA's 303(d) list.",
                  ]}{" "}
              &nbsp;
              {aoiList[0].scaleScore.wq2 === "Insufficient data"
                ? "There is insufficient data to determine the hydrologic response of " +
                  aoiList[0].name +
                  " to land-use change."
                : [
                    "Land-use change in " +
                      aoiList[0].name +
                      " has resulted in a ",
                    <b>{aoiList[0].scaleScore.hab4}</b>,
                    " hydrologic response to a standard rainfall event for this region.",
                  ]}
              {/* Missing Information*/}
              {/* Missing Information*/}
              {/* Missing Information*/}
              {/* Missing Information*/}
            </p>
            <p>
              The landscape of {aoiList[0].name} has a{" "}
              <b>{aoiList[0].scaleScore.lcmr1}</b> value for vulnerable areas of
              terrestrial endemic species, in accordance with the methods used
              by Jenkins et. al, 2015. &nbsp;
              {/* Confusing Information*/}
              {aoiList[0].scaleScore.lcmr2 === "0%"
                ? "Lands within " +
                  aoiList[0].name +
                  " are not known to support critical habitats for any federally listed species."
                : [
                    "Lands within " + aoiList[0].name + " support roughly ",
                    <b>{aoiList[0].scaleScore.lcmr2}</b>,
                    " of the critical habitat ranges for federally listed species.",
                  ]}{" "}
              &nbsp;
              {/* Confusing & Missing Information*/}
              {aoiList[0].scaleScore.lcmr3 === 0
                ? "Lands within " +
                  aoiList[0].name +
                  " are not known to support habitat ranges for any federally listed species."
                : aoiList[0].scaleScore.lcmr3 === 1
                ? "Lands within " +
                  aoiList[0].name +
                  " support the habitat range of the [TE_Name], a federally listed species."
                : [
                    "Lands within " +
                      aoiList[0].name +
                      " support habitat ranges for ",
                    <b>{aoiList[0].scaleScore.lcmr3}</b>,
                    " federally listed species, including the [TE_List].",
                  ]}{" "}
              &nbsp;
              {aoiList[0].scaleScore.lcmr4 === "No"
                ? "There is no light pollution in " + aoiList[0].name + "."
                : [
                    aoiList[0].name + " has a ",
                    <b>{aoiList[0].scaleScore.lcmr4}</b>,
                    " level of light pollution.",
                  ]}
              {/* Missing Information*/}
              {/* Missing Information*/}
            </p>
            <p>
              {aoiList[0].scaleScore.cl1 === 0
                ? "No places listed under the National Register of Historic Places are known to exist within or around " +
                  aoiList[0].name +
                  "."
                : [
                    "The National Register of Historic Places indicates that there are ",
                    <b>{aoiList[0].scaleScore.cl1}</b>,
                    " historic places within or around " +
                      aoiList[0].name +
                      ".",
                  ]}{" "}
              &nbsp;
              {aoiList[0].scaleScore.cl2 === "0%"
                ? aoiList[0].name +
                  " is not within a designated National Heritage Area."
                : [
                    "About ",
                    <b>{aoiList[0].scaleScore.cl1}</b>,
                    " of " +
                      aoiList[0].name +
                      " is within a designated National Heritage Area.",
                  ]}{" "}
              &nbsp;
              {aoiList[0].scaleScore.cl3 === "Insufficient data"
                ? "There is insufficient data to determine the social vulnerability of communities nearby " +
                  aoiList[0].name +
                  "."
                : [
                    "According to NOAA's Office for Coastal Management, " +
                      aoiList[0].name +
                      " is considered to have a ",
                    <b>{aoiList[0].scaleScore.cl3}</b>,
                    " proximity to socially vulnerable communities.",
                  ]}{" "}
              &nbsp;
              {aoiList[0].scaleScore.cl4 === "Insufficient data"
                ? "There is insufficient data to determine the community threat level of " +
                  aoiList[0].name +
                  "."
                : [
                    aoiList[0].name + " has a ",
                    <b>{aoiList[0].scaleScore.cl4}</b>,
                    " threat from coastal flooding and severe storm hazards.",
                  ]}
            </p>
            <p>
              {/* Missing Information*/}
              {aoiList[0].scaleScore.eco1 === "0%"
                ? "No working lands are known to exist within " +
                  aoiList[0].name +
                  "."
                : [
                    "Conserving this area of interest would also provide protection to working lands, with [Names of WL], comprising about ",
                    <b>{aoiList[0].scaleScore.eco1}</b>,
                    " of the landscape.",
                  ]}{" "}
              &nbsp;
              {aoiList[0].scaleScore.eco2 === "Insufficient data"
                ? "There is insufficient data to determine the commercial fishing reliance of the communities that " +
                  aoiList[0].name +
                  " is associated with."
                : [
                    "The communities in and around " +
                      aoiList[0].name +
                      " has a ",
                    <b>{aoiList[0].scaleScore.eco2}</b>,
                    " level of commercial fishing reliance.",
                  ]}{" "}
              &nbsp;
              {aoiList[0].scaleScore.eco3 === "Insufficient data"
                ? "There is insufficient data to determine the recreational fishing engagement of the communities that " +
                  aoiList[0].name +
                  " is associated with."
                : [
                    "The communities in and around " +
                      aoiList[0].name +
                      " has a ",
                    <b>{aoiList[0].scaleScore.eco3}</b>,
                    " level of recreational fishing engagement.",
                  ]}{" "}
              &nbsp;
              {aoiList[0].scaleScore.eco4 === 0 || 1
                ? [
                    "There is ",
                    <b>{aoiList[0].scaleScore.eco4}</b>,
                    " access point to natural areas within 25 km of " +
                      aoiList[0].name +
                      ".",
                  ]
                : [
                    "There are ",
                    <b>{aoiList[0].scaleScore.eco4}</b>,
                    " access points to natural areas within 25 km of " +
                      aoiList[0].name +
                      ".",
                  ]}
            </p>
          </Row>
          <hr />
          <Row id="appendix">
            <Appendix />
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Report;
