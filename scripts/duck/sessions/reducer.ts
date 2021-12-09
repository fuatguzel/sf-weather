import { SessionState, Constants, ActionTypes } from '.';

const initialState: SessionState = {
    city: {
        id: -1,
        name: '',
        latitude: '-1',
        longitude: '-1',
        population: -1,
        region: ''
    }
}

export default function (state = initialState, action: ActionTypes): SessionState {
    const newState = Object.assign({}, state);
    switch (action.type) {
        case Constants.UPDATE_CITY: {
            newState.city = action.payload.city
            break;
        }
        default: {
            break;
        }
    }
    return newState;
}