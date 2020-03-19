import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { IoIosCloseCircle } from "react-icons/io";
import HideConditionals from './HideConditionals.js';

import { SET_CONDITIONAL_FILTER, SET_MODAL_VISIBILITY } from '../../Constants/actionTypes';

const mapStateToProps = state => ({
    conditional_filter : state.table_controls.conditional_filter,
    show : state.table_controls.show
});

const mapDispatchToProps = dispatch => ({
    setConditionalFilter : (payload) => dispatch({ type : SET_CONDITIONAL_FILTER, payload }),
    setModalVisibility : (payload) => dispatch({ type : SET_MODAL_VISIBILITY, payload })
});

const Container = styled.div`
    border: 0.85px solid rgba(142, 142, 140, 0.335309);;
    position: absolute;
    top: 40px;
    color: black;
    z-index: 5;
    background: linear-gradient(180deg, #FFFFFF 0%, #FBFBFB 100%);
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.02);
    width: 250px;
    border-radius: 6px;
    div:not(:last-child) {
        border-right: none !important;
      }
`;

const Header = styled.div`
    padding: 10px 0px;
    display: flex;
    justify-content: space-around;
`;

const Heading = styled.div`
    font-weight: 600;
    color: #959595;
    font-size : 14px;
    border-right: none !important;
`;

const Conditionals = styled.div`
`;

const DropDownConditional = styled.div`
    border: 1px solid whitesmoke;
    padding: 10px 10px;
`

const ConditionalHeading = styled.div`
    font-size : 16px;
    padding : 8px 0 18px 0px;
    color: #959595;
    float:left;
    font-weight: 500px;
`;

const CustomSelect = styled.select`
    font-size: 14px;
    padding: 2px;
    height: 35px;
    cursor: pointer;
    outline: none;
    color: #7D7D7D; 
    width: 100%;
`;

const InputArea = styled.div`
    display: flex;
    justify-content: space-between;
    padding : 8px 0px;
`;

const LabelContainer = styled.div`
    display: flex;
    padding : 8px 4px 0px 4px;
`;


const InputContainer = styled.div`
    display: block;
`;

const CustomLabel = styled.label`
    font-size: 14px;
    font-weight:  500;
    padding: 5px 0px;
    font-weight: 600;
    color: #959595;
    &:first-child{
        margin-right: 105px
    }
`

const CustomInput = styled.input`
    width: 95px;
    padding: 10px 5px;
    outline: none;
    background-color : ${props => props.disabled ? 'whitesmoke' : 'none'};
    border: 0.85px solid #DEDEDE;
    border-radius: 5px;
    font-size: 14px;
    color: #959595;
`

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 0px 15px 0px;
`;

const ApplyButton = styled.button`
    background-color: #4a86e2;
    color: white;
    font-size: 13px;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    border : none;
`;

class ConditionFilter extends Component{
	constructor(props) {
        super(props);

        const { conditional_value_a, conditional_value_b, conditional_option, hide_conditionals } = this.props.conditional_filter;
        const { hide_zeroes, hide_empty_fields, hide_non_numerics } = hide_conditionals;

        this.state = {
            input : {
                "a" : conditional_value_a,
                "b" : conditional_value_b
            },
            select : conditional_option,
            hide_conditionals : {
                hide_zeroes : hide_zeroes,
                hide_empty_fields : hide_empty_fields,
                hide_non_numerics : hide_non_numerics
            }        
        };

        this.handleSelectOption = this.handleSelectOption.bind(this);
        this.handleCloseButton = this.handleCloseButton.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleApplyButton = this.handleApplyButton.bind(this);
    }

    componentDidUpdate(prevProps, prevState){

    }

    handleSelectOption = (event) => {
        const conditional_option = event.target.value;

        this.setState({
            select : conditional_option
        });

        event.stopPropagation();
    }

    handleCloseButton = (event)=>{
        const show = this.props.show === 'conditional_filter';

        this.props.setModalVisibility({
            control_type : "conditional_filter",
            show : !show
        });
    }

    handleInputChange = (event, input_type) => {
        const input_value = event.target.value;
        const { input } = this.state;
        const previous_input = Object.assign({}, input);
        previous_input[input_type] = input_value;
        const modified_input = previous_input;

        this.setState({
            input : modified_input
        });

        event.stopPropagation();
    }

    handleApplyButton = () => {
        const { input, select, hide_conditionals } = this.state;
        const conditional_value_a = input["a"];
        const conditional_value_b = input["b"];

        const validation_for_input_a = (select !== "0" && conditional_value_a.length === 0);
        const validation_for_input_b = ( (select === "7" || select === "8") && conditional_value_b.length === 0 );

        if (validation_for_input_a || validation_for_input_b){
            if (validation_for_input_a && validation_for_input_b){
                alert("Input value empty for both A & B");
            }
            else if (validation_for_input_b){
                alert("Input value empty for B");
            }
            else{
                alert("Input value empty for A");
            }
        }
        else{
            this.props.setConditionalFilter({ 
                conditional_option : select,
                conditional_value_a : conditional_value_a,
                conditional_value_b : conditional_value_b,
                hide_conditionals : hide_conditionals
            });
        }
    }

    handleCheckBox = (e, hide_conditional_key) => {
        const hide_conditional_value = e.target.checked;
        const { hide_conditionals } = this.state;
        hide_conditionals[hide_conditional_key] = hide_conditional_value;
    
        this.setState({
            hide_conditionals : hide_conditionals
        });
    }

    render(){
        const { input, select, hide_conditionals } = this.state;
        return (
        <Container>
            <Header>
                <Heading>
                    Data Filtering Settings
                </Heading>
                <IoIosCloseCircle style={{"cursor" : "pointer", "fontSize" : "18px", "color":"#BEA281","margin-right": "-10px"}} onClick={this.handleCloseButton} />
            </Header>
            <Conditionals>
                <HideConditionals hide_conditionals={hide_conditionals} handleCheckBox={this.handleCheckBox} />
                <DropDownConditional>
                    <ConditionalHeading>Hide Condition</ConditionalHeading>
                    <CustomSelect onChange={(event) => { this.handleSelectOption(event) }} value={select}>
                        <option value={"0"}>None</option>
                        <option value={"1"}>Equal to A</option>
                        <option value={"2"}>Not Equal to A</option>
                        <option value={"3"}>Greater than A</option>
                        <option value={"4"}>Less than A</option>
                        <option value={"5"}>Greater than or equal to A</option>
                        <option value={"6"}>Less than or equal to A</option>
                        <option value={"7"}>Not less than A, not greater than B</option>
                        <option value={"8"}>Less than A or greater than B</option>
                    </CustomSelect>
                    <LabelContainer>
                        <CustomLabel>{`A`}</CustomLabel>
                        <CustomLabel>{`B`}</CustomLabel>
                     </LabelContainer>
                    <InputArea>
                        <InputContainer> 
                            <CustomInput 
                                onChange={(event) => { this.handleInputChange(event, "a") }} 
                                value={input["a"] || undefined}
                                disabled={select === "0"}
                            />
                        </InputContainer>
 
                        <InputContainer> 
                            <CustomInput 
                                onChange={(event) => { this.handleInputChange(event, "b") }} 
                                value={input["b"] || undefined}
                                disabled={!(select === "7" || select === "8")}
                            />
                        </InputContainer>
                    </InputArea>
                </DropDownConditional>
            </Conditionals>
            <ButtonContainer>
                <ApplyButton onClick={this.handleApplyButton}>
                    Apply
                </ApplyButton>
            </ButtonContainer>
        </Container>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConditionFilter);
