import { SET_DATAFLOW, REMOVE_DATAFLOW, UPDATE_DATAFLOW } from '../Constants/actionTypes';
const merge = require('deepmerge');

const defaultState = {
};

export default (state = defaultState , action ) => {
    let clonedState = merge({}, state);
    switch(action.type){
        case SET_DATAFLOW : {
            const { observation, series, dataset, id, dataflow } = action.payload;
            clonedState[id] = {
                observation, 
                series,
                dataset,
                dataflow, 
                id
            }
            return clonedState
        }

        case REMOVE_DATAFLOW : {
            const { id } = action.payload;
            delete clonedState[id];
            return clonedState;
        }

        case UPDATE_DATAFLOW : {
            const { id, type, value } = action.payload;
            clonedState[id][type] = value;
            return clonedState
        }

        default :
            return state
    }
}
