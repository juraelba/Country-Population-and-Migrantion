import { INIT_IMJS } from '../Constants/actionTypes';
import { initialize as initializeAPI } from '../API';
const merge = require('deepmerge');

const defaultState = {
    "imjs" : {
        "instance" : null,
        "is_init" : false
    }
}

export default (state = defaultState , action ) => {
    switch(action.type){
        case INIT_IMJS : {
            const IMJS = initializeAPI();
            const clonedState = merge({}, state);
            clonedState["imjs"]["instance"] = IMJS;
            clonedState["imjs"]["is_init"] = true;
            return clonedState
        }

        default :
            return state
    }
}
