import {CHANGE_MEASURES, CHANGE_MEASURES_WEIGHT,CHANGE_GOAL_WEIGHTS, INPUT_NEW_AOI, DELETE_AOI, EDIT_AOI, GENERATE_ASSESSMENT} from './actionType';

export function changeMeasures(goal, data){
    return { type:CHANGE_MEASURES, goal, data}
  }
  
  export function changeMeasuresWeight( value, name, label, goal){
    return { 
      type: CHANGE_MEASURES_WEIGHT,
      goal,
      value,
      name,
      label 
    }
  }
  
  export function changeGoalWeights(value,goal){
    return {
      type: CHANGE_GOAL_WEIGHTS,
      value,
      goal
    }
  }

  export function input_aoi(data){
    return {
      type: INPUT_NEW_AOI,
      data
    }
  }

  export function delete_aoi(id){
    return {
      type: DELETE_AOI,
      id
    }
  }

  export function edit_aoi(id,data){
    return {
      type: EDIT_AOI,
      id,
      data
    }
  }

  export function generate_assessment(data){
    return {
      type: GENERATE_ASSESSMENT,
      data
    }
  }
