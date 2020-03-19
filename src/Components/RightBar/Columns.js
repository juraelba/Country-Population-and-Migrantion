import React, { Component } from 'react';
import styled from 'styled-components';
import { IoMdInformationCircleOutline } from "react-icons/io";
import ReactTooltip from 'react-tooltip';
import DataFrame from "dataframe-js";

import { checkConditional, getConfigurationValue } from '../../Constants/ConditionalOptions.js';
// background-color : ${props => props.isValid ? props.cell_color : "white"};
const SimpleCell = styled.span`
	padding: 20px;

  width: 100%;
  height : ${props => props.style.height ? props.style.height : "auto"};

  display: flex;
  flex-direction: column;
  font-size: ${props => props.style.fontSize ? props.style.fontSize : "14.4px"};
  justify-content: center;
  z-index: ${props => props.style.zIndex ? props.style.zIndex : "auto"};
`;

const Container = styled.div`
  color: white;
  height: 100%;
  min-height: 50px;
`;

const ToolTipContainer =styled.div`
  position: absolute;
  top: 50px;
  color: black;
  // background-color: whitesmoke;
  width: 200px;
  padding: 10px;
  z-index: 1;
  border-radius: 4px;
`;

class CustomHeader extends Component{

	constructor(props) {
    super(props);

    this.handleToolTipClick = this.handleToolTipClick.bind(this);
    this.state = {
      show : false
    }
  }

  handleToolTipClick = (event) => {
    const show = this.state.show;

    this.setState({
      show : !show
    });

    event.stopPropagation();
  }

	render(){
    // available props { tableData, name, description }
    const { name, description } = this.props;
    const { show } = this.state;
    return (
      <Container>
        <div style={{"cursor" : "pointer"}}>
          {
            description ? <IoMdInformationCircleOutline onClick={this.handleToolTipClick} style={{"fontSize":"14.4px", "float": "right", "marginRight": "15px"}} /> : null
          }
        </div>
        <div style={{"height": "100%", "display": "flex", "alignItems": "center", "justifyContent": "center"}}>
        {
          name
        }
        </div>
        { 
          show ? ( <ToolTipContainer data-tip='tooltip'>{ description }</ToolTipContainer> ) : null
        }
        <ReactTooltip />
      </Container>
    )
	}
}

class CustomCell extends Component{

	render(){
    const { table_controls, test_value } = this.props;
    const { conditional_format, configurations_widget } = table_controls;
    const { cell_color, conditional_option, conditional_value_a, conditional_value_b } = conditional_format;
    const is_conditionally_valid = checkConditional(conditional_option, test_value, conditional_value_a, conditional_value_b);
    
    const value = getConfigurationValue(configurations_widget, test_value);

    return (
      <SimpleCell style={this.props.style} cell_color={cell_color} isValid={is_conditionally_valid}>{value}</SimpleCell>
    )
	}
}

const sortedColumns = (dataColumns, rows) => {
  const columns = dataColumns.map((dataPoint, index) => {
    return {
      id: dataPoint,
      index: index,
      key: `${index}-a`,
      name: dataPoint
    }
  })

  const uniqueIDS = new Set();
  const totalDimensions = rows.concat(columns);

  const modifiedDimension = totalDimensions.filter((dataPoint) =>{
    const id = dataPoint.id;
    if (uniqueIDS.has(id)){
      return false
    }
    else{
      uniqueIDS.add(id);
      return true
    }
  })
  return modifiedDimension
}

const getAggregationsForView = (currentData, rows, total_filter_ids) => {
  let df = new DataFrame(currentData).head(20);
  const accAttrs = [];
  const aggregations = rows
    .map(x => x.id)
    .filter(x => !total_filter_ids.includes(x))
    .map(attr => {
      accAttrs.push(attr);
      const x = df.groupBy(...accAttrs).aggregate(group => group.count())
      return [attr, {
        attrs: accAttrs,
        currentValue: undefined,
        df: x
      }]
    })
  return Object.fromEntries(aggregations);
};

const getStyleForCell = (aggregations, column, props, value) => {
  let style = {};
  if (Object.keys(aggregations).includes(column.id)) {
    const vars = aggregations[column.id];
    if (vars["currentValue"] !== value) {
      const filter = Object.fromEntries(
        vars["attrs"]
          .filter(attr => vars["df"].listColumns().includes(attr))
          .map(attr => [
            attr, props["row"][attr]
          ])
      );
      const nRows = vars["df"].find(filter).get("aggregation");
      style = {
        height: `${nRows * 50}px !important`,
        zIndex: "1"
      };
    } else {
      style = {fontSize: "0"};
    }
    vars["currentValue"] = value;
  }
  return style;
}

const getColumns = (columns, rows, currentData, descriptions, table_controls, total_filter_ids) => {
  if (currentData.length > 0){
    const dataColumns = Object.keys(currentData[0]);
    const aggregations = getAggregationsForView(currentData, rows, total_filter_ids);

    return sortedColumns(dataColumns, rows).map((column) => {
      return {
        'Header': (data) => <CustomHeader tableData={data} name={column.name} description={descriptions[column.id]} />,
        'accessor': column['id'],
        'Cell': (props) => { 
          const test_value = props.value;
          const style = getStyleForCell(aggregations, column, props, test_value);
          return <CustomCell style={style} table_controls={table_controls} test_value={test_value} />
        },
        'minWidth': 180
      }
    })
  }
  else{
    return []
  }

}

export default getColumns;
