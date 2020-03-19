import React, { Component } from 'react';
import styled from 'styled-components';
import LeftBar from './LeftBar/index.js';
import RightBar from './RightBar/index.js';
import { connect } from 'react-redux';
import { INIT_IMJS } from '../Constants/actionTypes';

const Container = styled.div`
		display: flex;
		flex-wrap: wrap;
`;

const mapStateToProps = state => ({
	utils : state.utils
});

const mapDispatchToProps = dispatch => ({
	initIMJS : (payload) => dispatch({ type : INIT_IMJS, payload })
});

class Dashboard extends Component{
	componentDidMount(){
		this.props.initIMJS();
	}

	render(){
		return (
			<Container>
                <LeftBar />
                <RightBar />
			</Container>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
