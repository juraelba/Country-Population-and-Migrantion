import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Checkbox from './CheckBox.js';
import { IoIosCloseCircle } from "react-icons/io";
import { SET_SELECT_FUNCTION, SET_MODAL_VISIBILITY } from '../../Constants/actionTypes';

const mapStateToProps = state => ({
    check_function : state.table_controls.check_function,
    show : state.table_controls.show
});

const mapDispatchToProps = dispatch => ({
    setSelectFunction : (payload) => dispatch({ type : SET_SELECT_FUNCTION, payload }),
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
const Selects = styled.div`
     display: flex;
`;
const Divide = styled.div`
    text-align: left;
    padding: 10px 20px;
    cursor: pointer;
    border-style: solid;
    border-color: lightgrey;
`;
const row_checkboxes = [
    {
      name: 'row_sum',
      key: 'Sum',
      label: 'row_sum',
    },
    {
      name: 'row_average',
      key: 'Average',
      label: 'row_average',
    },
    {
      name: 'row_medium',
      key: 'Medium',
      label: 'row_medium',
    },
  ];
  const column_checkboxes = [
    {
      name: 'column_sum',
      key: 'Sum',
      label: 'column_sum',
    },
    {
      name: 'column_average',
      key: 'Average',
      label: 'column_average',
    },
    {
      name: 'column_medium',
      key: 'Medium',
      label: 'column_medium',
    },
  ];

class SelectFunction extends Component {
    constructor(props) {
      super(props);
        const { checked_function,all_items} = this.props.check_function;
      this.state = {
        checkedItems: all_items,
      }
  
        this.handleChange = this.handleChange.bind(this);
        this.handleCloseButton = this.handleCloseButton.bind(this);
        this.handleApplyButton = this.handleApplyButton.bind(this);
    }
    
  
    handleChange(e) {
        const item = e.target.name;
        const isChecked = e.target.checked;
        this.state.checkedItems[item] = isChecked;
        this.setState({
            checkedItems: this.state.checkedItems,
        });
        e.stopPropagation();
    }
    
    handleApplyButton = () => {
        // get checked functions array
        let checkedFunction = [];
        Object.keys(this.state.checkedItems).forEach(key => {
            if (this.state.checkedItems[key]){
                checkedFunction.push(key);
            };
        });
        if (checkedFunction.length === 0){
            alert("Select atleast one Function");
        }else{
            this.props.setSelectFunction({
                checked_function : checkedFunction,
                all_items : this.state.checkedItems
            });
            const show = this.props.show === 'select_function';
            this.props.setModalVisibility({
                control_type : "check_function",
                show : !show
            });
        }
    }

    handleCloseButton = (event)=>{
        const show = this.props.show === 'select_function';

        this.props.setModalVisibility({
            control_type : "check_function",
            show : !show
        });
       
    }
  
    render() {
      return (
        <Container>
            <Header>
                <Heading>
                    Function Select
                </Heading>
                <IoIosCloseCircle style={{"cursor" : "pointer", "fontSize" : "18px", "color":"#BEA281","marginRight": "-10px"}} onClick={this.handleCloseButton} />
            </Header>
            <Selects>
                <Divide>Row
                    <React.Fragment>
                    {
                        row_checkboxes.map(item => (
                            <div>
                                <label key={item.key}>
                                    <Checkbox name={item.name} checked={this.state.checkedItems[item.name]} onChange={this.handleChange} />
                                    {item.key}
                                </label>
                            </div>
                        ))
                    }
                    </React.Fragment>
                </Divide>
                <Divide>Column
                    <React.Fragment>
                        {
                            column_checkboxes.map(item => (
                                <div>
                                <label key={item.key}>
                                    <Checkbox name={item.name} checked={this.state.checkedItems[item.name]} onChange={this.handleChange} />
                                    {item.key}
                                </label>
                                </div>
                            ))
                        }
                    </React.Fragment>
                </Divide>
            </Selects>
            <ButtonContainer>
                <ApplyButton onClick={this.handleApplyButton}>
                    Apply
                </ApplyButton>
            </ButtonContainer>
        </Container>
        );
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(SelectFunction);