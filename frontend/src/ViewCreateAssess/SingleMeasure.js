import React, { useState } from "react";
import { Button, ButtonGroup, Container, ToggleButton } from "react-bootstrap";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { changeMeasures, changeMeasuresWeight } from "../action";
import ReactTooltip from "react-tooltip";
import parse from "html-react-parser";
import { GoInfo } from "react-icons/go";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const SingleMeasure = ({
  customizedMeasures,
  customizeMeasure,
  setAssessStep,
}) => {
  const weights = useSelector((state) => state.weights);
  const dispatch = useDispatch();

  const arrowIcon = <FontAwesomeIcon icon={faArrowLeft} size="lg" />;
  const plusCircle = (
    <FontAwesomeIcon
      className="hover-icon"
      icon={faPlusCircle}
      size="lg"
      onClick={() => {
        customizeMeasure(dataMeasList[dataI]);
      }}
    />
  );

  // For predefined data measures

  const handleChange = (value, name, label, type) => {
    dispatch(changeMeasuresWeight(value, name, label, type));
  };

  // For customized data measures

  const setMeasureUtility = (goal, index, newUtility) => {
    customizedMeasures[goal][index].utility = newUtility;
  };

  const setMeasureWeight = (goal, index, newWeight) => {
    customizedMeasures[goal][index].weight = newWeight;
  };

  let dataMeasList = ["hab", "wq", "lcmr", "cl", "eco"];
  const [dataI, setDataI] = useState(0);

  for (const elem of dataMeasList) {
    if (!weights[elem].weight)
      dataMeasList = dataMeasList.filter((a) => a !== elem);
  }

  const handleNext = () => {
    if (dataI === dataMeasList.length - 1) {
      setAssessStep("reviewAssessSettings");
    } else {
      setDataI(dataI + 1);
    }
  };

  const handleBack = () => {
    if (dataI === 0) {
      setAssessStep("selectRestoreWeights");
    } else {
      let newI = dataI - 1;
      setDataI(newI);
    }
  };

  const options = {
    hab: {
      name: "Habitat",
      dropdown: [
        {
          value: "hab0",
          label: "Project Area",
          toolTip: "Size of the AOI",
          utilityLabel: "Is more or less project area for your project?",
          left: "More",
          right: "Less",
        },
        {
          value: "hab1",
          label: "Connectivity to Existing Protected Area",
          toolTip: `Connectivity to existing protected area indicates if the
           proposed conservation area is within 1 km of an area classified
           as protected by PAD-US 2.0 data.
          <br />
          <a
            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/habitat#connectivity-to-existing-protected-area"
            target="_blank"
            rel="noreferrer"
            className="tool-link"
          >
            Click for more
          </a>`,
          utilityLabel: "Is more or less connected better for your project?",
          left: "More",
          right: "Less",
        },
        {
          value: "hab2",
          label: "Connectivity of Natural Lands",
          toolTip: `A percent attribute that stands for the proportion of
        area classified as a hub or corridor.
        <br />
        <a
          href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/habitat#connectivity-of-natural-lands"
          target="_blank"
          rel="noreferrer"
          className="tool-link"
        >
          Click for more
        </a>`,
          utilityLabel: "Is more or less connected better for your project?",
          left: "More",
          right: "Less",
        },
        {
          value: "hab3",
          label: "Threat of Urbanization",
          toolTip: `Threat of urbanization (ToU) indicates the likelihood
        of the given project area or area of interest (AoI)
        being urbanized by the year 2060.
        <br />
        <a
          href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/habitat#threat-of-urbanization"
          target="_blank"
          rel="noreferrer"
          className="tool-link"
        >
          Click for more
        </a>`,
          utilityLabel:
            "Is higher or lower threat of urbanization better for your project?",
          left: "Lower",
          right: "Higher",
        },
        {
          value: "hab4",
          label: "Composition of Priority Natural Lands",
          toolTip: `This attribute prioritizes rare habitat types and
          those that have been identified as conservation
          priorities in state and regional plans.
          <br />
          <a
            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/habitat#composition-of-priority-natural-lands"
            target="_blank"
            rel="noreferrer"
            className="tool-link"
          >
            Click for more
          </a>`,
          utilityLabel:
            "Are more or less natural lands better for your project?",
          left: "More",
          right: "Less",
        },
      ],
    },

    wq: {
      name: "Water Quality & Quantity",
      dropdown: [
        {
          value: "wq1",
          label: "303(d): Impaired Watershed Area",
          toolTip: `A percent attribute that stands for the proportion of
          impaired watershed within each hexagon.
          <br />
          <a
            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/waterquality_quantity#303-d-impaired-watershed-area"
            target="_blank"
            rel="noreferrer"
            className="tool-link"
          >
            Click for more
          </a>`,
          utilityLabel:
            "Is more or less impaired area better for your project?",
          left: "Less",
          right: "More",
        },
        {
          value: "wq2",
          label: "Hydrologic Response to Land-Use Change",
          toolTip: `The magnitude of change in peak flow due to
          Land-Use/Land-Cover change from 1996 to 2016.
          <br />
          <a
            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/waterquality_quantity#hydrologic-response-to-land-use-change"
            target="_blank"
            rel="noreferrer"
            className="tool-link"
          >
            Click for more
          </a>`,
          utilityLabel:
            "Is more or less impact on hydrology better for your project?",
          left: "Less",
          right: "More",
        },
        {
          value: "wq3",
          label: "Percent Irrigated Agriculture",
          toolTip: `The proportion (%) of the area of interest that is
          covered by irrigated agriculture.
          <br />
          <a
            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/waterquality_quantity#percent-irrigated-agriculture"
            target="_blank"
            rel="noreferrer"
            className="tool-link"
          >
            Click for more
          </a>`,
          utilityLabel:
            "Is more or less irrigated agriculture better for your project?",
          left: "Less",
          right: "More",
        },
        {
          value: "wq4",
          label: "Lateral Connectivity of Floodplain",
          toolTip: `<>
          The proportion of floodplain within the area of
          interest that is connected.
          <br />
          <a
            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/waterquality_quantity#lateral-connectivity-of-floodplain"
            target="_blank"
            rel="noreferrer"
            className="tool-link"
          >
            Click for more
          </a>`,
          utilityLabel: "Is more or less connectivity better for your project?",
          left: "More",
          right: "Less",
        },
        {
          value: "wq5",
          label: "Composition of Riparizan Zone Lands",
          toolTip: `An average index value of the composition of lands
          within a 100-meter buffer of streams.
          <br />
          <a
            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/waterquality_quantity#composition-of-riparian-zone-lands"
            target="_blank"
            rel="noreferrer"
            className="tool-link"
          >
            Click for more
          </a>`,
          utilityLabel:
            "Is more or less natural riparian zone better for your project?",
          left: "More",
          right: "Less",
        },
        {
          value: "wq6",
          label: "Presence of Impoundments",
          toolTip: `This measure describes whether or not an area is
          impacted by hydromodification.
          <br />
          <a
            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/waterquality_quantity#presence-of-impoundments"
            target="_blank"
            rel="noreferrer"
            className="tool-link"
          >
            Click for more
          </a>`,
          utilityLabel: "Is more or less impoundment better for your project?",
          left: "Less",
          right: "More",
        },
      ],
    },

    lcmr: {
      name: "Living Coastal & Marine Resources",
      dropdown: [
        {
          value: "lcmr1",
          label: "Vulnerable Areas of Terrestrial Endemic Species",
          toolTip: `This measure represents the ratio of endemic species
          to the amount of protected land in the contiguous U.S.
          <br />
          <a
            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/lcmr#vulnerable-areas-of-terrestrial-endemic-species"
            target="_blank"
            rel="noreferrer"
            className="tool-link"
          >
            Click for more
          </a>`,
          utilityLabel:
            "Is a more or less vulnerable area better for your project?",
          left: "More",
          right: "Less",
        },
        {
          value: "lcmr2",
          label: "Threatened and Endangered Species - Critical Habitat Area",
          toolTip: `The measure is based on the U.S. Fish and Wildlife
          Service designated federally threatened and endangered
          (T&E) critical habitat.
          <br />
          <a
            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/lcmr#threatened-and-endangered-species-critical-habitat-area"
            target="_blank"
            rel="noreferrer"
            className="tool-link"
          >
            Click for more
          </a>`,
          utilityLabel:
            "Is more or less critical habitat better for your project?",
          left: "More",
          right: "Less",
        },
        {
          value: "lcmr3",
          label: "Threatened and Endangered Species - Number of Species",
          toolTip: `This attribute measures the number of federally
          threatened and endangered (T&E) species that have
          habitat ranges identified within each hexagon.
          <br />
          <a
            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/lcmr#threatened-and-endangered-species-number-of-species"
            target="_blank"
            rel="noreferrer"
            className="tool-link"
          >
            Click for more
          </a>`,
          utilityLabel: "Are more or less T&E species better for your project?",
          left: "More",
          right: "Less",
        },
        {
          value: "lcmr4",
          label: "Light Pollution Index",
          toolTip: `An index that measures the intensity of light
          pollution within each hexagon.
          <br />
          <a
            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/lcmr#light-pollution-index"
            target="_blank"
            rel="noreferrer"
            className="tool-link"
          >
            Click for more
          </a>`,
          utilityLabel:
            "Is more or less light pollution better for your project?",
          left: "More",
          right: "Less",
        },
        {
          value: "lcmr5",
          label: "Terrestrial Vertebrate Biodiversity",
          toolTip: `This measure represents the average number of mammal, bird, amphibian, and reptile species identified in an area.
          <br />
          <a
            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/lcmr#terrestrial-vertebrate-biodiversity"
            target="_blank"
            rel="noreferrer"
            className="tool-link"
          >
            Click for more
          </a>`,
          utilityLabel:
            "Is higher or lower terrestrial vertebrate biodiversity better for your project?",
          left: "Higher",
          right: "Lower",
        },
        {
          value: "lcmr6",
          label: "Vulnerability to Invasive Plants",
          toolTip: `This measure represents an area's average probability of invasion from
          31 different invasive plant species found within the Gulf Coast Region of the United States.
          <br />
          <a
            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/lcmr#vulnerability-to-invasive-plants"
            target="_blank"
            rel="noreferrer"
            className="tool-link"
          >
            Click for more
          </a>`,
          utilityLabel:
            "Is higher or lower vulnerability to invasive plants better for your project?",
          left: "Higher",
          right: "Lower",
        },
      ],
    },

    cl: {
      name: "Community Resilience",
      dropdown: [
        {
          value: "cl1",
          label: "National Register of Historic Places",
          toolTip: ` A numeric attribute that represents the counts of
          historic places within each hexagon.
          <br />
          <a
            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/community_resilience#national-register-of-historic-places"
            target="_blank"
            rel="noreferrer"
            className="tool-link"
          >
            Click for more
          </a>`,
          utilityLabel:
            "Are more or less historic places better for your project?",
          left: "More",
          right: "Less",
        },
        {
          value: "cl2",
          label: "National Heritage Area",
          toolTip: `A percent attribute that stands for the proportion of
          heritage area within each hexagon.
          <br />
          <a
            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/community_resilience#national-heritage-area"
            target="_blank"
            rel="noreferrer"
            className="tool-link"
          >
            Click for more
          </a>`,
          utilityLabel:
            "Are more or less national heritage areas better for your project?",
          left: "More",
          right: "Less",
        },
        {
          value: "cl3",
          label: "Proximity to Socially Vulnerable Communities",
          toolTip: `This measure indicates the proximity to communities
          that are socially vulnerable according to the National
          Oceanic and Atmospheric Administration’s (NOAA) Social
          Vulnerability Index.
          <br />
          <a
            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/community_resilience#proximity-to-socially-vulnerable-communities"
            target="_blank"
            rel="noreferrer"
            className="tool-link"
          >
            Click for more
          </a>`,
          utilityLabel: "",
          left: "",
          right: "",
        },
        {
          value: "cl4",
          label: "Community Threat Index",
          toolTip: `The Community Threat Index (CTI) comes from the
          Coastal Resilience Evaluation and Siting Tool (CREST).
          <br />
          <a
            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/community_resilience#community-threat-index"
            target="_blank"
            rel="noreferrer"
            className="tool-link"
          >
            Click for more
          </a>`,
          utilityLabel:
            "Is higher or lower threat to community better for your project?",
          left: "Higher",
          right: "Lower",
        },
        {
          value: "cl5",
          label: "Social Vulnerability Index",
          toolTip: `The Social Vulnerability Index (SoVI) is derived from 43 key variables directly linked to the vulnerability factors.
          <br />
          <a
            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/community_resilience#social-vulnerability-index"
            target="_blank"
            rel="noreferrer"
            className="tool-link"
          >
            Click for more
          </a>`,
          utilityLabel: "",
          left: "",
          right: "",
        },
      ],
    },

    eco: {
      name: "Gulf Economy",
      dropdown: [
        {
          value: "eco1",
          label: "High Priority Working Lands",
          toolTip: `The percentage area of pine, cropland, and pasture/hay
          classes from the National Land Cover Database (NLCD)
          2016 classification map.
          <br />
          <a
            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/economy#high-priority-working-lands"
            target="_blank"
            rel="noreferrer"
            className="tool-link"
          >
            Click for more
          </a>`,
          utilityLabel:
            "Are more or less priority working lands better for your project?",
          left: "More",
          right: "Less",
        },
        {
          value: "eco2",
          label: "Commercial Fishing Reliance",
          toolTip: `Commercial fishing reliance measures the presence of
          commercial fishing through fishing activity as shown
          through permits and vessel landings relative to the
          population of a community.
          <br />
          <a
            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/economy#commercial-fishing-reliance"
            target="_blank"
            rel="noreferrer"
            className="tool-link"
          >
            Click for more
          </a>`,
          utilityLabel: "Is higher or lower reliance better for your project?",
          left: "Higher",
          right: "Lower",
        },
        {
          value: "eco3",
          label: "Recreational Fishing Engagement",
          toolTip: `Recreational fishing engagement measures the presence
          of recreational fishing through fishing activity
          estimates, including charter fishing pressure, private
          fishing pressure, and shore fishing pressure.
          <br />
          <a
            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/economy#recreational-fishing-engagement"
            target="_blank"
            rel="noreferrer"
            className="tool-link"
          >
            Click for more
          </a>`,
          utilityLabel: "Is more or less engagement better for your project?",
          left: "More",
          right: "Less",
        },
        {
          value: "eco4",
          label: "Access & Recreation - Number of Access Points",
          toolTip: `<>
          This measure indicates the number of points within a
          25 km buffer radius of a hexagon, where the public can
          access places to engage in outdoor recreation.
          <br />
          <a
            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/economy#access-and-recreation-number-of-access-points"
            target="_blank"
            rel="noreferrer"
            className="tool-link"
          >
            Click for more
          </a>`,
          utilityLabel:
            "Are more or less recreational access points better for your project?",
          left: "More",
          right: "Less",
        },
      ],
    },
  };

  let currentDataMeasure = options[dataMeasList[dataI]];

  return (
    <div>
      <span>{options[dataMeasList[dataI]].name}</span>
      <Select
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        menuPortalTarget={document.body}
        options={currentDataMeasure.dropdown}
        isMulti
        isClearable={false}
        placeholder={`Select ${currentDataMeasure.name} measures...`}
        name="colors"
        className="basic-multi-select"
        classNamePrefix="select"
        value={weights[dataMeasList[dataI]].selected}
        onChange={(selectedOption) => {
          let state;
          if (selectedOption) {
            state = selectedOption.map((selected) => ({
              ...selected,
              utility: selected["utility"] || "1",
              weight: selected["weight"] || "medium",
            }));
          } else {
            state = null;
          }
          dispatch(changeMeasures([dataMeasList[dataI]], state));
        }}
      />
      <div style={{ float: "left" }}>
        {plusCircle}
        <span>Add Custom Measure</span>
      </div>
      <br />
      {weights[dataMeasList[dataI]].selected &&
        weights[dataMeasList[dataI]].selected.map((measure) => (
          <div className="m-2 measure-container" key={measure.value}>
            <span style={{ display: "block" }} className="my-1">
              {measure.label} &nbsp;
              <GoInfo data-tip data-for={measure.value} />
              <ReactTooltip
                delayHide={500}
                delayUpdate={500}
                id={measure.value}
                clickable="true"
                type="dark"
              >
                <span>{parse(`${measure.toolTip}`)}</span>
              </ReactTooltip>
            </span>
            <div className="d-flex justify-content-between utility-btn-cont">
              <div>
                <div>
                  <p className="smaller-text no-margin no-padding">
                    {measure.utilityLabel}
                  </p>
                </div>
                <ButtonGroup className="utility-inner" toggle>
                  <ToggleButton
                    type="radio"
                    data-tip
                    data-for={"positive-" + measure.value}
                    variant="outline-secondary"
                    name="utility"
                    value="1"
                    checked={measure.utility === "1"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        [dataMeasList[dataI]]
                      )
                    }
                  >
                    {measure.left}
                  </ToggleButton>
                  {console.log(measure)}
                  <ToggleButton
                    type="radio"
                    data-tip
                    data-for={"negative-" + measure.value}
                    variant="outline-secondary"
                    name="utility"
                    value="-1"
                    checked={measure.utility === "-1"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        [dataMeasList[dataI]]
                      )
                    }
                  >
                    {measure.right}
                  </ToggleButton>
                </ButtonGroup>
              </div>
              <div>
                <div>
                  <p className="smaller-text no-margin">Select the priority</p>
                  <br />
                </div>
                <ButtonGroup toggle className="ml-2 weight-inner">
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="low"
                    checked={measure.weight === "low"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        [dataMeasList[dataI]]
                      )
                    }
                  >
                    Low
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="medium"
                    checked={measure.weight === "medium"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        [dataMeasList[dataI]]
                      )
                    }
                  >
                    Medium
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="high"
                    checked={measure.weight === "high"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        [dataMeasList[dataI]]
                      )
                    }
                  >
                    High
                  </ToggleButton>
                </ButtonGroup>
              </div>
            </div>
          </div>
        ))}
      {!!customizedMeasures[dataMeasList[dataI]].length &&
        customizedMeasures[dataMeasList[dataI]].map((measure, index) => (
          <div className="m-2 measure-container" key={measure.name}>
            <span style={{ display: "block" }} className="my-1">
              {measure.name}
            </span>
            <div className="utility-btn-cont">
              <div>
                <div>
                  <p className="smaller-text no-margin no-padding">
                    Are higher or lower values better for your project?
                  </p>
                </div>
                <ButtonGroup className="utility-inner" toggle>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    data-tip
                    data-for={`positive-${[dataMeasList[dataI]]}-c`}
                    name="utility"
                    value="1"
                    checked={measure.utility === "1"}
                    onChange={(e) =>
                      setMeasureUtility([dataMeasList[dataI]], index, "1")
                    }
                  >
                    Higher
                  </ToggleButton>
                  <ReactTooltip
                    id={`positive-${[dataMeasList[dataI]]}-c`}
                    place="top"
                  >
                    More is better
                  </ReactTooltip>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    data-tip
                    data-for={`negative-${[dataMeasList[dataI]]}-c`}
                    name="utility"
                    value="-1"
                    checked={measure.utility === "-1"}
                    onChange={(e) =>
                      setMeasureUtility([dataMeasList[dataI]], index, "-1")
                    }
                  >
                    Lower
                  </ToggleButton>
                  <ReactTooltip
                    id={`negative-${[dataMeasList[dataI]]}-c`}
                    place="top"
                  >
                    Less is better
                  </ReactTooltip>
                </ButtonGroup>
              </div>
              <div>
                <div>
                  <p className="smaller-text no-margin">Select the priority</p>
                </div>
                <ButtonGroup toggle className="ml-2 weight-inner">
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="low"
                    checked={measure.weight === "low"}
                    onChange={(e) =>
                      setMeasureWeight([dataMeasList[dataI]], index, "low")
                    }
                  >
                    Low
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="medium"
                    checked={measure.weight === "medium"}
                    onChange={(e) =>
                      setMeasureWeight([dataMeasList[dataI]], index, "medium")
                    }
                  >
                    Medium
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="high"
                    checked={measure.weight === "high"}
                    onChange={(e) =>
                      setMeasureWeight([dataMeasList[dataI]], index, "high")
                    }
                  >
                    High
                  </ToggleButton>
                </ButtonGroup>
              </div>
            </div>
          </div>
        ))}
      <br />
      <Container className="add-assess-cont">
        <Button variant="secondary" onClick={handleBack}>
          {arrowIcon} Back
        </Button>
        <Button variant="primary" onClick={handleNext}>
          Next
        </Button>
      </Container>
    </div>
  );
};

export default SingleMeasure;
