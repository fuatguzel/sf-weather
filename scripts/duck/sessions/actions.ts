import { City } from "../../api";
import { Constants, ActionTypes, SessionState } from ".";

export default class Actions {
    static updateCity(city: City): ActionTypes {
        return {
            type: Constants.UPDATE_CITY,
            payload: { city }
        }
    }
}

