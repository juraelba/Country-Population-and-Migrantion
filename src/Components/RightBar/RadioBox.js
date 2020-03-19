import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { SET_FUNCTION, SET_MODAL_VISIBILITY } from '../../Constants/actionTypes';

const mapStateToProps = state => ({
    // hide_conditionals : state.table_controls.conditional_filter.hide_conditionals
    // checked: state.table_controls.add_function.setSelectFunction;
    // disabled: state.table_controls.add_function.radio_mode
});

const mapDispatchToProps = dispatch => ({
    setSelectFunction : (payload) => dispatch({ type : SET_FUNCTION, payload }),
    setModalVisibility : (payload) => dispatch({ type : SET_MODAL_VISIBILITY, payload })
});

const CustomInput = styled.input`
    cursor: pointer;
`;

class RadioBox extends Component{
	constructor(props) {
        super(props);

        // const { table_controls, control_type } = this.props;
        // const is_selected = table_controls[control_type]["select_function"];

        // this.state = {
        //     is_selected : is_selected
        // }
        this.state = {
            is_selected : false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    componentDidUpdate(prevProps, prevState){
    }
    handleInputChange = (e, value) => {
        const checked = e.currentTarget.checked;
        var select;
        if(checked && value === 'None'){
            select = "0"
        } else if(checked && value === 'Sum'){
            select = "1"
        } else if(checked && value === 'Average'){
            select = "2"
        } else if(checked && value === 'Median'){
            select = "3"
        }
        // this.props.setSelectFunction({ 
        //     control_type : 'add_function', 
        //     select_function : select
        // });
        // e.stopPropagation();
        this.props.setSelectFunction({ 
            control_type : 'add_function', 
            select_function : select,
            function_mode: 'radio_mode'
        });
        // const show = this.props.show === 'add_function';
        this.props.setModalVisibility({
            control_type : "add_function",
            show : false
        });
        e.stopPropagation();
    }
    render(){
        const { value, name, disabled } = this.props;
        return (
            <CustomInput 
                type="radio" 
                name={name}
                value={value}
                // disabled={!disabled}
                onChange={(e) => { this.handleInputChange(e, value) }}
            />
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(RadioBox);
