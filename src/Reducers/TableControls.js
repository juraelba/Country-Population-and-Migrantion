import { SET_COLUMN_FUNCTIONS,SET_SELECT_FUNCTION, SET_CONDITIONAL_FILTER, SET_CONDITIONAL_FORMAT, SET_CONFIGURATION_WIDGET, SET_ADD_FUNCTION, SET_HIDE_CONDITIONAL, SET_MODAL_VISIBILITY, SET_ROW_FUNCTIONS, SET_SELECTION_VIEW } from '../Constants/actionTypes';
const merge = require('deepmerge');

// The state is designed such that it is able to store all the table controls including
// conditional_format, conditional_filter, configurations_widget. There is also a show
// key inside the state which is responsible for storing the current open modal. Its value
// is equivalent to the modal/control_type which is currently open. Else the value is false.

const defaultState = {
    "conditional_format" : {
        "cell_color" : "#ffffff",
        "conditional_option" : "0",
        "conditional_value_a" : null,
        "conditional_value_b" : null
    },
    "conditional_filter" : {
        "cell_color" : "#ffffff",
        "conditional_option" : "0",
        "conditional_value_a" : null,
        "conditional_value_b" : null,
        "hide_conditionals" : {
            "hide_zeroes" : false,
            "hide_empty_fields" : false,
            "hide_non_numerics" : false
        }
    },
    "configurations_widget" : {
        "appearance" : "0",
        "number_format" : "0",
        "number_decimal" : "0"
    },
    "show" : false,
    "view_selection" : {
        "chart": false,
        "table": true
    },
    "add_function":{
        "select_function":"none"
    },
    "check_function":{
        "checked_function": [],
        "all_items": {}
    },
}

export default (state = defaultState , action ) => {
    let clonedState = merge({}, state);

    switch(action.type){
        case SET_ADD_FUNCTION : {
            const { select_function } = action.payload;
            clonedState["add_function"]["select_function"] = select_function;
            return clonedState   
        }
        case SET_SELECT_FUNCTION : {
            const { checked_function,all_items } = action.payload;
            clonedState["check_function"]["checked_function"] = checked_function;
            clonedState["check_function"]["all_items"] = all_items;
            return clonedState   
        }
        case SET_CONDITIONAL_FILTER : {
            const { conditional_option, conditional_value_a, conditional_value_b, hide_conditionals } = action.payload;
            const clonedConditionals = merge({}, hide_conditionals);
            clonedState["conditional_filter"]["conditional_option"] = conditional_option;
            clonedState["conditional_filter"]["conditional_value_a"] = conditional_value_a;
            clonedState["conditional_filter"]["conditional_value_b"] = conditional_value_b;
            clonedState["conditional_filter"]["hide_conditionals"] = clonedConditionals;
            return clonedState
        }

        case SET_CONDITIONAL_FORMAT : {
            const { conditional_option, conditional_value_a, conditional_value_b, cell_color } = action.payload;
            clonedState["conditional_format"]["conditional_option"] = conditional_option;
            clonedState["conditional_format"]["conditional_value_a"] = conditional_value_a;
            clonedState["conditional_format"]["conditional_value_b"] = conditional_value_b;
            clonedState["conditional_format"]["cell_color"] = cell_color;
            return clonedState
        }
        case SET_MODAL_VISIBILITY : {
            const { control_type, show } = action.payload;
            if (show) {

                clonedState["show"] = control_type;
            }
            else{
                clonedState["show"] = show;
            }

            return clonedState
        }
        case SET_HIDE_CONDITIONAL : {
            // This action is specifically for hiding conditionals inside conditional_filter as shown above.
            const { hide_conditional_key, hide_conditional_value } = action.payload;
            clonedState["conditional_filter"]["hide_conditionals"][hide_conditional_key] = hide_conditional_value;
            return clonedState
        }

        case SET_CONFIGURATION_WIDGET : {
            // Set all configuration options here = ["appearance", "number_format", "number_decimal"]
            const { appearance, number_format, number_decimal } = action.payload;
            clonedState["configurations_widget"]["appearance"] = appearance;
            clonedState["configurations_widget"]["number_format"] = number_format;
            clonedState["configurations_widget"]["number_decimal"] = number_decimal;
            return clonedState
        }

        case SET_SELECTION_VIEW : {
            // selection_view_type can be either chart or table
            const { selection_view_type, selection_view_value } = action.payload;

            // dont set view_selection for both chart and table to be false at the same time
            if (!selection_view_value){
                if (!(state["view_selection"]["chart"] && state["view_selection"]["table"])){
                    return clonedState
                }
            }

            clonedState["view_selection"][selection_view_type] = selection_view_value;
            return clonedState
        }

        default :
            return state
    }
}
