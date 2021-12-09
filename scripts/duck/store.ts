import {
    createStore,
    applyMiddleware,
    combineReducers
} from "redux";

import session from "./sessions/reducer";


const rootReducer = combineReducers({
    session
});

export default createStore(rootReducer);