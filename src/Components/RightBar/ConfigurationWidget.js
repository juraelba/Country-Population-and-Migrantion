import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { IoIosCloseCircle } from "react-icons/io";

import { SET_CONFIGURATION_WIDGET, SET_MODAL_VISIBILITY } from '../../Constants/actionTypes';

const mapStateToProps = state => ({
    configurations_widget : state.table_controls.configurations_widget,
    show : state.table_controls.show
});

const mapDispatchToProps = dispatch => ({
    setConfigurationWidget : (payload) => dispatch({ type : SET_CONFIGURATION_WIDGET, payload }),
    setModalVisibility : (payload) => dispatch({ type : SET_MODAL_VISIBILITY, payload })
});

const Container = styled.div`
    border: 0.85px solid rgba(142, 142, 140, 0.335309);
    position: absolute;
    top: 40px;
    right: 0;
    color: black;
    z-index: 5;
    background: linear-gradient(180deg, #FFFFFF 0%, #FBFBFB 100%);
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.02);
    width: 250px;
    padding: 10px;
    div:not(:last-child) {
        border-right: none !important;
    }
`;

const Header = styled.div`
    padding: 10px 0px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #whitesmoke;

`;

const Heading = styled.div`
    font-weight: 600;
    color: #959595;
    font-size : 15px;
`;

const Conditionals = styled.div`
`;

const DropDownConditional = styled.div`
    padding: 10px 0px;
`;

const ConditionalHeading = styled.div`
    font-size : 16px;
    padding : 8px 0 18px 0px;
    float: left;
    color: #959595;
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
    border: 1px solid #DEDEDE;
    background: #fff;
    border-radius: 5px;
`;

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

class ConfigurationWidget extends Component{
	constructor(props) {
        super(props);

        const { appearance, number_format, number_decimal } = this.props.configurations_widget;

        this.state = {
            "appearance" : appearance,
            "number_format" : number_format,
            "number_decimal" : number_decimal
        };

        this.handleSelectOption = this.handleSelectOption.bind(this);
        this.handleCloseButton = this.handleCloseButton.bind(this);
        this.handleApplyButton = this.handleApplyButton.bind(this);
    }

    componentDidUpdate(prevProps, prevState){

    }

    handleSelectOption = (event, select_key) => {
        const conditional_option = event.target.value;
        const selected_option = {};
        selected_option[select_key] = conditional_option;

        this.setState(selected_option);

        event.stopPropagation();
    }

    handleCloseButton = (event)=>{
        const show = this.props.show === "configurations_widget";

        this.props.setModalVisibility({
            control_type : "configurations_widget",
            show : !show
        });
    }

    handleApplyButton = () => {
        const { appearance, number_format, number_decimal } = this.state;

        this.props.setConfigurationWidget({ 
            appearance : appearance, 
            number_format : number_format,
            number_decimal : number_decimal
        });
    }

    render(){
        const { appearance, number_format, number_decimal } = this.state;

        return (
        <Container>
            <Header>
                <Heading>
                    Table Configuration
                </Heading>
                <IoIosCloseCircle style={{"cursor" : "pointer", "fontSize" : "18px","color":"#BEA281","margin-right": "5px"}} onClick={this.handleCloseButton} />
            </Header>
            <Conditionals>
                <DropDownConditional>
                    <ConditionalHeading>Appearance</ConditionalHeading>
                    <CustomSelect onChange={(event) => { this.handleSelectOption(event, "appearance") }} value={appearance}>
                        <option value={"0"}>Standard</option>
                        <option value={"1"}>Blue</option>
                        <option value={"2"}>Green</option>
                        <option value={"3"}>Red</option>
                        <option value={"4"}>Brown</option>
                        <option value={"5"}>Grey</option>
                    </CustomSelect>
                </DropDownConditional>
                <DropDownConditional>
                    <ConditionalHeading>Number Format</ConditionalHeading>
                    <CustomSelect onChange={(event) => { this.handleSelectOption(event, "number_format") }} value={number_format}>
                        <option value={"0"}>General</option>
                        <option value={"1"}>Currency</option>
                        <option value={"2"}>Percent</option>
                        <option value={"3"}>Delimiter</option>
                    </CustomSelect>
                </DropDownConditional>
                <DropDownConditional>
                    <ConditionalHeading>Number Decimal</ConditionalHeading>
                    <CustomSelect onChange={(event) => { this.handleSelectOption(event, "number_decimal") }} value={number_decimal}>
                        <option value={"0"}>0</option>
                        <option value={"1"}>1</option>
                        <option value={"2"}>2</option>
                        <option value={"3"}>3</option>
                        <option value={"4"}>4</option>
                    </CustomSelect>
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

export default connect(mapStateToProps, mapDispatchToProps)(ConfigurationWidget);
