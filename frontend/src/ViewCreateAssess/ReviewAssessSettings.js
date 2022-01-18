import React, { useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { generate_assessment, setLoader } from "../action";
import { useDispatch, useSelector } from "react-redux";
import { calculateMeasures, getScaledForAssessment, mergeIntoArray } from "../helper/aggregateHex";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { GoInfo } from "react-icons/go";
import ReactTooltip from "react-tooltip";

const RESTOREGoal = [
  "Habitat",
  "Water Quality & Quantity",
  "Living Coastal & Marine Resources",
  "Community Resilience",
  "Gulf Economy",
];

const ReviewAssessSettings = ({ setAssessStep, aoiAssembled, customizedMeasures }) => {
  const weights = useSelector((state) => state.weights);
  const aoi = useSelector((state) => state.aoi);

  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const history = useHistory();

  const handleBack = () => {
    setAssessStep("selectDataMeasures");
  };

  const createAssessment = () => {
    dispatch(setLoader(true));
    async function calculateNewData() {
      const newAoiData = aoiAssembled.map((item) =>
        getScaledForAssessment(
          aoi[item.value].rawScore,
          aoi[item.value].id,
          aoi[item.value].name
        )
      );
      const goalList = {
        hab: "Habitat",
        wq: "Water Quality & Quantity",
        lcmr: "Living Costal & Marine Resources",
        cl: "Community Resilience",
        eco: "Gulf Economy",
      };
      const newWeights = Object.entries(weights).map((goal) => {
        return {
          goal: goalList[goal[0]],
          weights: goal[1].weight / 100,
        };
      });
      const newAoi = mergeIntoArray(newAoiData);
      const scoreByGoal = calculateMeasures(newAoiData, weights);

      // For development on local server
      // const result = await axios.post('http://localhost:5000/mcda',{
      // 	mean: scoreByGoal,
      // 	std: 0.1
      // });
      // For production on Heroku
      const result = await axios.post(
        "https://sca-cpt-backend.herokuapp.com/mcda",
        {
          mean: scoreByGoal,
          std: 0.1,
        }
      );
      const returnData = {
        aoi: newAoi,
        aoiScore: scoreByGoal,
        weights: newWeights,
        rankAccept: result.data.rankAccept,
        centralWeight: result.data.centralWeight,
      };
      dispatch(generate_assessment(returnData));
    }

    if (
      Object.values(weights).reduce((a, b) => {
        return a + b.weight;
      }, 0) !== 100 ||
      aoiAssembled.length <= 1
    ) {
      handleShow();
    } else {
      calculateNewData().then(() => {
        history.push("/assessment");
      });
    }
  }

  return (
    <>
      <Container className="card-body">
        Data Measure Weights Summary:
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th class="align-top">Measure Name</th>
              <th class="align-top">Goal Related</th>
              <th class="align-top">
                Utility &nbsp;
                <GoInfo data-tip data-for="utility" />
                <ReactTooltip id="utility" type="dark">
                  <span>Utility functions are mathematical representations of how users prefer varying values of a single measure</span>
                </ReactTooltip>
              </th>
              <th class="align-top">
                Weights &nbsp;
                <GoInfo data-tip data-for="measureWeights" />
                <ReactTooltip id="measureWeights" type="dark">
                  <span>Measure weights are set by users to emphasize certain priority attributes</span>
                </ReactTooltip>
              </th>
            </tr>
          </thead>
          <tbody>
            {weights.hab.selected &&
              weights.hab.selected.map((measure) => (
                <tr key={measure.value}>
                  <td>
                    {measure.label} &nbsp;
                    <GoInfo data-tip data-for={measure.value} />
                    <ReactTooltip id={measure.value} type='dark'>
                      <span>
                        {measure.label==='Connectivity to Existing Protected Area'? 'Connectivity to existing protected area indicates if the proposed conservation area is close to an area classified as protected by PAD-US 2.0 data.':
                        (measure.label==='Connectivity of Natural Lands'? 'A percent attribute that stands for the proportion of area classified as a hub or corridor.':
                        (measure.label==='Threat of Urbanization'? 'Threat of urbanization (ToU) indicates the likelihood of the given project area or area of interest (AoI) being urbanized by the year 2060.':
                        (measure.label==='Composition of Priority Natural Lands'? 'This attribute prioritizes rare habitat types and those that have been identified as conservation priorities in state and regional plans.':
                        "")))}
                      </span>
                    </ReactTooltip>
                  </td>
                  <td>Habitat</td>
                  <td>{measure.utility === "1" ? "Positive" : "Negative"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))
            }
            {!!customizedMeasures.hab.length &&
              customizedMeasures.hab.map((measure) => (
                <tr key={measure.value}>
                  <td>{measure.name}</td>
                  <td>Habitat</td>
                  <td>{measure.utility === "1" ? "Positive" : "Negative"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))
            }
            {weights.wq.selected &&
              weights.wq.selected.map((measure) => (
                <tr key={measure.value}>
                  <td>
                    {measure.label} &nbsp;
                    <GoInfo data-tip data-for={measure.value} />
                    <ReactTooltip id={measure.value} type='dark'>
                      <span>
                        {measure.label==='303(d): Impaired Watershed Area'? 'A percent attribute that stands for the proportion of impaired watershed within each hexagon.':
                        (measure.label==='Hydrologic Response to Land-Use Change'? 'The magnitude of change in peak flow due to Land-Use/Land-Cover change from 1996 to 2016.':
                        (measure.label==='Percent Irrigated Agriculture'? 'The proportion (%) of the area of interest that is covered by irrigated agriculture.':
                        (measure.label==='Lateral Connectivity of Floodplain'? 'The proportion of floodplain within the area of interest that is connected.':
                        (measure.label==='Composition of Riparizan Zone Lands'? 'An average index value of the composition of lands within a 100-meter buffer of streams.':
                        (measure.label==='Presence of Impoundments'? 'This measure describes whether or not an area is impacted by hydromodification.':
                        "")))))}
                      </span>
                    </ReactTooltip>
                  </td>
                  <td>Water</td>
                  <td>{measure.utility === "1" ? "Positive" : "Negative"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))
            }
            {!!customizedMeasures.wq.length &&
              customizedMeasures.wq.map((measure) => (
                <tr key={measure.value}>
                  <td>{measure.name}</td>
                  <td>Water</td>
                  <td>{measure.utility === "1" ? "Positive" : "Negative"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))
            }
            {weights.lcmr.selected &&
              weights.lcmr.selected.map((measure) => (
                <tr key={measure.value}>
                  <td>
                    {measure.label} &nbsp;
                    <GoInfo data-tip data-for={measure.value} />
                    <ReactTooltip id={measure.value} type='dark'>
                      <span>
                        {measure.label==='Vulnerable Areas of Terrestrial Endemic Species'? 'This measure represents the ratio of endemic species to the amount of protected land in the contiguous U.S.':
                        (measure.label==='Threatened and Endangered Species - Critical Habitat Area'? 'The measure is based on the U.S. Fish and Wildlife Service designated federally threatened and endangered (T&E) critical habitat.':
                        (measure.label==='Threatened and Endangered Species - Number of Species'? 'This attribute measures the number of federally threatened and endangered (T&E) species that have habitat ranges identified within each hexagon.':
                        (measure.label==='Light Pollution Index'? 'An index that measures the intensity of light pollution within each hexagon.':
                        (measure.label==='Terrestrial Vertebrate Biodiversity'? 'Definition of Terrestrial Vertebrate Biodiversity.':
                        (measure.label==='Vulnerability to Invasive Plants'? 'Definition of Vulnerability to Invasive Plants.':
                        "")))))}
                      </span>
                    </ReactTooltip>
                  </td>
                  <td>LCMR</td>
                  <td>{measure.utility === "1" ? "Positive" : "Negative"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))
            }
            {!!customizedMeasures.lcmr.length &&
              customizedMeasures.lcmr.map((measure) => (
                <tr key={measure.value}>
                  <td>{measure.name}</td>
                  <td>LCMR</td>
                  <td>{measure.utility === "1" ? "Positive" : "Negative"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))
            }
            {weights.cl.selected &&
              weights.cl.selected.map((measure) => (
                <tr key={measure.value}>
                  <td>
                    {measure.label} &nbsp;
                    <GoInfo data-tip data-for={measure.value} />
                    <ReactTooltip id={measure.value} type='dark'>
                      <span>
                        {measure.label==='National Register of Historic Places'? 'A numeric attribute that represents the counts of historic places within each hexagon.':
                        (measure.label==='National Heritage Area'? 'A percent attribute that stands for the proportion of heritage area within each hexagon.':
                        (measure.label==='Proximity to Socially Vulnerability Communities'? 'This measure indicates the proximity to communities that are socially vulnerable according to the National Oceanic and Atmospheric Administration’s (NOAA) Social Vulnerability Index.':
                        (measure.label==='Community Threat Index'? 'The Community Threat Index (CTI) comes from the Coastal Resilience Evaluation and Siting Tool (CREST).':
                        "")))}
                      </span>
                    </ReactTooltip>
                  </td>
                  <td>Resilience</td>
                  <td>{measure.utility === "1" ? "Positive" : "Negative"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))
            }
            {!!customizedMeasures.cl.length &&
              customizedMeasures.cl.map((measure) => (
                <tr key={measure.value}>
                  <td>{measure.name}</td>
                  <td>Resilience</td>
                  <td>{measure.utility === "1" ? "Positive" : "Negative"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))
            }
            {weights.eco.selected &&
              weights.eco.selected.map((measure) => (
                <tr key={measure.value}>
                  <td>
                    {measure.label} &nbsp;
                    <GoInfo data-tip data-for={measure.value} />
                    <ReactTooltip id={measure.value} type='dark'>
                      <span>
                        {measure.label==='High Priority Working Lands'? 'The percentage area of pine, cropland, and pasture/hay classes from the National Land Cover Database (NLCD) 2016 classification map.':
                        (measure.label==='Commercial Fishing Reliance'? 'Commercial fishing reliance measures the presence of commercial fishing through fishing activity as shown through permits and vessel landings relative to the population of a community. ':
                        (measure.label==='Recreational Fishing Engagement'? 'Recreational fishing engagement measures the presence of recreational fishing through fishing activity estimates, including charter fishing pressure, private fishing pressure, and shore fishing pressure.':
                        (measure.label==='Access & Recreation - Number of Access Points'? 'This measure indicates the number of points within a 25 km buffer radius of a hexagon, where the public can access places to engage in outdoor recreation.':
                        "")))}
                      </span>
                    </ReactTooltip>
                  </td>
                  <td>Economy</td>
                  <td>{measure.utility === "1" ? "Positive" : "Negative"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))
            }
            {!!customizedMeasures.eco.length &&
              customizedMeasures.eco.map((measure) => (
                <tr key={measure.value}>
                  <td>{measure.name}</td>
                  <td>Economy</td>
                  <td>{measure.utility === "1" ? "Positive" : "Negative"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))
            }
          </tbody>
        </Table>
        Goal Weights:
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>RESTORE Goal</th>
              <th>
                Goal Weights &nbsp;
                <GoInfo data-tip data-for="goalWeights" />
                <ReactTooltip id="goalWeights" type="dark">
                  <span>Goal weights are set by users to emphasize specific RESTORE goals</span>
                </ReactTooltip>
              </th>
            </tr>
          </thead>
          <tbody>
            {RESTOREGoal.map((goal, idx) => {
              return (
                <tr key={idx}>
                  <td>{goal}</td>
                  <td>{Object.values(weights)[idx].weight}%</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Button className="my-5" variant="dark" onClick={handleBack} style={{float:"left"}}>
          Back
        </Button>
        <Button className="my-5" variant="dark" onClick={createAssessment} style={{float:"right"}}>
          Generate Assessment
        </Button>
      </Container>
    </>
  );
};

export default ReviewAssessSettings;
