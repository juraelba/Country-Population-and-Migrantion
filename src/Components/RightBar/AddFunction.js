import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { IoIosCloseCircle } from "react-icons/io";

import { SET_ADD_FUNCTION, SET_MODAL_VISIBILITY } from '../../Constants/actionTypes';

const mapStateToProps = state => ({
    add_function : state.table_controls.add_function,
    show : state.table_controls.show
});

const mapDispatchToProps = dispatch => ({
    setAddFunction : (payload) => dispatch({ type : SET_ADD_FUNCTION, payload }),
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

class AddFunction extends Component{
	constructor(props) {
        super(props);

        const { select_function } = this.props.add_function;

        this.state = {
            select : select_function       
        };

        this.handleSelectOption = this.handleSelectOption.bind(this);
        this.handleCloseButton = this.handleCloseButton.bind(this);
        this.handleApplyButton = this.handleApplyButton.bind(this);
    }

    handleSelectOption = (event) => {
        const select_function = event.target.value;
        this.setState({
            select: select_function
        });
        event.stopPropagation();
    }

    handleCloseButton = (event)=>{
        const show = this.props.show === 'add_function';
        this.props.setModalVisibility({
            control_type : "add_function",
            show : !show
        });   
    }

    handleApplyButton = () => {
        const {select} = this.state;
        if (select === "none"){
            alert("Select atleast one Function");
        }else{
            this.props.setAddFunction({ 
                select_function : select
            });
        const show = this.props.show === 'add_function';
            this.props.setModalVisibility({
                control_type : "add_function",
                show : !show
            });
        }
    }
    render()
    {
        const { select } = this.state;
        return (
        <Container>
            <Header>
                <Heading>
                    Function Setting
                </Heading>
                <IoIosCloseCircle style={{"cursor" : "pointer", "fontSize" : "18px", "color":"#BEA281","marginRight": "-10px"}} onClick={this.handleCloseButton} />
            </Header>
            <Conditionals>
                <DropDownConditional>
                    <ConditionalHeading>Select Function</ConditionalHeading>
                    <CustomSelect onChange={(event) => { this.handleSelectOption(event) }} value={select}>
                        <option value={"none"}>None</option>
                        <option value={"sum"}>Sum</option>
                        <option value={"medium"}>Medium</option>
                        <option value={"average"}>Average</option>
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
export default connect(mapStateToProps, mapDispatchToProps)(AddFunction);
