import React, { Component } from 'react';
import { DropTarget, DragSource } from 'react-dnd';
import styled from 'styled-components';
import { connect } from 'react-redux';

import FilterEditor from './FilterEditor';

const Container = styled.div`
  position: relative;
  white-space: nowrap;
  border-radius : 5px;
  background-color: #6C9DEE;
  padding: 5px 10px 5px 10px;
  margin: 2px 6px;
`;

const CustomLabel = styled.label`
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size : 14.4px;
  font-weight:bold;
  line-height: 17px;
  letter-spacing: 0.3px;
  opacity : ${props => props.isDragging ? '0' : '1'};
`;

const mapStateToProps = state => ({
  filters : state.selections.filters,
  dimension_values : state.selections.dimensions.values
});

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

const collectTarget = (connect) => ({
  connectDropTarget: connect.dropTarget(),
});



const elementSource = {
  beginDrag (props, monitor, component) {
    const { dataset_id, id, index, name, custom_key, dimension_type_source } = props;
    return { type: "tag", dataset_id, id, index, name, custom_key, dimension_type_source }
  }
}

const elementTarget = {
  hover(props, monitor, component) {
    // props present = { dataset_id, id, index, custom_key, name, text, moveTag, dimension_type_source }
    const { index, moveTag } = props;
    const item = monitor.getItem();

    const ref = component.customRef;

    if (!ref) {
      return
    }

    const dragIndex = item.index
    const hoverIndex = index
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return
    }

    // Determine rectangle on screen
    const hoverBoundingRect = ref.getBoundingClientRect();
  
    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    // Determine mouse position
    const clientOffset = monitor.getClientOffset()

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%
    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return
    }

    // Time to actually perform the action
    moveTag(dragIndex, hoverIndex, item.dimension_type_source, item)
    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.

    item.index = hoverIndex
  }
}

class Tag extends Component{
	constructor(props) {
    super(props);

    this.customRef = React.createRef();
    this.handleTagClick = this.handleTagClick.bind(this);
    this.findTagName = this.findTagName.bind(this);

    this.state = {
      showFilter : false
    };
  }

  handleTagClick = (event) =>{
    const { showFilter } = this.state;

    this.setState({
      showFilter : !showFilter
    })
  }

  handleCloseEditor = () => {
    this.setState({
      showFilter : false
    })
  }

  findTagName = (text, dataset_id, id) => {
    const { filters, dimension_values } = this.props;
    let tagName = text;

    if (dimension_values.hasOwnProperty(dataset_id)){
      const currentDimensionValues = dimension_values[dataset_id][id]["values"];
      const currentFilters = filters[dataset_id][id];
      const currentFilterValues = currentFilters.map((data_point) => {
        return data_point.name
      })

      if (currentDimensionValues.length !== currentFilters.length){
        const trimmedFilterValues = currentFilterValues.slice(0,2).join(", ");

        let more;
        if (currentFilterValues.length > 2){
          more = ", ...";
          tagName = `${tagName} (${trimmedFilterValues}${more})`;
        }
        else{
          tagName = `${tagName} (${trimmedFilterValues})`;
        }
      }
    }

    return tagName
  }

  render(){
    // props present { dataset_id, id, index, custom_key, name, text, moveTag, dimension_type_source, isOver }
    const { dataset_id, id, name, text } = this.props;
    const { connectDragSource, isDragging, connectDropTarget } = this.props

    const { showFilter } = this.state;

    const tagText = this.findTagName(text, dataset_id, id);

    return (
      <Container 
        ref={(instance) => { 
          this.customRef = instance; 
          connectDragSource(instance); 
          connectDropTarget(instance); 
        }}
        
      >
        <CustomLabel onClick={this.handleTagClick} isDragging={isDragging}>
        { tagText }
        </CustomLabel>
        {
          showFilter ? <FilterEditor name={name} dataset_id={dataset_id} id={id} handleCloseEditor={this.handleCloseEditor}/> : null
        }
      </Container>
    )
  }
}

export default connect(mapStateToProps, null)(DropTarget('tag', elementTarget, collectTarget)(DragSource('tag', elementSource, collectSource)(Tag)))