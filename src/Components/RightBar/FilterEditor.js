import React, { Component } from 'react';
import styled from 'styled-components';
import { FaBars, FaSearch, FaMinusSquare } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import Fuse from 'fuse.js';
import { connect } from 'react-redux';

import { SET_FILTERS } from '../../Constants/actionTypes.js';

const mapStateToProps = state => ({
    dimension_values : state.selections.dimensions.values,
    filters : state.selections.filters
});

const mapDispatchToProps = dispatch => ({
    setFilters : (payload) => dispatch({ type : SET_FILTERS, payload })
});

const Container = styled.div`
    border: 0.85px solid rgba(142, 142, 140, 0.335309);;
    position: absolute;
    top: 40px;
    color: black;
    z-index: 5;
    background: linear-gradient(180deg, #FFFFFF 0%, #FBFBFB 100%);
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.02);
    width: 320px;
    border-radius: 6px;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;    
    border: 1px solid whitesmoke;
    padding 15px 20px;
`;

const DimensionContainer = styled.div`
    padding 15px 20px;
`;

const Heading = styled.div`
    font-weight: 600;
    color: #959595;
    font-size : 16px;
`;

const DisplayType = styled.div`
    margin: 8px 0px;
`;

const CustomLabel = styled.label`
    font-size: 14px;
    font-weight: 600;
    padding-right: 10px;
    color: #959595;
`;

const CustomSelect = styled.select`
    width: 80%;
    padding: 4px;
    font-size: 14px;
    cursor: pointer;
    font-weight: 600;
    height: 35px;
    color: #7D7D7D;
    :hover{
        outline: none;
    }
`;

const CustomInputContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const CustomInput = styled.input`
    width: 85%;
    height: 25px;
    font-size: 14px;
    margin: 6px 0px;
    border: none;
    color: #616161;
    padding: 5px 8px 5px 35px;
    background: #FFFFFF;
    border: 1px solid #DEDEDE;
    border-radius: 5px;
    margin-right: -16px;

    :focus{
        outline:none;
    }
`;

const SelectionBar = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 4px 8px;
    margin: 10px 0px;
`;

const ButtonArea = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;
`;

const ButtonLabel = styled.div`
    margin-top : 8px;
    font-size: 10px;
    white-space: normal;
    text-align: center;
`;

const Options = styled.div`
    background-color: white;
    font-size: 14px;
    height: 200px;
    overflow: scroll;
    background: #FFFFFF;
    border: 1px solid #DEDEDE;
    border-radius: 5px;
    padding: 10px 10px;
`;

const Option = styled.div`
    font-size : 14px;
    padding: 4px 8px;
    margin : 1px 0px;
    cursor: pointer;
    font-weight: 500;
    background-color : ${props => props.isSelected ? '#4a86e2' : 'none'};
    color : ${props => props.isSelected ? 'white' : '#7D7D7D'};
`;

const FilterButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0px 0px 0px;
`;

const FilterButton = styled.button`
    background-color: #4a86e2;
    color: white;
    font-size: 13px;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    border : none;
