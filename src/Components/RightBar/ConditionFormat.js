import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { IoIosCloseCircle } from "react-icons/io";

import ColorPalette from './ColorPalette.js';
import { SET_CONDITIONAL_FORMAT, SET_MODAL_VISIBILITY } from '../../Constants/actionTypes';

const mapStateToProps = state => ({
    conditional_format : state.table_controls.conditional_format,
    show : state.table_controls.show
});

const mapDispatchToProps = dispatch => ({
    setConditionalFormat : (payload) => dispatch({ type : SET_CONDITIONAL_FORMAT, payload }),
    setModalVisibility : (payload) => dispatch({ type : SET_MODAL_VISIBILITY, payload })
});

const Container = styled.div`
    border: 1px solid whitesmoke;
    position: absolute;
    top: 40px;
    color: black;
    z-index: 5;
    background-color: white;
    min-width: 260px;
    div:not(:last-child) {
        border-right: none !important;
      }
`;

const Header = styled.div`
    border: 1px solid whitesmoke;
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
    border-top: 1px solid #E9E4C8;
    border-bottom: 1px solid #E9E4C8;
    padding: 10px 10px;
`;

const ConditionalHeading = styled.div`
    font-size : 15px;
    float:left;
    padding: 8px 0 18px 0px;
    color: #959595;
    border-right: none !important;
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
    justify-content: space-around;
    padding : 8px 4px 0px 4px;
`;

const InputContainer = styled.div`
    display: flex;
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

const LabelContainer = styled.div`
    display: flex;
    padding : 8px 4px 0px 4px;
`;

const CustomInput = styled.input`
    width: 90px;
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
    padding: 0px 0px 15px 0px;
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

class ConditionFormat extends Component{
	constructor(props) {
        super(props);

        const { conditional_value_a, conditional_value_b, conditional_option } = this.props.conditional_format;

        this.state = {
            input : {
                "a" : conditional_value_a,
                "b" : conditional_value_b
            },
            select : conditional_option,
            cell_color : '#ffffff'
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
        const show = this.props.show === 'conditional_format';

        this.props.setModalVisibility({
            control_type : "conditional_format",
            show : !show
        });

        event.stopPropagation();
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

    handleColorChange = (cell_color) => {
        this.setState({
            cell_color : cell_color
        })
    }

    handleApplyButton = () => {
        const { input, select, cell_color } = this.state;
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
            this.props.setConditionalFormat({
                conditional_option : select,
                conditional_value_a : conditional_value_a,
                conditional_value_b : conditional_value_b,
                cell_color : cell_color
            })
        }
    }

    render(){
        const { input, select, cell_color } = this.state;
        return (
        <Container>
            <Header>
                <Heading>
                    Data Format Settings
                </Heading>
                <IoIosCloseCircle style={{"cursor" : "pointer", "fontSize" : "18px","color":"#BEA281","margin-right": "-10px"}} onClick={this.handleCloseButton} />
            </Header>
            <Conditionals>
                <ConditionalHeading>Style Cells Matching Condition</ConditionalHeading>
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
            </Conditionals>
            <ColorPalette cell_color={cell_color} handleColorChange={this.handleColorChange} />
            <ButtonContainer>
                <ApplyButton onClick={this.handleApplyButton}>
                    Apply
                </ApplyButton>
            </ButtonContainer>
        </Container>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConditionFormat);
