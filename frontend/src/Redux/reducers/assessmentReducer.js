import {GENERATE_ASSESSMENT} from '../actionType';

const initState = {}
    

const assessmentReducer = (state=initState, action) =>{
    switch (action.type){
        case GENERATE_ASSESSMENT:
            return action.data;
        default:
            return state;
    }
}

export default assessmentReducer;