`;


const fuseOptions = {
    shouldSort: true,
    threshold: 0.2,
    tokenize: true,
    location: 0,
    distance: 0,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      "name"
    ]
};

class FilterEditor extends Component{
	constructor(props) {
        super(props);

        const { dataset_id, id, dimension_values } = this.props;
        const totalOptions = dimension_values[dataset_id][id]["values"];
        const selectedIDS = this.props.filters[dataset_id][id].map((data_point)=>{
            return data_point.id
        });

        this.state = {
            searchValue : "",
            selectedIDS : selectedIDS,
            searchedResults : totalOptions,
            totalOptions : totalOptions
        };

        this.handleSelection = this.handleSelection.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleCloseButton = this.handleCloseButton.bind(this);
        this.handleApplyButton = this.handleApplyButton.bind(this);
        this.handleSelectButton = this.handleSelectButton.bind(this);
    }

    componentDidUpdate(prevProps, prevState){
    }

    handleSelection = (selected_id) => {
        const selectedIDS = this.state.selectedIDS;
        let modifiedSelectedIDS;

        if (selectedIDS.includes(selected_id)){
            modifiedSelectedIDS = selectedIDS.filter((id)=>{
                if (id !== selected_id){
                    return true
                }
                else{
                    return false
                }
            })
        }
        else{
            modifiedSelectedIDS = selectedIDS.concat([selected_id])
        }

        this.setState({
            selectedIDS : modifiedSelectedIDS
        });
    }

    handleSearch = (event) => {
        let searchedResults;
        const searchValue = event.target.value;
        const totalOptions = this.state.totalOptions;

        if (searchValue.length > 0){
            const fuse = new Fuse(totalOptions, fuseOptions);
            searchedResults = fuse.search(searchValue);
        }
        else{
            searchedResults = totalOptions;
        }

        this.setState({
            searchedResults : searchedResults,
            searchValue: searchValue
        });
    }

    handleCloseButton = () => {
        this.props.handleCloseEditor();
    }

    handleApplyButton = () => {
        const { dataset_id, id } = this.props;
        const { selectedIDS } = this.state;
        const values = this.state.totalOptions.filter((opt) =>
            selectedIDS.includes(opt['id'])
        );

        this.props.setFilters({ "values" : values, "dataset_id" : dataset_id, "id" : id });
        this.props.handleCloseEditor();
    }

    handleSelectButton = (selection_type) => {
        let selected_ids;

        if (selection_type === "select_all"){
            selected_ids = this.state.totalOptions.map((option)=>{
                return option.id
            });
        }
        else if (selection_type === "unselect_all" ){
            selected_ids = [];
        }

        this.setState({
            selectedIDS : selected_ids
        })
    }

    render(){
        const { selectedIDS, searchedResults } = this.state;
        // other props : dataset_id, id, name
        const { name } = this.props;

        return (
        <Container>
            <Header>
                <Heading>Dimension Configuration</Heading>
                <IoIosCloseCircle style={{"cursor" : "pointer", "fontSize" : "18px", "color":"#BEA281"}} onClick={this.handleCloseButton} />
            </Header>
            <DimensionContainer>
                {/* <DisplayType>
                    <CustomLabel>Display </CustomLabel>
                    <CustomSelect>
                        <option>Label</option>
                        <option>Code</option>
                    </CustomSelect>
                </DisplayType> */}
                <CustomInputContainer>
                    <FaSearch style={{"marginRight": "-28px", "color": "#A0A4A9","position": "relative"}}/>
                    <CustomInput placeholder="Search for dimension value" value={this.state.searchValue} onChange={this.handleSearch} />
                </CustomInputContainer>
                <SelectionBar>
                    <ButtonArea>
                        <FaBars style={{ "fontSize": "18px", "cursor" : "pointer","color": "#488DE6"}} onClick={() => { this.handleSelectButton("select_all") } } />
                        <ButtonLabel>Select All</ButtonLabel>
                    </ButtonArea>
                    <ButtonArea>
                        <FaMinusSquare style={{ "fontSize": "18px", "cursor" : "pointer","color": "#488DE6"}} onClick={() => { this.handleSelectButton("unselect_all") } } />
                        <ButtonLabel>Unselect All</ButtonLabel>
                    </ButtonArea>
                </SelectionBar>
                <Options>
                {
                    searchedResults.map((searched_result, index)=>{
                        const searched_result_id = searched_result["id"];
                        const isSelected = selectedIDS.includes(searched_result_id);
                        return <Option isSelected={isSelected} key={index} onClick={ () => { this.handleSelection(searched_result_id) }}>{searched_result["name"]}</Option>
                    })
                }
                </Options>
                <FilterButtonContainer>
                    <FilterButton onClick={this.handleApplyButton}>Apply Filter</FilterButton>
                </FilterButtonContainer>
            </DimensionContainer>
        </Container>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterEditor);
