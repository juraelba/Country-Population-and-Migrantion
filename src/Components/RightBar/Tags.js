import React, { Component } from 'react'
import Tag from './Tag'
import update from 'immutability-helper';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { SET_DIMENSIONS, SET_MULTIPLE_DIMENSIONS, UPDATE_DIMENSIONS } from '../../Constants/actionTypes.js';
import { DropTarget } from 'react-dnd';

const mapStateToProps = state => ({
    selections : state.selections
});

const mapDispatchToProps = dispatch => ({
    setDimensions : (payload) => dispatch({ type : SET_DIMENSIONS, payload }),
    setMultipleDimensions : (payload) => dispatch({ type : SET_MULTIPLE_DIMENSIONS, payload }),
    updateDimensions : (payload) => dispatch({ type : UPDATE_DIMENSIONS, payload })
});


const Wrapper = styled.div`
    padding: 15px 20px;
    text-align: left;
    display: flex;
    align-items: center;
`;

const CustomLabel = styled.label`
    color: #999573;
    padding-right: 20px;
    min-width: 70px;
    opacity: 0.5;
`;

const Container = styled.div`
    background: #fcfcfa;
    mix-blend-mode: normal;
    border: 0.8px solid rgba(170, 170, 170, 0.418379);
    box-shadow: inset 2px 2px 4px rgba(126, 137, 95, 0.189603);
    border-radius: 6.4px;
    border: 1px solid rgb(204, 204, 204);
    border-radius: 5px;
    min-height: 40px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
`;

const spec = {
    drop(props, monitor, component){
        const item = monitor.getItem();
        const { dataset_id, id, index, custom_key, name, dimension_type_source } = item;
        const dimension_type_droppable = props.dimensionType;
        let dimension_type_draggable = dimension_type_source;

        const tag = {
            dataset_id,
            id,
            index,
            name,
            key : custom_key
        }

        if (dimension_type_source !== dimension_type_droppable){
            if (dimension_type_draggable !== "filters" && dimension_type_droppable !== "filters"){
                props.updateDimensions({ dimension_type : dimension_type_droppable, selections : [tag], operation_type : "add" });
                props.updateDimensions({ dimension_type : dimension_type_draggable, selections : [tag], operation_type : "remove" });
            }

            if (dimension_type_draggable === "filters"){
                // only remove, don't add
                props.updateDimensions({ dimension_type : dimension_type_draggable, selections : [tag], operation_type : "remove" });
            }

            if (dimension_type_droppable === "filters"){
                // don't remove, only add
                props.updateDimensions({ dimension_type : dimension_type_droppable, selections : [tag], operation_type : "add" });
            }
        }
    }
}

function collect(connect, monitor){
    return {
        connectDropTarget: connect.dropTarget(),
        hovered: monitor.isOver(),
        item: monitor.getItem()
    }
}


class Tags extends Component{
	constructor(props) {
        super(props);

        this.renderTag = this.renderTag.bind(this);
        this.moveTag = this.moveTag.bind(this);
        this.findTags = this.findTags.bind(this);

        this.state = {
            dragIndex : null,
            hoverIndex: null
        }
    }

    componentDidMount(){
    }

    findTags = (dragElementSourceType, draggableElement) => {
        const { dimensionType, selections } = this.props;
        const filters = selections.dimensions.filters;
        let modified_filters;

        if (dragElementSourceType === "filters" && dimensionType !== dragElementSourceType){
            const draggableElementID = draggableElement["id"];
            modified_filters = filters.filter((data_point) => {
                if (data_point.id !== draggableElementID){
                    return true
                }
                else{
                    return false
                }
            });
        }
        else{
            modified_filters = filters;
        }
        
        let tags = this.props.selections.dimensions[dimensionType];

        return { tags, modified_filters }
    }

    findDisplayTags = () => {
        const { dimensionType, selections } = this.props;
        const filters = selections.dimensions.filters;
        
        const filter_ids = filters.map((data_point) => { return data_point.id });
        let tags = this.props.selections.dimensions[dimensionType];

        if (dimensionType !== "filters"){
            tags = tags.filter((tag) => {
                if (filter_ids.includes(tag.id)){
                    return false
                }
                return true
            });
        }

        return tags
    }

    componentDidUpdate(prevProps, prevState){
    }

    renderTag = (tag, index) => {
        const dimension_type_source = this.props.dimensionType;
        return (
            <Tag
                dataset_id={tag.dataset_id}
                id={tag.id}
                index={tag.index}
                custom_key={tag.key}
                name={tag.name}
                text={tag.name}
                moveTag={this.moveTag}
                key={index}
                dimension_type_source={dimension_type_source}
            />
        )
    }

    moveTag = (dragIndex, hoverIndex, dragElementSourceType, draggableElement) => {
        const dimension_type = this.props.dimensionType;
        let selections_map = {};
        const { tags, modified_filters } = this.findTags(dragElementSourceType, draggableElement);
        const dragTag = tags[dragIndex];

        const modifiedTags = update(tags, {
            $splice: [[dragIndex, 1], [hoverIndex, 0, dragTag]],
        });

        this.setState({
            dragIndex,
            hoverIndex
        });

        if (dragElementSourceType === "filters" && dimension_type !== dragElementSourceType){
            selections_map["filters"] = modified_filters;
        }

        selections_map[dimension_type] = modifiedTags;

        this.props.setMultipleDimensions({ selections_map : selections_map });
    }

	render(){
        // connectDropTarget, hovered and item also present in props
        const { label, isDisabled, connectDropTarget } = this.props;
        const tags = this.findDisplayTags();
        return (
            <Wrapper>
                <CustomLabel>{label}</CustomLabel>
                <Container isDisabled={isDisabled} ref={(instance) => { connectDropTarget(instance)} }>
                    { isDisabled ? null : (
                            tags.map((tag, index) => this.renderTag(tag, index))
                        )
                    }
                </Container>
            </Wrapper>
        )
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(DropTarget('tag', spec, collect)(Tags));