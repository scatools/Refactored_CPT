import {
  CHANGE_MEASURES,
  CHANGE_MEASURES_WEIGHT,
  CHANGE_GOAL_WEIGHTS,
  INPUT_NEW_AOI,
  DELETE_AOI,
  EDIT_AOI,
  GENERATE_ASSESSMENT,
  LOADER,
  LOAD_USER,
  LOAD_USER_SHAPE_LIST,
  LOAD_USER_REPORT_LIST,
  LOG_IN_USER,
} from "./actionType";

export function loadUser(data) {
  return {
    type: LOAD_USER,
    data,
  };
}

export function loadUserShapeList(data) {
  return {
    type: LOAD_USER_SHAPE_LIST,
    data,
  };
}

export function loadUserReportList(data) {
  return {
    type: LOAD_USER_REPORT_LIST,
    data,
  };
}

export function logInUser(loggedIn, username) {
  return {
    type: LOG_IN_USER,
    loggedIn,
    username,
  };
}

export function changeMeasures(goal, data) {
  return { type: CHANGE_MEASURES, goal, data };
}

export function changeMeasuresWeight(value, name, label, goal) {
  return {
    type: CHANGE_MEASURES_WEIGHT,
    goal,
    value,
    name,
    label,
  };
}

export function changeGoalWeights(value, goal) {
  return {
    type: CHANGE_GOAL_WEIGHTS,
    value,
    goal,
  };
}

export function input_aoi(data) {
  return {
    type: INPUT_NEW_AOI,
    data,
  };
}

export function delete_aoi(id) {
  return {
    type: DELETE_AOI,
    id,
  };
}

export function edit_aoi(id, data) {
  return {
    type: EDIT_AOI,
    id,
    data,
  };
}

export function generate_assessment(data) {
  return {
    type: GENERATE_ASSESSMENT,
    data,
  };
}

export const setLoader = (loading) => {
  return {
    type: LOADER,
    payload: loading,
  };
};
