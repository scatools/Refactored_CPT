import { LOAD_USER, LOAD_USER_SHAPE_LIST, LOG_IN_USER } from "../actionType";

const initialState = {
  loggedIn: false,
  username: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  admin: false,
  shapefileList: [],
  reportList: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_USER:
      return {
        ...state,
        loggedIn: action.loggedIn,
        username: action.username,
      };

    case LOAD_USER:
      return {
        ...state,
        username: action.data.username,
        email: action.data.email,
        firstName: action.data.first_name,
        lastName: action.data.last_name,
        admin: action.data.is_admin,
      };

    case LOAD_USER_SHAPE_LIST:
      return {
        ...state,
        shapefileList: action.data,
      };

    default:
      return state;
  }
};

export default userReducer;
