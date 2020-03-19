import 'react-table/react-table.css';

import React, { Component } from 'react';
import { dataframeFromDataflow, transformDataframe } from '../../API';

import ClipLoader from 'react-spinners/ClipLoader';
import { DataFrame } from 'dataframe-js';
import { Object, _ } from 'core-js';
import ReactTable from 'react-table';
import { UPDATE_DATA_PACKAGE,SET_ADD_FUNCTION } from '../../Constants/actionTypes.js';
import { checkConditional } from '../../Constants/ConditionalOptions.js';
import { connect } from 'react-redux';
import getColumns from './Columns.js';
import styled from 'styled-components';
import { compositeMarkContinuousAxis } from 'vega-lite/build/src/compositemark/common';
import { isConcatSpec } from 'vega-lite/build/src/spec/concat';
import { number, string } from 'prop-types';

const mapStateToProps = state => ({
    selections : state.selections,
    dataflow : state.dataflow,
    table_controls : state.table_controls,
    view_selection: state.table_controls.view_selection
});

const mapDispatchToProps = dispatch => ({
    updateDataPackage : (payload) => dispatch({ type : UPDATE_DATA_PACKAGE, payload }),
});

const findTags = (dimension, selections) => {
    let tags = selections.dimensions[dimension];
    if (dimension !== "filters") {
        const filters = selections.dimensions.filters.map(x => x.id);
        tags = tags.filter(x => !filters.includes(x.id))
    }
    return tags;
}

const TableContainer = styled.div`
    margin: 10px 0px;
    padding: 10px 0px;
	background: white;
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.0432965);
    display:${props => props.isActive ? 'unset' : 'none'};
    width: 100%;
`;

const aggregateFilters = (filters) => {
    return Object.values(filters).flatMap((x) =>
        Object.entries(x).map(([k, vs]) =>
            [k, vs.map((v) => v['name'])]
        )
    ).reduce((acc, [k, vs]) => {
        const values = new Set(vs);
        if (k in acc) {
            acc[k] = new Set([...acc[k], ...values]);
        } else {
            acc[k] = values;
        }
        return acc;
    }, {});
};

class Table extends Component{

	constructor(props) {
        super(props);
		this.state = {
			isLoading : true,
            data : [],
            columns : [],
            index : 0,
            key: "",
            function: ""
        };
        this.functionArr = ["Sum", "Average","Medium", "Median", "Maximum", "Minimum", "Number of non-empty", "Number of empty", "RMS", "Variance", "Sum of squares", "Decile", "Quartile", "Variation coefficient", "Kurtosis", "Skewness"];
        this.datasetLen = 0;
    }

    findUniqueColumns = (data, total_filter_ids) => {
        const { selections, table_controls } = this.props;
        const { rows, columns }  = selections.dimensions;
        const descriptions = this.findColumnDescriptions();
        return getColumns(columns, rows, data, descriptions, table_controls, total_filter_ids);
    }

    findColumnDescriptions = () => {
        const descriptions = {};
        const { rows, columns } = this.props.selections.dimensions;
        const dimensions = rows.concat(columns);
        dimensions.forEach((dimension) => {
            const { dataset_id, description, id } = dimension;
            if (!descriptions.hasOwnProperty(dataset_id)){
                descriptions[dataset_id] = {};
            }
            descriptions[id] = description;
        });

        return descriptions;
    }

    applyConditionalFilter = (table_controls, dataset) => {
        const { conditional_filter } = table_controls;
        const { hide_conditionals, conditional_option, conditional_value_a, conditional_value_b } = conditional_filter;
        const { hide_zeroes, hide_empty_fields, hide_non_numerics } = hide_conditionals;

        const filtered_dataset = dataset.filter((each_dataset) => {
            const test_dataset_values = Object.values(each_dataset);
            let overall_filter_condition;

            // Check hide_zeroes conditional if its true
            if (hide_zeroes){
                const hide_zeroes_conditional = test_dataset_values.some((data_point) => {
                    return data_point === "0"
                });

                overall_filter_condition = overall_filter_condition || hide_zeroes_conditional;
            }

            // Check hide_empty_fields conditional if its true
            if (hide_empty_fields){
                const hide_empty_fields_conditional = test_dataset_values.some((data_point) => {
                    return ( data_point === undefined || data_point === data_point.length )
                });

                overall_filter_condition = overall_filter_condition || hide_empty_fields_conditional;
            }

            // Check hide_non_numerics conditional if its true.
            if (hide_non_numerics){
                const hide_non_numerics_conditional = test_dataset_values.some((data_point) => {
                    return isNaN(parseInt(data_point))
                });

                overall_filter_condition = overall_filter_condition || hide_non_numerics_conditional;
            }

            // Check if there is any conditional option filter being applied.
            const check_option_conditional = test_dataset_values.some((data_point) => {
                return checkConditional(conditional_option, data_point, conditional_value_a, conditional_value_b)
            });

            overall_filter_condition = overall_filter_condition || check_option_conditional;

            return !overall_filter_condition
        });
        return filtered_dataset
    }

