import React, { Component } from 'react';
import styled from 'styled-components';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { connect } from 'react-redux';
import { getDataflow } from '../../API';

import Tags from './Tags.js';
import { SET_DIMENSIONS  } from '../../Constants/actionTypes.js';
import { UPDATE_DIMENSIONS, SET_DATAFLOW, SET_DIMENSION_VALUES, REMOVE_DATAFLOW, REMOVE_DATAFLOW_SELECTIONS } from '../../Constants/actionTypes.js';


const Container = styled.div`
	border: 1px solid whitesmoke;
	border-radius: 6px;
	margin: 60px 0px 20px 0px;
	padding: 0px 10px;
	background: #FFFFFF;
	box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.0432965);
	@media only screen and (max-width: 768px) {
		margin: 10px 0px 0px 0px
	}
`;

const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1px solid whitesmoke;
	color: #BBBBBB;
`;

const IconContainer = styled.div`
	cursor: pointer;
	margin-right: 30px;
`;

const Heading = styled.div`
	color: #BBBBBB;    
	font-size: 16px;
	font-weight: 500;
	padding: 15px 20px;
	text-align: left;
`;

const mapStateToProps = state => ({
	selections : state.selections
});

const mapDispatchToProps = dispatch => ({
	setDimensions : (payload) => dispatch({ type : SET_DIMENSIONS, payload }),
    updateDimensions : (payload) => dispatch({ type : UPDATE_DIMENSIONS, payload }),
    setDataflow : (payload) => dispatch({ type : SET_DATAFLOW, payload }),
    removeDataflow : (payload) => dispatch({ type : REMOVE_DATAFLOW, payload }),
    removeDataflowSelections : (payload) => dispatch({ type : REMOVE_DATAFLOW_SELECTIONS, payload }),
    setDimensionValues : (payload) => dispatch({ type : SET_DIMENSION_VALUES, payload })
});

class DimensionsTable extends Component{

	constructor(props) {
		super(props);

		this.state = {
			isLoading : false,
			show: true
		};

		this.handleOnClick = this.handleOnClick.bind(this);
		this.handleDataSetChange = this.handleDataSetChange.bind(this);
		this.datasetClicked = this.datasetClicked.bind(this);
    }

    componentDidMount(){
    }

	componentDidUpdate(prevProps, prevState){
		const current_selected_ids = this.props.selections.datasets.selected_ids;
		const previous_selected_ids = prevProps.selections.datasets.selected_ids;
		if (JSON.stringify(current_selected_ids) !== JSON.stringify(previous_selected_ids)){
			let operation;
			let dataset_id ;
			
			if (current_selected_ids.length > previous_selected_ids.length){
				operation = "add";
				current_selected_ids.forEach((current_selected_id)=>{
					if (!previous_selected_ids.includes(current_selected_id)){
						dataset_id = current_selected_id;
					}
				})
			}
			else{
				operation = "remove";
				previous_selected_ids.forEach((previous_selected_id)=>{
					if (!current_selected_ids.includes(previous_selected_id)){
						dataset_id = previous_selected_id;
					}
				})
			}

			this.handleDataSetChange(dataset_id, operation)
		}
	}

	handleDataSetChange = (datasetID, operation) => {
		this.datasetClicked(datasetID, operation);
	}

	datasetClicked = async (datasetID, operation) => {
        if (operation === 'remove') {
            this.props.removeDataflow({ id: datasetID });
            this.props.removeDataflowSelections({ id: datasetID });
            return;
        }

        const newDataflow = await getDataflow('GCC_STAT', datasetID, '1.0');
        let { observation, series, dataset, dataflow } = newDataflow;
        const getDimensionAttrs = (attr, index) => {
            return {
                name: attr['name'],
                id: attr['id'],
                dataset_id: datasetID,
                index: index,
                key: `${index}-${datasetID}`,
                description : attr["description"]
            }
        };
        const rows = series.map(getDimensionAttrs);
        const columns = observation.map(getDimensionAttrs);

        this.props.setDataflow({
            observation,
            series,
            dataset,
            dataflow,
            id: datasetID
		});

        this.props.updateDimensions({
            dimension_type: 'rows',
            selections: rows,
            operation_type: operation,
        });

        this.props.updateDimensions({
            dimension_type: 'filters',
            selections: rows.slice(1,rows.length),
            operation_type: operation,
        });

        this.props.updateDimensions({
            dimension_type: 'columns',
            selections: columns,
            operation_type: operation,
		});
		
        this.props.setDimensionValues({
            series,
            observation,
            id : datasetID
        });
	}

	handleOnClick = () => {
		const show = this.state.show;

		this.setState({
			show : !show
		})
	}

	render(){
        const { isLoading, show } = this.state;

		if (isLoading){
			return null
		}
		else{
			return (
				<Container>
					<Header>
                    	<Heading>Dimensions Table</Heading>
						<IconContainer onClick={this.handleOnClick}>
							{
								show ? <FaChevronUp style={{"fontSize":"16px"}} /> : <FaChevronDown style={{"fontSize":"16px"}} />
							}
						</IconContainer>
					</Header>
					{
						show ? (
							<DndProvider backend={HTML5Backend}>
								<Tags label="Filters" dimensionType={"filters"} isDisabled={false} />
								<Tags label="Rows" dimensionType={"rows"} isDisabled={false} />
								<Tags label="Columns" dimensionType={"columns"} isDisabled={false} />
							</DndProvider>
						)
						:
						null
					}
				</Container>
			)
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(DimensionsTable);
