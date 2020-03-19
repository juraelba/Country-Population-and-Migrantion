import { ADD_SELECTION, REMOVE_DATAFLOW_SELECTIONS, REMOVE_SELECTION, SET_DIMENSIONS, SET_DIMENSION_VALUES, SET_FILTERS, SET_MULTIPLE_DIMENSIONS, SET_SELECTIONS, UPDATE_DIMENSIONS } from '../Constants/actionTypes';
const merge = require('deepmerge');

const defaultState = {
    // Stores data from the items selected in <LeftBar />
    "data_providers" : {
        "selected_ids" : [],
        "options" : {}
    },
    "statistical_domains" : {
        "selected_ids" : [],
        "options" : {}
    },
    "datasets" : {
        "selected_ids" : [],
        "options" : {}
    },

    "dimensions" : {
        "rows" : [],
        "columns" : [],
        "filters" : [],
        "values" : {}
    },

    "filters" : {},
}

// selections is an array of payload which will have atleast id.
// selection_type can be one of data_providers, statistical_domains or datasets
const mutateStateWithSelection = (clonedState, selection_type, selections) => {
    // current selected_ids are the ones which have been selected/unselected now.
    const current_selected_ids = selections.map((selection) => {
        const id = selection["id"];

        // also take this as an opportunity to update the corresponding options.
        clonedState[selection_type]["options"][id] = selection;
        return id
    });

    const selected_ids = [...clonedState[selection_type]["selected_ids"]];
    let updated_selected_ids;

    if (current_selected_ids.length > 0){
        updated_selected_ids = selected_ids.concat([current_selected_ids[0]]);
    }
    else{
        updated_selected_ids = selected_ids;
    }

    clonedState[selection_type]["selected_ids"] = updated_selected_ids;
    return clonedState
}

export default (state = defaultState , action ) => {
    let clonedState = merge({}, state);

    switch(action.type){
        case SET_SELECTIONS : {
            Object.entries(action.payload).forEach(([type, selections]) => {
                clonedState = mutateStateWithSelection(clonedState, type, selections);
            })
            return clonedState;
        }

        case ADD_SELECTION : {
            // selections is an array of payload which will have atleast id.
            // selection_type can be one of data_providers, statistical_domains or datasets
            const { selection, selection_type } = action.payload;
            // current selected_ids are the ones which have been selected/unselected now.
            const selected_id = selection["id"];
            const selected_ids = [...state[selection_type]["selected_ids"]];
            const updated_selected_ids = selected_ids.concat([selected_id]);

            return {
                ...state,
                [selection_type]: {
                    ...state[selection_type],
                    'selected_ids': [...updated_selected_ids],
                },
            };
        }

        case REMOVE_SELECTION : {
            // selections is an array of payload which will have atleast id.
            // selection_type can be one of data_providers, statistical_domains or datasets
            const { selection, selection_type } = action.payload;

            const current_selected_id = selection["id"];
            const selected_ids = [...state[selection_type]["selected_ids"]];
            const updated_selected_ids = selected_ids.filter((selected_id) => {
                if (selected_id === current_selected_id){
                    return false
                }
                else{
                    return true
                }
            });

            return {
                ...state,
                [selection_type]: {
                    ...state[selection_type],
                    'selected_ids': [...updated_selected_ids],
                },
            };
        }

        case REMOVE_DATAFLOW_SELECTIONS : {
            const { id } = action.payload;
            delete clonedState.filters[id];
            delete clonedState.dimensions.values[id];

            ['columns', 'rows', 'filters'].forEach((dimension) => {
                const values = clonedState.dimensions[dimension].filter((value) => {
                    return value['dataset_id'] !== id;
                });
                clonedState.dimensions[dimension] = values;
            });
            return clonedState;
        }

        case SET_DIMENSIONS : {
            const dimension_type = action.payload.dimension_type;
            const selections = action.payload.selections;
            clonedState["dimensions"][dimension_type] = selections;
            return clonedState
        }

        case SET_MULTIPLE_DIMENSIONS : {
            const { selections_map } = action.payload;
            const dimension_types = Object.keys(selections_map);

            dimension_types.forEach((dimension_type) => {
                const selections = selections_map[dimension_type].filter(obj => Boolean(obj));
                clonedState["dimensions"][dimension_type] = selections;
            });

            return clonedState
        }

        case SET_DIMENSION_VALUES : {
            const { series, observation, id } = action.payload;
            const dimensions = series.concat(observation);
            const dimension_values = {};
            const filtered_values = {};

            dimensions.forEach((dimension) => {
                const id = dimension.id;
                dimension_values[id] = dimension;

                filtered_values[id] = dimension["values"];
            })

            clonedState["dimensions"]["values"][id] = dimension_values;

            clonedState["filters"][id] = filtered_values;
            return clonedState
        }

        case UPDATE_DIMENSIONS : {
            const { dimension_type, selections, operation_type } = action.payload;
            let modifiedDimension;

            if (operation_type === "add"){
                modifiedDimension = clonedState["dimensions"][dimension_type].concat(selections);
            }
            else{
                const removable_selections = selections.map((selection)=>{
                    return `${selection["dataset_id"]}-${selection["id"]}`;
                });

                modifiedDimension = clonedState["dimensions"][dimension_type].filter((dimension) => {
                    const unique_key = `${dimension["dataset_id"]}-${dimension["id"]}`;
                    if (removable_selections.includes(unique_key)){
                        return false
                    }
                    else{
                        return true
                    }
                });
            }


            const uniqueDimensionIDS = new Set();
            clonedState["dimensions"][dimension_type] = modifiedDimension.filter((dimension)=>{
                if (uniqueDimensionIDS.has(dimension.id)){
                    return false
                }
                else{
                    uniqueDimensionIDS.add(dimension.id)
                    return true
                }
            })

            return clonedState
        }

        case SET_FILTERS : {
            const { values, dataset_id, id } = action.payload;

            clonedState["filters"][dataset_id][id] = values;

            return clonedState
        }

        default :
            return state
    }
}
