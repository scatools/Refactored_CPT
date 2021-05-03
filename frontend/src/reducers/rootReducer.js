import {combineReducers} from 'redux';
import aoiReducer from './aoiReducer';
import weightsReducer from './weightsReducer';
import assessmentReducer from './assessmentReducer';

const rootReducer = combineReducers({
    aoi: aoiReducer,
    assessment:assessmentReducer, 
    weights: weightsReducer
})

export default rootReducer;