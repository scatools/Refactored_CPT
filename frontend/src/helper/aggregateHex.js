import area from "@turf/area";

/*
        hab1: Connectivity to Existing Protected Area [Regular Data] -Max [Regular Utility Function] [Regular Utility Label]
        hab2: Connectivity of Natural Lands [Regular Data] -Mean [Regular Utility Function] [Regular Utility Label]
        hab3: Threat of Urbanization [Regular Data] -Max [Reversed Utility Function] [Reversed Utility Label]
        hab4: Composition of Priority Natural Lands [Regular Data] -Mean [Regular Utility Function] [Regular Utility Label]
        wq1: 303(d): Impaired Watershed Area [Regular Data] -Mean [Reversed Utility Function] [Reversed Utility Label]
        wq2: Hydrologic Response to Land-Use Change [Reversed Data] -Min [Regular Utility Function] [Reversed Utility Label]
        wq3: Percent Irrigated Agriculture [Regular Data] -Mean [Reversed Utility Function] [Reversed Utility Label]
        wq4: Lateral Connectivity to Floodplain [Regular Data] -Mean [Regular Utility Function] [Regular Utility Label]
        wq5: Composition of Riparian Zone Lands [Regular Data] -Mean [Regular Utility Function] [Regular Utility Label]
        wq6: Presence of Impoundments [Regular Data] -Max [Reversed Utility Function] [Reversed Utility Label]
        lcmr1: Vulnerable Areas of Terrestrial Endemic Species [Regular Data] -Max [Regular Utility Function] [Regular Utility Label]
        lcmr2: Threatened and Endangered Species - Critical Habitat Area [Regular Data] -Mean [Regular Utility Function] [Regular Utility Label]
        lcmr3: Threatened and Endangered Species - Number of Species [Regular Data] -Max [Regular Utility Function] [Regular Utility Label]
        lcmr4: Light Pollution Index [Reversed Data] -Min [Regular Utility Function] [Reversed Utility Label]
        lcmr5: Terrestrial Vertebrate Biodiversity [Regular Data] -Max [Regular Utility Function] [Regular Utility Label]
        lcmr6: Vulnerability to Invasive Plants [Regular Data] -Mean [Regular Utility Function] [Regular Utility Label]
        cl1: National Register of Historic Places [Regular Data] -Max [Regular Utility Function] [Regular Utility Label]
        cl2: National Heritage Area [Regular Data] -Mean [Regular Utility Function] [Regular Utility Label]
        cl3: Proximity to Socially Vulnerable Communities [Regular Data] -Max [Regular Utility Function] [Regular Utility Label]
        cl4: Community Threat Index [Regular Data] -Max [Regular Utility Function] [Regular Utility Label]
        cl5: Social Vulnerability Index [Regular Data] -Mean [Regular Utility Function] [Regular Utility Label]
        eco1: High Priority Working Lands [Regular Data] -Mean [Regular Utility Function] [Regular Utility Label]
        eco2: Commercial Fishing Reliance [Regular Data] -Max [Regular Utility Function] [Regular Utility Label]
        eco3: Recreational Fishing Engagement [Regular Data] -Max [Regular Utility Function] [Regular Utility Label]
        eco4: Access & Recreation: Number of Access Points [Regular Data] -Max [Regular Utility Function] [Regular Utility Label]
*/

export function calculateArea(input) {
  let totalArea = 0;
  if (input.length > 0) {
    totalArea =
      input.reduce((a, b) => {
        return a + area(b);
      }, 0) / 1000000;
  }
  return totalArea;
}

