import { combineReducers } from "redux";
import aoiReducer from "./aoiReducer";
import weightsReducer from "./weightsReducer";
import assessmentReducer from "./assessmentReducer";
import loadingActionReducer from "./loadingActionReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  aoi: aoiReducer,
  assessment: assessmentReducer,
  weights: weightsReducer,
  loading: loadingActionReducer,
  user: userReducer,
});

export default rootReducer;