    // sumFunction = (value,index) => {
    //     var x1 = value[2010];
    //     return x1;
    // }

	componentDidUpdate(prevProps, prevState){
        
        const didSelectionsChange = JSON.stringify(this.props.selections) !== JSON.stringify(prevProps.selections);
        const didTableControlsChange = JSON.stringify(this.props.table_controls) !== JSON.stringify(prevProps.table_controls);

        if (didSelectionsChange || didTableControlsChange) {
            const { rows, columns, filters, values } = this.props.selections.dimensions;
            const filter_ids = [...new Set(filters.map((obj) => obj['id']))];
            const row_ids = [...new Set(rows.map((obj) => obj['id']))];
            const column_ids = [...new Set(columns.map((obj) => obj['id']))];
            const filter_column_intersections = columns.filter((column)=>{
                const column_id = column.id;
                if (filter_ids.includes(column_id)){
                    return true
                }
                else{
                    return false
                }
            });
            const cols = [...row_ids, ...column_ids, 'OBS_VALUE']
            let dataframe = new DataFrame([], cols);
            Object.values(this.props.dataflow).forEach((value) => {
                let df = dataframeFromDataflow(value['dataflow']);
                df = df.restructure(cols);
                if (dataframe.count()) {
                    dataframe = dataframe.union(df);
                } else {
                    dataframe = df;
                }
            });

            const filtered_values = aggregateFilters(this.props.selections.filters);
            const selectedRows = findTags("rows", this.props.selections).map(x => x.id);
            const selectedColumns = findTags("columns", this.props.selections).map(x => x.id);
            dataframe = transformDataframe(dataframe, selectedRows, selectedColumns, filtered_values);
            var dataset = dataframe.toCollection();
            var defDataset = dataset;
            
            var col_length = defDataset.length;
            this.setState({index: col_length});
        // Add the selected functions into the table
            const check_data = this.props.table_controls.check_function.checked_function;
            check_data.forEach((item) => {
                if (item === "column_sum"){
                    const newData = {};
                    Object.keys(dataset[0]).forEach(key => {
                        var sum_key = 0;
                        defDataset.map((value,index) =>{
                            if (typeof(value[key]) === "number"){
                                sum_key += value[key];
                            }else{
                                sum_key = "Sum";
                            }
                        });
                        newData[key] = sum_key;
                    });
                    dataset = [...dataset, newData];
                };
                
                if (item === "column_average"){
                    const newData = {};
                    Object.keys(dataset[0]).forEach(key => {
                        var sum_row = 0;
                        var count = 0;
                        var average = 0;
                        defDataset.map((value,index) =>{
                            if (typeof(value[key]) === "number"){
                                sum_row += value[key];
                                count++;
                            }else{
                                 sum_row= "Average";
                            }
                        });
                        if (typeof(sum_row) === 'number'){
                            average = Math.floor(sum_row / count);
                            newData[key] = average;
                        }else{
                            newData[key] = sum_row;
                        }
                    });
                    dataset = [...dataset, newData];
                };
                if (item === "column_medium"){
                    const newData = {};
                    Object.keys(dataset[0]).forEach(key => {
                        var max_line = 0;
                        var min_line = dataset[0][key];
                        var medium_line = 0;
                        defDataset.map((value,index) =>{
                            if (typeof(value[key]) === "number"){
                                if(max_line < value[key]){
                                    max_line = value[key];
                                }
                                if(min_line > value[key]){
                                    min_line = value[key];
                                }
                            }else{
                                 max_line= "Medium";
                            }
                        });
                        if (typeof(max_line) === 'number'){
                            medium_line = (max_line + min_line) / 2;
                            newData[key] = medium_line;
                        }else{
                            newData[key] = max_line;
                        }
                    });
                    dataset = [...dataset, newData];
                }
            });
            check_data.forEach((item) => {
                if (item === "row_sum"){
                    defDataset.map(value => {
                        var add_sum = 0;
                        var data = Object.values(value);
                        var index = 0;
                        var length = 0;
                            data.forEach(value => {
                                if(typeof(value) === "number"){
                                    index ++;
                                }else{
                                    length = index;
                                }; 
                            });
                            for(var i = 0;i < length;i++){
                                if (typeof(data[i]) === "number"){
                                    add_sum += data[i]; 
                                }
                            }
                            value.Sum = add_sum;
                    });
                };

                if (item === "row_medium"){
                    defDataset.map((value,index) =>{
                        var max_row = 0;
                        var min_row = 0;
                        var medium_row = 0;
                        var data = Object.values(value);   
                        for(var i = 0 ; i < data.length ; i++){
                            if (!Number.isInteger(data[i])){
                                data.splice(i,5); 
                            }
                        }
                        max_row = Math.max.apply(Math,data); 
                        min_row = Math.min.apply(Math,data);
                        medium_row = (max_row + min_row) / 2;
                        value.Medium = medium_row;
                    });
                };
                if(item === "row_average"){
                    defDataset.map((value,index) =>{
                        var row_average = 0;
                        var all_sum = 0;
                        var count = 0;
                        var data = Object.values(value);
                        var index = 0;
                        var length = 0;
                            data.forEach(value => {
                                if(typeof(value) === "number"){
                                    index ++;
                                }else{
                                    length = index;
                                }; 
                            });
                            for(var i = 0;i < length;i++){
                                if (typeof(data[i]) === "number"){
                                    count++;
                                    all_sum += data[i]; 
                                }
                            }
                            row_average = all_sum / count;
                            value.Average = row_average;
                    });
                };
            });
            

        // Add "Sum" low and line into the dataset

            if(this.props.table_controls.add_function.select_function == "sum"){
                // add the sum row
                var add_sum = 0;
                dataset.map((value,index) => {
                    var data = Object.values(value);
                        for(var i = 0;i <= data.length-1;i++){
                            if (typeof(data[i]) === "number"){
                                add_sum += data[i]; 
                            }
                        }
                        value.Sum = add_sum;
                });
                // add the sum line
                const newData = {};
                Object.keys(dataset[0]).forEach(key => {
                    var sum_key = 0;
                    dataset.map((value,index) =>{
                        if (typeof(value[key]) === "number"){
                            sum_key += value[key];
                        }else{
                            sum_key = "Sum";
                            this.setState({
                                key: key,
                                function: sum_key
                            });
                        }
                    });
                    newData[key] = sum_key;
                });
                dataset = [...dataset, newData];
            }
        
        // Add "Average" row and line into dataset
            
        if(this.props.table_controls.add_function.select_function == "average"){
            // add the average row
            dataset.map((value,index) =>{
                var row_average = 0;
                var all_sum = 0;
                var count = 0;
                var data = Object.values(value);
                    for(var i = 0;i <= data.length-1;i++){
                        if (typeof(data[i]) === "number"){
                            count++;
                            all_sum += data[i]; 
                        }
                    }
                    row_average = all_sum / count;
                    value.Average = row_average;
            });
            // add the average line
            const newData = {};
            Object.keys(dataset[0]).forEach(key => {
                var sum_row = 0;
                var count = 0;
                var average = 0;
                dataset.map((value,index) =>{
                    if (typeof(value[key]) === "number"){
                        sum_row += value[key];
                        count++;
                    }else{
                         sum_row= "Average";
                         this.setState({
                            key: key,
                            function: sum_row
                        });
                    }
                });
                if (typeof(sum_row) === 'number'){
                    average = Math.floor(sum_row / count);
                    newData[key] = average;
                }else{
                    newData[key] = sum_row;
                }
            });
            dataset = [...dataset, newData];
        }

    // Add the "Medium" row and line into the dataset

        if(this.props.table_controls.add_function.select_function === "medium"){
            //add the medium row
            dataset.map((value,index) =>{
                var max_row = 0;
                var min_row = 0;
                var medium_row = 0;
                var data = Object.values(value);    
                for(var i = 0;i < data.length;i++){
                    if (!Number.isInteger(data[i])){
                        data.splice(i,1); 
                    }
                }
                max_row = Math.max.apply(Math,data); 
                min_row = Math.min.apply(Math,data);
                medium_row = (max_row + min_row) / 2;
                value.Medium = medium_row;
            });
            // add the medium line
            const newData = {};
            Object.keys(dataset[0]).forEach(key => {
                var max_line = 0;
                var min_line = dataset[0][key];
                var medium_line = 0;
                dataset.map((value,index) =>{
                    if (typeof(value[key]) === "number"){
                        if(max_line < value[key]){
                            max_line = value[key];
                        }
                        if(min_line > value[key]){
                            min_line = value[key];
                        }
                    }else{
                         max_line= "Medium";
                         this.setState({
                            key: key,
                            function: max_line
                        });
                    }
                });
                if (typeof(max_line) === 'number'){
                    medium_line = (max_line + min_line) / 2;
                    newData[key] = medium_line;
                }else{
                    newData[key] = max_line;
                }
            });
            dataset = [...dataset, newData];
        }
                

            this.props.updateDataPackage({ dataframe, row_ids: selectedRows });

            let column_filter_values = new Set();
            filter_column_intersections.forEach((filter_column_intersection) => {
                const id = filter_column_intersection.id;
                const dataset_id = filter_column_intersection.dataset_id;

                values[dataset_id][id]["values"].forEach((data)=>{
                    column_filter_values.add(data["id"]);
                });
            });
            const total_filter_ids = Array.from(column_filter_values).concat(filter_ids);
            const unique_columns = this.findUniqueColumns(dataset, total_filter_ids).filter((column)=>{
                if (total_filter_ids.includes(column.accessor)){
                    return false
                }
                else{
                    return true
                }
            });
            this.setState({
                data : this.applyConditionalFilter(this.props.table_controls, dataset),
                columns : unique_columns,
                isLoading : false
            });
        }
    }
    
    

