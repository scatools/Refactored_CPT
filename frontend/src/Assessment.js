import React, { useState } from "react";
import { Container, Dropdown, Row } from "react-bootstrap";
import MapGL, { Source, Layer, WebMercatorViewport } from "react-map-gl";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { FaChrome } from "react-icons/fa";
import { MdDownload } from "react-icons/md";
import { VscFolder, VscFileSubmodule } from "react-icons/vsc";
import { download } from "shp-write";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import bbox from "@turf/bbox";
import AssessmentTable from "./AssessmentTable";
import AssessmentScoreTable from "./AssessmentScoreTable";
import UserDefinedResult from "./UserDefinedResult";
import MCDAResult from "./MCDAResult";
import PDFDownloader from "./PDFDownloader";
import Appendix from "./Appendix";
import Legend from "./Legend";
import { setLoader } from "./action";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiY2h1Y2swNTIwIiwiYSI6ImNrMDk2NDFhNTA0bW0zbHVuZTk3dHQ1cGUifQ.dkjP73KdE6JMTiLcUoHvUA";

const Assessment = ({ aoiAssembled, setAoiSelected, setReportLink }) => {
  const dispatch = useDispatch();
  dispatch(setLoader(false));
  const assessment = useSelector((state) => state.assessment);
  const aoi = useSelector((state) => state.aoi);
  const aoiAssembledList = aoiAssembled.map((aoi) => aoi.value);
  // Constant aoi contains all the AOIs provided so those not assembled need to be filtered out
  const aoiList = Object.values(aoi).filter((aoi) =>
    aoiAssembledList.includes(aoi.id)
  );
  // Up to 10 colors for 10 different AOIs
  const aoiColors = [
    "#00188f",
    "#00bcf2",
    "#00b294",
    "#009e49",
    "#bad80a",
    "#fff100",
    "#ff8c00",
    "#e81123",
    "#ec008c",
    "#68217a",
  ];
  var aoiAssembly = [];

  // AOIs are stored as [0:{}, 1:{}, 2:{}, ...]
  for (var num in aoiList) {
    aoiAssembly = aoiAssembly.concat(aoiList[num].geometry);
  }
  // Use the set of all selected AOIs to calculate the bounding box
  var aoiBbox = bbox({
    type: "FeatureCollection",
    features: aoiAssembly,
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

  if (!assessment.hasOwnProperty("aoi")) {
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
    let headNodes = [...document.head.childNodes];
    let links = headNodes.filter(({ nodeName }) => nodeName === "LINK");
    console.log(links);
    fetch(links[0].href)
      .then((response) => response.text())
      .then((text) => {
        let newElement = document.createElement("style");
        newElement.textContent = text;
        document.head.appendChild(newElement);
      });
    // let bodyScripts = [...document.body.childNodes];
    // let scriptLinks = bodyScripts.filter(
    //   ({ nodeName }) => nodeName === "SCRIPT"
    // );
    // let baseURI = scriptLinks[0].baseURI;
    // let scriptSrc = scriptLinks[0].attributes.src.nodeValue;
    // fetch(`${baseURI}${scriptSrc}`)
    //   .then((response) => response.text())
    //   .then((text) => {
    //     let newElement = document.createElement("script");
    //     newElement.textContent = text;
    //     document.body.appendChild(newElement);
    //   });

    let pageHTML = document.documentElement.outerHTML;
    let tempElement = document.createElement("a");
    let removeTopSpace = '<div class="content"></div>';
    let removeDownloadButtons = `<div class="assessmentDownload"><div class="show dropdown"><button aria-haspopup="true" aria-expanded="true" id="assessmentDownloadButton" type="button" class="dropdown-toggle btn btn-dark"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="download" class="svg-inline--fa fa-download fa-w-16 fa-lg " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" color="white"><path fill="currentColor" d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path></svg> Assessment</button><div x-placement="bottom-end" aria-labelledby="assessmentDownloadButton" class="dropdown-menu show" style="position: absolute; inset: 0px 0px auto auto; margin: 0px; transform: translate3d(0px, 40px, 0px);" data-popper-reference-hidden="false" data-popper-escaped="false" data-popper-placement="bottom-end"><a variant="dark" href="#" class="dropdown-item" role="button"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 496 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M131.5 217.5L55.1 100.1c47.6-59.2 119-91.8 192-92.1 42.3-.3 85.5 10.5 124.8 33.2 43.4 25.2 76.4 61.4 97.4 103L264 133.4c-58.1-3.4-113.4 29.3-132.5 84.1zm32.9 38.5c0 46.2 37.4 83.6 83.6 83.6s83.6-37.4 83.6-83.6-37.4-83.6-83.6-83.6-83.6 37.3-83.6 83.6zm314.9-89.2L339.6 174c37.9 44.3 38.5 108.2 6.6 157.2L234.1 503.6c46.5 2.5 94.4-7.7 137.8-32.9 107.4-62 150.9-192 107.4-303.9zM133.7 303.6L40.4 120.1C14.9 159.1 0 205.9 0 256c0 124 90.8 226.7 209.5 244.9l63.7-124.8c-57.6 10.8-113.2-20.8-139.5-72.5z"></path></svg> &nbsp; Download as HTML</a><a variant="dark" href="#" class="dropdown-item" role="button"> <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M181.9 256.1c-5-16-4.9-46.9-2-46.9 8.4 0 7.6 36.9 2 46.9zm-1.7 47.2c-7.7 20.2-17.3 43.3-28.4 62.7 18.3-7 39-17.2 62.9-21.9-12.7-9.6-24.9-23.4-34.5-40.8zM86.1 428.1c0 .8 13.2-5.4 34.9-40.2-6.7 6.3-29.1 24.5-34.9 40.2zM248 160h136v328c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V24C0 10.7 10.7 0 24 0h200v136c0 13.2 10.8 24 24 24zm-8 171.8c-20-12.2-33.3-29-42.7-53.8 4.5-18.5 11.6-46.6 6.2-64.2-4.7-29.4-42.4-26.5-47.8-6.8-5 18.3-.4 44.1 8.1 77-11.6 27.6-28.7 64.6-40.8 85.8-.1 0-.1.1-.2.1-27.1 13.9-73.6 44.5-54.5 68 5.6 6.9 16 10 21.5 10 17.9 0 35.7-18 61.1-61.8 25.8-8.5 54.1-19.1 79-23.2 21.7 11.8 47.1 19.5 64 19.5 29.2 0 31.2-32 19.7-43.4-13.9-13.6-54.3-9.7-73.6-7.2zM377 105L279 7c-4.5-4.5-10.6-7-17-7h-6v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-74.1 255.3c4.1-2.7-2.5-11.9-42.8-9 37.1 15.8 42.8 9 42.8 9z"></path></svg> &nbsp; Download as PDF</a></div></div></div><div class="footprintDownload"><div class="dropdown"><button aria-haspopup="true" aria-expanded="false" id="footprintDownloadButton" type="button" class="dropdown-toggle btn btn-dark"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="download" class="svg-inline--fa fa-download fa-w-16 fa-lg " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" color="white"><path fill="currentColor" d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path></svg> Spatial Footprint</button></div></div>`;

    pageHTML = pageHTML
      .replace(removeTopSpace, "")
      .replace(removeDownloadButtons, "");
    // console.log(pageHTML);
    tempElement.href =
      "data:text/html;charset=UTF-8," + encodeURIComponent(pageHTML);
    tempElement.target = "_blank";
    tempElement.download = "assessment.html";
    tempElement.click();
  };

  const downloadFootprintAsSingle = () => {
    var aoiGeoJson = { type: "FeatureCollection", features: aoiAssembly };
    var options = {
      folder: "Spatial Footprint",
      types: {
        polygon: "Combined Assessment Area",
      },
    };
    download(aoiGeoJson, options);
  };

  const downloadFootprintAsMultiple = () => {
    aoiList.forEach((aoi, index) => {
      var aoiGeoJson = { type: "FeatureCollection", features: aoi.geometry };
      var options = {
        folder: "Spatial Footprint " + (index + 1).toString,
        types: {
          polygon: aoi.name,
        },
      };
      download(aoiGeoJson, options);
    });
  };

  return (
    <>
      <div className="assessmentDownload">
        <Dropdown>
          <Dropdown.Toggle id="assessmentDownloadButton" className="downloadButton" variant="dark">
            <MdDownload /> Assessment Report
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item variant="dark" onClick={downloadHTML}>
              <FaChrome /> &nbsp; Download as HTML
            </Dropdown.Item>
            <PDFDownloader
              downloadFileName="Assessment"
              rootElementId="assessmentOverview"
            />
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="footprintDownload">
        <Dropdown>
          <Dropdown.Toggle id="footprintDownloadButton" className="downloadButton" variant="dark">
            <MdDownload /> Spatial Footprint
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item variant="dark" onClick={downloadFootprintAsSingle}>
              <VscFolder /> &nbsp; Download as Single Shapefile
            </Dropdown.Item>
            <Dropdown.Item variant="dark" onClick={downloadFootprintAsMultiple}>
              <VscFileSubmodule /> &nbsp; Download as Multiple Shapefiles
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="tableDownload">
        <Dropdown>
          <Dropdown.Toggle id="footprintDownloadButton" className="downloadButton" variant="dark">
            <MdDownload /> Data Table
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item variant="dark">
              <ReactHTMLTableToExcel
                id="tableDownloadButton"
                className="downloadButton"
                table="assessmentTable"
                filename="Assessment Table"
                sheet="Assessment"
                buttonText="Raw Data Table"
              />
            </Dropdown.Item>
            <Dropdown.Item variant="dark">
              <ReactHTMLTableToExcel
                id="tableDownloadButton"
                className="downloadButton"
                table="assessmentTable"
                filename="Assessment Table"
                sheet="Assessment"
                buttonText="Scaled Data Table"
              />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="assessmentNav">
        <a href="#mapHeading">Spatial Footprint</a>
        <a href="#scoreHeading">Overall Scores</a>
        <a href="#dataHeading">Data Summary</a>
        <a href="#mcdaHeading">MCDA Results</a>
        <a href="#appendix">Appendix</a>
      </div>

      <div id="assessmentOverview">
        <Container style={{ position: "relative", top: "100px" }}>
          <h1 className="assessment-h1">Here Is The Report Title</h1>
          <Row id="mapHeading">
            <h2>Spatial Footprint:</h2>
          </Row>
          <br />
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
          <hr />
          <Row id="scoreHeading">
            <h2>Overall Scores with User-Provided Weights:</h2>
          </Row>
          <br />
          <Row id="score">
            <p>
              The following chart indicates the overall weighted scores for each
              area of interest (AOI).
            </p>
            <div>
              <UserDefinedResult />
            </div>
          </Row>
          <hr />
          <Row id="dataHeading">
            <h2>Data Summary:</h2>
          </Row>
          <br />
          <Row id="data">
            <h4>Values & Weights by RESTORE Goal:</h4>
            <p>
              The following table indicates the weighted scores of all RESTORE
              goals for each each area of interest (AOI) achieved, along with
              user-provided weights for different goals displayed in the
              rightmost column.
            </p>
            <AssessmentScoreTable />
            <h4>Values & Weights by Data Measure:</h4>
            <p>
              The following table indicates the weighted scores of all data
              measures for each area of interest (AOI) achieved, along with
              user-provided weights for different priority attributes displayed
              in the rightmost column.
            </p>
            <AssessmentTable
              setAoiSelected={setAoiSelected}
              setReportLink={setReportLink}
            />
          </Row>
          <hr />
          <Row id="mcdaHeading">
            <h2>SMAA MCDA Results:</h2>
          </Row>
          <br />
          <Row id="mcda">
            <p>
              <b>Stochastic Multicriteria Acceptability Analysis (SMAA) </b>
              is a collection of
              <b> Multi-Criteria Decision Analysis (MCDA) </b>
              methods that considers user preference as a weight space to rank
              the proposed projects from most preferred to least preferred. The
              SMAA algorithms produce an index called
              <b> Rank Acceptability (RA) </b>, which helps the user to
              understand the problem in conjunction with the preference. This RA
              index describes the combination of user preferences resulting in a
              certain rank for a project. The following charts indicate the RA
              results for each area of interest (AOI).
            </p>
            <div>
              <MCDAResult />
            </div>
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

export default Assessment;
