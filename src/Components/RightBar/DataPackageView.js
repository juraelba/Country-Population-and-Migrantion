import React, { Component } from "react";
import { Vega } from "react-vega";
import styled from 'styled-components';
import { connect } from "react-redux";

const ChartContainer = styled.div`
  display : ${props => props.isActive ? 'unset' : 'none'};
`;

const mapStateToProps = state => ({
  selections: state.selections,
  view_selection: state.table_controls.view_selection,
  datapackage : state.datapackage
});

class DataPackageView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: "line-chart"
    };
  }

  views = () => {
    return (this.props.datapackage && this.props.datapackage["views"]) || [];
  }

  specByType(type) {
    const views = this.views();
    if (views.length) {
      return views.filter(view => view["name"] === type)[0]["spec"];
    }
  }

  handleChange = event => {
    this.setState({
      type: event.target.value
    });
  };

  render() {
    const { view_selection, selections } = this.props;
    const hasNoSelections = selections.datasets.selected_ids.length === 0;
    const spec = this.specByType(this.state.type);

    if (hasNoSelections || !spec) {
      return null;
    }

    return (
      <ChartContainer isActive={view_selection.chart}>
        <form>
          <label>
            Graph type:
            <select value={this.state.type} onChange={this.handleChange}>
              {this.views().map((view, index) => {
                return (
                  <option value={view["name"]} key={index}>
                    {view["title"]}
                  </option>
                );
              })}
            </select>
          </label>
        </form>
        <Vega spec={spec} />
      </ChartContainer>
    );
  }
}

export default connect(mapStateToProps)(DataPackageView);
