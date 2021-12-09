import ContentInsetAdjustment from "@smartface/native/ui/ios/contentinsetadjustment";
import { City } from "../../api";

export interface SessionState {
    city: City
}


export namespace Constants {
    export const UPDATE_CITY = 'UPDATE_CITY';
}

declare namespace Actions {
    export interface SetCity {
        type: typeof Constants.UPDATE_CITY
        payload: { city: City }
    }
}

export type ActionTypes = Actions.SetCity