	render(){
        const { isLoading, data, columns } = this.state;
        //const { table_controls, view_selection } = this.props;
        const { view_selection } = this.props;
        //const { configurations_widget } = table_controls;
        //const { appearance } = configurations_widget;
        return (
            <TableContainer isActive={view_selection.table}>
                {
                    !isLoading ? (
                        <ReactTable
                            data={data}
                            columns={columns}
                            minRows={0}
                            defaultSortDesc={true}
                            ref={r => (this.selectTable = r)}
                            showPagination={false}
                            // getTheadThProps={() => {
                            //     const header_color = getConfigurationHeaderColor(appearance);
                            //     return { style: { fontSize: "13px", "wordWrap": "break-word", "whiteSpace": "initial", "background" : "red"  } }
                            // }}
                            // getTrProps={(state, rowInfo, column, instance) => {
                            //     console.log("rowInfo",rowInfo,"column",column);
                            //     return {
                            //         style: { 
                            //             backgroundColor : rowInfo && column && rowInfo.row.COUNTRY == "Sum" ? 'grey' :'white'
                            //         }
                            //     }
                            // }}
                            getTheadThProps={(state, rowInfo, column, instance) => {
                                return { 
                                    style: { 
                                        fontSize: "20px", wordWrap: "break-word", whiteSpace: "initial",
                                        background : this.functionArr.includes(column['id']) ?"grey":"" 
                                    } 
                                }
                            }}
                            
                            getTdProps={(state, rowInfo, column, instance) => {
                                let key = this.state.key;
                                return {
                                    style: {
                                        // backgroundColor: rowInfo && column && rowInfo.row[key] !== this.state.function && column['id'] === this.state.function || rowInfo.row[key] == this.state.function ? 'grey' : 'white'
                                        backgroundColor: rowInfo && column && rowInfo.index >= this.state.index || this.functionArr.includes(column['id']) ? 'grey' : 'white'
                                    }
                                }
                            }}
                            
                            

                                //      console.log("column",column);
                                // let row_color;        row, index, cellInfo
                                // console.log(index);

                                // if (index.index <= (this.state.index-1)){
                                //     row_color = 'white';
                                // }
                                // else{
                                //      row_color = 'grey';
                                //     // row_color = getConfigurationRowColor(appearance, index.index);
                                // }

                                // const row_styles = { "padding" : "0px", "height" : "24px", "background" : row_color };
                                // return  { 'style' : row_styles }
                            // }}
                            // getProps={(state, rowInfo, columns, instance) => {
                                
                            //         console.log("columns",columns);
                            //     return {
                            //         style: {
                            //             // background: columns[1].accessor == "2010" ? "green" : "white"
                            //         }
                            //     };
                            // }}
                            
                        />
                    )
                    :
                    <ClipLoader
                        css={false}
                        sizeUnit={"px"}
                        size={100}
                        color={'#123abc'}
                        loading={isLoading}
                    />
                }
            </TableContainer>
        )
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Table);