export function aggregate(input, area) {
  // [Reversed Data] wq2, lcmr4
  // For wq4 and wq5, no-data values are assigned as -1
  const hexNumber = input.length === 0 ? 1 : input.length;
  let aggregatedResult = input.reduce(
    (a, b) => {
      return {
        hab1:
          parseFloat(a.hab1) >= parseFloat(b.hab1)
            ? parseFloat(a.hab1)
            : parseFloat(b.hab1),
        hab2: parseFloat(a.hab2) + parseFloat(b.hab2),
        hab3:
          parseFloat(a.hab3) >= parseFloat(b.hab3)
            ? parseFloat(a.hab3)
            : parseFloat(b.hab3),
        hab4: parseFloat(a.hab4) + parseFloat(b.hab4),
        wq1: parseFloat(a.wq1) + parseFloat(b.wq1),
        wq2:
          parseFloat(a.wq2) >= parseFloat(b.wq2)
            ? parseFloat(b.wq2)
            : parseFloat(a.wq2),
        wq3: parseFloat(a.wq3) + parseFloat(b.wq3),
        wq4:
          parseFloat(a.wq4) === -1 || parseFloat(b.wq4) === -1
            ? -1
            : parseFloat(a.wq4) + parseFloat(b.wq4),
        wq5:
          parseFloat(a.wq5) === -1 || parseFloat(b.wq5) === -1
            ? -1
            : parseFloat(a.wq5) + parseFloat(b.wq5),
        wq6:
          parseFloat(a.wq6) >= parseFloat(b.wq6)
            ? parseFloat(a.wq6)
            : parseFloat(b.wq6),
        lcmr1:
          parseFloat(a.lcmr1) >= parseFloat(b.lcmr1)
            ? parseFloat(a.lcmr1)
            : parseFloat(b.lcmr1),
        lcmr2: parseFloat(a.lcmr2) + parseFloat(b.lcmr2),
        lcmr3:
          parseFloat(a.lcmr3) >= parseFloat(b.lcmr3)
            ? parseFloat(a.lcmr3)
            : parseFloat(b.lcmr3),
        lcmr4:
          parseFloat(a.lcmr4) >= parseFloat(b.lcmr4)
            ? parseFloat(b.lcmr4)
            : parseFloat(a.lcmr4),
        lcmr5:
          parseFloat(a.lcmr5) >= parseFloat(b.lcmr5)
            ? parseFloat(a.lcmr5)
            : parseFloat(b.lcmr5),
        lcmr6: parseFloat(a.lcmr6) + parseFloat(b.lcmr6),
        cl1:
          parseFloat(a.cl1) >= parseFloat(b.cl1)
            ? parseFloat(a.cl1)
            : parseFloat(b.cl1),
        cl2: parseFloat(a.cl2) + parseFloat(b.cl2),
        cl3:
          parseFloat(a.cl3) >= parseFloat(b.cl3)
            ? parseFloat(a.cl3)
            : parseFloat(b.cl3),
        cl4:
          parseFloat(a.cl4) >= parseFloat(b.cl4)
            ? parseFloat(a.cl4)
            : parseFloat(b.cl4),
        cl5: parseFloat(a.cl5) + parseFloat(b.cl5),
        eco1: parseFloat(a.eco1) + parseFloat(b.eco1),
        eco2:
          parseFloat(a.eco2) >= parseFloat(b.eco2)
            ? parseFloat(a.eco2)
            : parseFloat(b.eco2),
        eco3:
          parseFloat(a.eco3) >= parseFloat(b.eco3)
            ? parseFloat(a.eco3)
            : parseFloat(b.eco3),
        eco4:
          parseFloat(a.eco4) >= parseFloat(b.eco4)
            ? parseFloat(a.eco4)
            : parseFloat(b.eco4),
      };
    },
    {
      hab1: 0,
      hab2: 0,
      hab3: 0,
      hab4: 0,
      wq1: 0,
      wq2: 0,
      wq3: 0,
      wq4: 0,
      wq5: 0,
      wq6: 0,
      lcmr1: 0,
      lcmr2: 0,
      lcmr3: 0,
      lcmr4: 0,
      lcmr5: 0,
      lcmr6: 0,
      cl1: 0,
      cl2: 0,
      cl3: 0,
      cl4: 0,
      cl5: 0,
      eco1: 0,
      eco2: 0,
      eco3: 0,
      eco4: 0,
    }
  );

  aggregatedResult.hab0 = area;
  aggregatedResult.hab2 = aggregatedResult.hab2 / hexNumber;
  //Anthony - was assigned to itself, need to ask why.  aggregatedResult.hab3 = aggregatedResult.hab3;
  aggregatedResult.hab4 = aggregatedResult.hab4 / hexNumber;
  aggregatedResult.wq1 = aggregatedResult.wq1 / hexNumber;
  aggregatedResult.wq3 = aggregatedResult.wq3 / hexNumber;
  aggregatedResult.wq4 =
    aggregatedResult.wq4 === -1 ? -1 : aggregatedResult.wq4 / hexNumber;
  aggregatedResult.wq5 =
    aggregatedResult.wq5 === -1 ? -1 : aggregatedResult.wq5 / hexNumber;
  //Anthony - was assigned to itself, need to ask why.  aggregatedResult.wq6 = aggregatedResult.wq6;
  aggregatedResult.lcmr2 = aggregatedResult.lcmr2 / hexNumber;
  aggregatedResult.lcmr6 = aggregatedResult.lcmr6 / hexNumber;
  aggregatedResult.cl2 = aggregatedResult.cl2 / hexNumber;
  aggregatedResult.cl5 = aggregatedResult.cl5 / hexNumber;
  aggregatedResult.eco1 = aggregatedResult.eco1 / hexNumber;

  return aggregatedResult;
}

