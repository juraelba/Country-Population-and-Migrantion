import { FaCog, FaDownload, FaShareAlt } from "react-icons/fa";
import React, { Component } from 'react';

import ButtonWithModal from './ButtonWithModal.js';
import AddFunction from './AddFunction.js';
import SelectFunction from './SelectFunction.js';
import ConditionFilter from './ConditionFilter.js';
import ConditionFormat from './ConditionFormat.js';
import ConfigurationWidget from './ConfigurationWidget.js';
import DownloadDataPackage from './DownloadDataPackage.js';
import { SET_SELECTION_VIEW,SET_ADD_FUNCTION, SET_MODAL_VISIBILITY,SET_SELECT_FUNCTION } from '../../Constants/actionTypes';
import ShareModal from './shareModel.js';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IoIosCloseCircle } from "react-icons/io";

const mapDispatchToProps = dispatch => ({
    setSelectionView : (payload) => dispatch({ type : SET_SELECTION_VIEW, payload }),
    setAddFunction : (payload) => dispatch({ type : SET_ADD_FUNCTION, payload }),
    // setSelectFunction : (payload) => dispatch({ type : SET_SELECT_FUNCTION, payload }),
    setModalVisibility : (payload) => dispatch({ type : SET_MODAL_VISIBILITY, payload })
});

const mapStateToProps = (state) => ({
    add_function : state.table_controls.add_function,
    show : state.table_controls.show,
    view_selection: state.table_controls.view_selection,
});

const CustomButton = styled.div`
  height: 20px;
  background: ${props =>
    props.isActive
      ? "linear-gradient(180deg, #FFEF7E 0%, #EDDC6A 100%);"
      : "#F3F3F3"};
  color: ${props => (props.isActive ? "#847109" : "#A39135")};
  font-size: 15px;
  color: #a39135;
  letter-spacing: 0.3px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 500;
  align-items: center;
  display: flex;
  align-items: center;
  justify-content: center;
  :hover,
  :focus {
    outline: none;
  }
  &.svg {
    cursor: pointer;
  }
`;

const Container = styled.div`
    border-radius: 6px;
    padding : 40px 0px 20px 0px;
    margin: 20px 0px 20px 0px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
	justify-content: space-between;
    padding: 0px;
`;

const ButtonGroup = styled.div`
    display: flex;
    border: 0.8px solid #C3B763;
    border-radius: 5px;
    margin: 0px 10px;
    @media only screen and (max-width: 768px) {
		margin-bottom : 10px;
	}
    &:first-child {
        margin-left: 0px;
    }
    &:last-child {
        margin-right: 0px;
    }
    // div:not(:last-child) {
    //   border-right: 0.8px solid #C3B763;
    // }

    > div:first-child {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }

    > div:last-child {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
`;

const DropdownContainer = styled.div`
    display: none;
    position: absolute;
    right:0;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
`;

const Dropdown = styled.div`
    position: relative;
    display: inline-block;
    &:hover{
        & > ${DropdownContainer} {
            display: block;
        }
    }
  }`;

class TableControls extends Component{
    constructor(props) {
        super(props);

        const { select_function } = this.props.add_function;

        this.state = {
            select : select_function       
        };

        this.handleCloseButton = this.handleCloseButton.bind(this);
    }
    handleCloseButton = (event)=>{
        const show = this.props.show === 'add_function';

        this.props.setModalVisibility({
            control_type : "add_function",
            show : !show
        });
        this.props.setAddFunction({ 
            select_function : "none"
        });
    }

    switchSelection = (selection_view_type) => {
        const selection_view_value = this.props.view_selection[selection_view_type];

        this.props.setSelectionView({
            selection_view_type : selection_view_type,
            selection_view_value : !selection_view_value
        });
    }

	render(){
        const { view_selection } = this.props;
        return (
            <Container>
                <ButtonGroup>
                    <CustomButton isActive={view_selection.table} onClick={() => this.switchSelection("table")}>Table</CustomButton>
                    <CustomButton isActive={view_selection.chart} onClick={() => this.switchSelection("chart")}>Charts</CustomButton>
                </ButtonGroup>
                <Container>
                    <ButtonGroup >
                        <ButtonWithModal isActive={true} label={"Select Function"} control_type={"select_function"} >
                            <SelectFunction/>
                        </ButtonWithModal>
                    </ButtonGroup>
                    {/* <ButtonGroup >
                        <ButtonWithModal isActive={true} label={"Add Function"} control_type={"add_function"} >
                            <AddFunction/>
                        </ButtonWithModal>
                    </ButtonGroup> */}
                    <ButtonGroup>
                        <ButtonWithModal isActive={true} label={"Condition Filters"} control_type={"conditional_filter"}>
                            <ConditionFilter/>
                        </ButtonWithModal>
                    </ButtonGroup>
                    <ButtonGroup>
                        <ButtonWithModal isActive={true} label={"Condition Format"} control_type={"conditional_format"}>
                            <ConditionFormat/>
                        </ButtonWithModal>
                    </ButtonGroup>
                    <ButtonGroup>
                        <CustomButton isActive={true}>S</CustomButton>
                        <CustomButton isActive={true}>R</CustomButton>
                        <CustomButton isActive={true}>I</CustomButton>
                    </ButtonGroup>
                    <ButtonGroup>
                        <CustomButton isActive={true}><img src={"/bookmark.svg"} alt="bookmark"/></CustomButton>
                        <ButtonWithModal isActive={true} icon= {<FaShareAlt />} control_type={"share_modal"}>
                            <ShareModal/>
                        </ButtonWithModal>
                        <Dropdown isActive={true}>
                            <CustomButton isActive={true}><FaDownload /></CustomButton>
                            <DropdownContainer>
                                <DownloadDataPackage format="csv" />
                                <DownloadDataPackage format="json" />
                            </DropdownContainer>
                        </Dropdown>
                        <ButtonWithModal isActive={true} icon={<FaCog />} control_type={"configurations_widget"}>
                            <ConfigurationWidget />
                        </ButtonWithModal>
                    </ButtonGroup>
                </Container>
            </Container>
        )
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(TableControls);
