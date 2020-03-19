import React, { Component } from 'react';
import { getAgencies, getCategories, getDataflows } from '../../API';

import DataProvider from './DataProvider.js';
import DataSets from './DataSets.js';
import { SET_SELECTIONS } from '../../Constants/actionTypes.js';
import StatisticalDomains from './StatisticalDomains.js';
import { connect } from 'react-redux';
import styled from 'styled-components';

const mapStateToProps = state => ({
  selections : state.selections,
  utils : state.utils
});


const Container = styled.div`
  width : 25%;
  align-items: center;
  justify-content: center;
  text-align: left;
  @media only screen and (max-width: 768px) {
    width : 100%;
    margin-top: 20px;
  }
`;
const LeftContainer = styled.div`
  padding: 0 20px;
`;

const mapDispatchToProps = dispatch => ({
  setSelections : (payload) => dispatch({ type : SET_SELECTIONS, payload }),
});


class LeftBar extends Component{

  constructor(props) {
    super(props);

    this.state = {
      dataProviders: null
    };
  }

  componentDidUpdate(prevProps, prevState){
    if (this.props.utils.imjs.is_init !== prevProps.utils.imjs.is_init){
      this.fetchData();
    }
  }

  fetchData = async () => {
    const { agencies } = await getAgencies();
    const { categories } = await getCategories();
    const { dataflows } = await getDataflows();

    this.setState({
      dataProviders: agencies,
      datasets: dataflows,
      statisticalDomains: categories
    });
    this.props.setSelections({
      data_providers: agencies,
      statistical_domains: categories,
      datasets: dataflows
    });
  }

	render() {
    return (
      <Container>
        <LeftContainer>

          <DataProvider heading={"Data Providers"} selectionType={"data_providers"} />
          <StatisticalDomains heading={"Statistical Domains"} selectionType={"statistical_domains"} />
          <DataSets heading={"Datasets"} selectionType={"datasets"} />
        </LeftContainer>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftBar);