export function getStatus(input) {
  // NEED DOUBLE CHECK
  let status = {
    hab0: String(Math.round(input.hab0 * 247.105 * 100) / 100) + " Acres",
    hab1: input.hab1 === 1 ? "Yes" : "No",
    hab2: String(Math.round(input.hab2 * 10000) / 100) + "%",
    hab3:
      input.hab3 === 0
        ? "No Threat"
        : input.hab3 < 0.33
        ? "Low"
        : input.hab3 < 0.67
        ? "Medium"
        : "High",
    hab4: String(Math.round(input.hab4 * 10000) / 100) + "%",
    wq1: String(Math.round(input.wq1 * 10000) / 100) + "%",
    wq2:
      input.wq2 === 1
        ? "No Change or Decrease"
        : input.wq2 === 0.75
        ? "Minimal"
        : input.wq2 === 0.5
        ? "Moderate"
        : input.wq2 === 0.25
        ? "Significant"
        : "Very Significant",
    wq3: String(Math.round(input.wq3 * 10000) / 100) + "%",
    wq4:
      input.wq4 === -1
        ? "Insufficient Data"
        : String(Math.round(input.wq4 * 10000) / 100) + "%",
    wq5:
      input.wq5 === -1
        ? "Insufficient Data"
        : Math.round(input.wq5 * 100) / 100,
    wq6: input.wq6 === 1 ? "Yes" : "No",
    lcmr1:
      input.lcmr1 > 0.67
        ? "High"
        : input.lcmr1 > 0.33
        ? "Medium"
        : input.lcmr1 > 0
        ? "Low"
        : "Insufficient Data",
    lcmr2: String(Math.round(input.lcmr2 * 10000) / 100) + "%",
    lcmr3:
      input.lcmr3 === 0
        ? "No"
        : input.lcmr3 === 0.3
        ? "1-5"
        : input.lcmr3 === 0.6
        ? "5-10"
        : input.lcmr3 === 0.9
        ? "10-15"
        : "More Than 15",
    lcmr4:
      input.lcmr4 === 1
        ? "No Light Pollution"
        : input.lcmr4 > 0.66
        ? "Low"
        : input.lcmr4 > 0.33
        ? "Medium"
        : "High",
    lcmr5: Math.round(input.lcmr5 * 100) / 100,
    lcmr6: Math.round(input.lcmr6 * 100) / 100,
    cl1: input.cl1 === 1 ? "Yes" : "No",
    cl2: String(Math.round(input.cl2 * 10000) / 100) + "%",
    cl3:
      input.cl3 === 1
        ? "Within 1 Square Kilometer"
        : "Beyond 1 Square Kilometer",
    cl4:
      input.cl4 === 1
        ? "High"
        : input.cl4 >= 0.75
        ? "Medium-High"
        : input.cl4 >= 0.5
        ? "Medium"
        : input.cl4 >= 0.25
        ? "Medium-Low"
        : input.cl4 > 0
        ? "Low"
        : "Insufficient Data",
    cl5:
      input.cl5 === 1
        ? "High"
        : input.cl5 >= 0.75
        ? "Medium-High"
        : input.cl5 >= 0.5
        ? "Medium"
        : input.cl5 >= 0.25
        ? "Medium-Low"
        : input.cl5 > 0
        ? "Low"
        : "Insufficient Data",
    eco1: String(Math.round(input.eco1 * 10000) / 100) + "%",
    eco2: input.eco2 === 1 ? "Yes" : "No",
    eco3: input.eco3 === 1 ? "Yes" : "No",
    eco4:
      input.eco4 === 1
        ? "More Than 15"
        : input.eco4 === 0.8
        ? "11 - 15"
        : input.eco4 === 0.5
        ? "6 - 10"
        : input.eco4 === 0.25
        ? "2 - 5"
        : input.eco4 === 0.1
        ? "1"
        : "No",
  };
  return status;
}

