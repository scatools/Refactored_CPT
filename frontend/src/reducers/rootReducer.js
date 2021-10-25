import { combineReducers } from "redux";
import aoiReducer from "./aoiReducer";
import weightsReducer from "./weightsReducer";
import assessmentReducer from "./assessmentReducer";
import loadingActionReducer from "./loadingActionReducer";

const rootReducer = combineReducers({
  aoi: aoiReducer,
  assessment: assessmentReducer,
  weights: weightsReducer,
  loading: loadingActionReducer,
});

export default rootReducer;
