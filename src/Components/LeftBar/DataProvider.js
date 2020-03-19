import { ADD_SELECTION, REMOVE_SELECTION } from '../../Constants/actionTypes.js';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import React, { Component } from 'react';

import ClipLoader from 'react-spinners/ClipLoader';
import Fuse from 'fuse.js';
import { connect } from 'react-redux';
import styled from 'styled-components';

const fuseOptions = {
    shouldSort: true,
    threshold: 0.2,
    tokenize: true,
    location: 0,
    distance: 0,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      "names.value"
    ]
};

const mapStateToProps = state => ({
    data_providers : state.selections.data_providers,
    utils : state.utils
});

const mapDispatchToProps = dispatch => ({
    addSelections : (payload) => dispatch({ type : ADD_SELECTION, payload }),
    removeSelections : (payload) => dispatch({ type : REMOVE_SELECTION, payload })
});

const Container = styled.div`
    padding: 20px 0px;
    @media only screen and (max-width: 768px) {
        padding: 2px 10px;
        background: #FFFFFF;
        box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.0432965);
        border: 1px solid whitesmoke;
    }
`;

const Row = styled.div`
    @media only screen and (max-width: 768px) {
        display: ${props => props.isShow ? 'unset' : 'none'};
    }
`;

const IconContainer = styled.div`
    display: none;
    @media only screen and (max-width: 768px) {
        cursor: pointer;
        float: right;
        display: unset;
    }
`;

const Heading = styled.div`
    color : #999573;
    opacity: 0.5;
    font-size : 15px;
    text-align: left;
    padding: 10px 0px;
    @media only screen and (max-width: 768px) {
        cursor: pointer;
    }
`;

const OptionsContainer = styled.div`
    height: 200px;
    overflow-y: scroll;
    width: 100%;
    padding: 0px 10px 0px 0px;
`;

const Options = styled.div`
    width: 100%;
    font-size: 14px;

    background: linear-gradient(180deg, #FFFFFF 0%, #FBFBFB 100%);
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(216, 212, 185, 0.506173);
    border-radius: 5px;

    > div:not(:last-child) {
      border-bottom: 1px solid whitesmoke;
    }

    > div:first-child {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }

    > div:last-child {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
`;

const Option = styled.div`
    padding : 10px 5px 10px 15px;
    display: flex;
    justify-content: space-between;
    background-image: ${props => props.isSelected ? "linear-gradient(#E8EEEF, #E8EDE5);" : "white" };
    color: ${props => props.isSelected ? "#7F85A7" : "#A7A7A7" };
    font-size: 16px;
    line-height: 19px;
    letter-spacing: 0.59px;

    :hover {
        background: linear-gradient(#E8EEEF, #E8EDE5);;
    }
`;

const CustomInput = styled.input`
    cursor: pointer;
`;

const SearchBar = styled.input`
    width: 75%;
    padding:10px 5px;
    padding-left: 35px;
    font-size: 14px;
    color: #616161;
    display: inline;

    margin-bottom:10px;

    background: #FFFFFF;
    border: 1px solid #DEDEDE;
    box-shadow: inset 2px 3px 5px rgba(126, 137, 95, 0.0640297);
    border-radius: 5px;

    background-image:url("magnifier.svg");
    background-repeat:no-repeat;
    background-position: 10px 10px;

    :hover, :focus{
        outline: none;
    }
`;

const SortButton = styled.span`
    content: url("filter-down.svg");
    padding-top: 10px;
    display: inline;
    float: right;
`;

class DataProvider extends Component{

    constructor(props) {
        super(props);

        this.state = {
            searchedResults : [],
            searchValue : "",
            isLoading : true,
            show : false,

        }

        this.handleSearch = this.handleSearch.bind(this);
        this.handleOnToggle = this.handleOnToggle.bind(this);

    }

    componentDidUpdate(prevProps) {
        const newOptions = this.getOptions();
        if (JSON.stringify(newOptions) !== JSON.stringify(this.getOptions(prevProps))) {
            this.setState({
                searchedResults: newOptions,
                isLoading: newOptions === null
            });
        }
    }

    getOptions(props = this.props) {
        return Object.values(props.data_providers.options);
    }

    handleOnChange = (selected_id) => {
        const { selectionType, data_providers } = this.props;
        const selection_type = selectionType;
        const hasClickedOnDataset = selection_type === 'datasets' || selection_type === 'data_providers';
        const { selected_ids, options } = data_providers;
        const operation = selected_ids.includes(selected_id) ? 'remove' : 'add';

        if (hasClickedOnDataset) {
            const selection = options[selected_id];

            if (operation === "add"){
                this.props.addSelections({ selection : selection, selection_type : selection_type });
            }
            else{
                this.props.removeSelections({ selection : selection, selection_type : selection_type });
            }
        }
    }

    handleSearch = (event) => {
        let searchedResults;
        const searchValue = event.target.value;
        const options = this.getOptions();

        if (searchValue.length > 0){
            const fuse = new Fuse(options, fuseOptions);
            searchedResults = fuse.search(searchValue);
        }
        else{
            searchedResults = options;
        }

        this.setState({
            searchedResults : searchedResults,
            searchValue: searchValue
        });
    }
    handleOnToggle = () => {
        const show = this.state.show;
        this.setState({
            show : !show
        })
    }

    render(){
        const { heading, data_providers } = this.props;
        const { show, searchValue, searchedResults, isLoading } = this.state;
        const options = this.getOptions();
        const selection_ids = data_providers["selected_ids"];

        return (
            <Container>
                <Heading onClick={this.handleOnToggle}><b>{heading}</b> {options ? `(${options.length})` : ""}
                    <IconContainer onClick={this.handleOnClick}>
                            {
                                show ? <FaChevronUp style={{"fontSize":"16px"}} /> : <FaChevronDown style={{"fontSize":"16px"}} />
                            }
                    </IconContainer>
                </Heading>
                <Row isShow={show}>
                <SearchBar   placeholder={`Search ${heading}`} value={searchValue} onChange={this.handleSearch}/>
                <SortButton />

                {
                    isLoading ?
                        (
                            <ClipLoader
                                css={false}
                                sizeUnit={"px"}
                                size={100}
                                color={'#123abc'}
                                loading={isLoading}
                            />
                        )
                        :
                        (
                        <OptionsContainer className="data-providers">
                            <Options>
                                {
                                    searchedResults.map((searchedResult, index)=>{
                                        const { names , id } = searchedResult;
                                        const isSelected = selection_ids.indexOf(id) > -1;
                                        const name = names[0]["value"];
                                        return (
                                            <Option isSelected={isSelected} key={id}>
                                                <label>{names[0]["value"]}</label>
                                                <CustomInput type="checkbox" value={name} checked={isSelected} onChange={() => { this.handleOnChange(id) }} />
                                            </Option>
                                        )
                                    })
                                }
                            </Options>
                        </OptionsContainer>
                        )
                }
                </Row>
            </Container>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataProvider);