export function getScaledForAssessment(input, id, name) {
  // [Reversed Utility Function] hab3, wq1, wq3, wq6
  // For wq4 and wq5, no-data values assigned as -1 should be considered as 0
  // Need to replace with scaling functions after switching to raw data
  let scaledResult = {
    id,
    name,
    hab0:
      input.hab0 === 0
        ? 0
        : input.hab0 <= 0.4
        ? 0.3
        : input.hab0 <= 0.8
        ? 0.75
        : input.hab0 <= 2
        ? 0.9
        : 1,
    hab1: input.hab1,
    hab2: input.hab2,
    hab3: 1 - input.hab3,
    hab4: input.hab4,
    wq1: 1 - input.wq1 <= 0 ? 0 : 1 - input.wq1,
    wq2: input.wq2,
    wq3: 1 - input.wq3,
    wq4: input.wq4 === -1 ? 0 : input.wq4,
    wq5: input.wq5 === -1 ? 0 : input.wq5,
    wq6: 1 - input.wq6,
    lcmr1: input.lcmr1,
    lcmr2: input.lcmr2,
    lcmr3: input.lcmr3,
    lcmr4: input.lcmr4,
    lcmr5: input.lcmr5,
    lcmr6: input.lcmr6,
    cl1: input.cl1,
    cl2: input.cl2,
    cl3: input.cl3,
    cl4: input.cl4,
    cl5: input.cl5,
    eco1: input.eco1,
    eco2: input.eco2,
    eco3: input.eco3,
    eco4: input.eco4,
  };
  return scaledResult;
}

export function mergeIntoArray(input) {
  let result = {
    id: [],
    name: [],
    hab0: [],
    hab1: [],
    hab2: [],
    hab3: [],
    hab4: [],
    wq1: [],
    wq2: [],
    wq3: [],
    wq4: [],
    wq5: [],
    wq6: [],
    lcmr1: [],
    lcmr2: [],
    lcmr3: [],
    lcmr4: [],
    lcmr5: [],
    lcmr6: [],
    cl1: [],
    cl2: [],
    cl3: [],
    cl4: [],
    cl5: [],
    eco1: [],
    eco2: [],
    eco3: [],
    eco4: [],
  };
  input.forEach((aoi) => {
    Object.entries(aoi).forEach((measure) => {
      result[measure[0]].push(measure[1]);
    });
  });
  return result;
}

export function calculateMeasures(input, weights) {
  const weightsList = {
    low: 0.34,
    medium: 0.67,
    high: 1,
  };
  return input.map((aoi) => {
    let result = [];
    if (!weights.hab.selected || weights.hab.selected.length === 0) {
      result.push(0);
    } else {
      let goalScore = 0;
      weights.hab.selected.forEach((item) => {
        goalScore +=
          item.utility > 0
            ? aoi[item.value] * weightsList[item.weight]
            : 1 - aoi[item.value] * weightsList[item.weight];
      });
      goalScore = goalScore / weights.hab.selected.length;
      result.push(goalScore);
    }
    if (!weights.wq.selected || weights.wq.selected.length === 0) {
      result.push(0);
    } else {
      let goalScore = 0;
      weights.wq.selected.forEach((item) => {
        goalScore +=
          item.utility > 0
            ? aoi[item.value] * weightsList[item.weight]
            : 1 - aoi[item.value] * weightsList[item.weight];
      });
      goalScore = goalScore / weights.wq.selected.length;
      result.push(goalScore);
    }
    if (!weights.lcmr.selected || weights.lcmr.selected.length === 0) {
      result.push(0);
    } else {
      let goalScore = 0;
      weights.lcmr.selected.forEach((item) => {
        goalScore +=
          item.utility > 0
            ? aoi[item.value] * weightsList[item.weight]
            : 1 - aoi[item.value] * weightsList[item.weight];
      });
      goalScore = goalScore / weights.lcmr.selected.length;
      result.push(goalScore);
    }
    if (!weights.cl.selected || weights.cl.selected.length === 0) {
      result.push(0);
    } else {
      let goalScore = 0;
      weights.cl.selected.forEach((item) => {
        goalScore +=
          item.utility > 0
            ? aoi[item.value] * weightsList[item.weight]
            : 1 - aoi[item.value] * weightsList[item.weight];
      });
      goalScore = goalScore / weights.cl.selected.length;
      result.push(goalScore);
    }
    if (!weights.eco.selected || weights.eco.selected.length === 0) {
      result.push(0);
    } else {
      let goalScore = 0;
      weights.eco.selected.forEach((item) => {
        goalScore +=
          item.utility > 0
            ? aoi[item.value] * weightsList[item.weight]
            : 1 - aoi[item.value] * weightsList[item.weight];
      });
      goalScore = goalScore / weights.eco.selected.length;
      result.push(goalScore);
    }
    return result;
  });
}
