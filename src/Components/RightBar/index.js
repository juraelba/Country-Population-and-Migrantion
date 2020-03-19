import React, { Component } from 'react';
import styled from 'styled-components';

import Table from './Table.js';
import TableControls from './TableControls.js';
import DimensionsTable from './DimensionsTable.js';
import DataPackageView from './DataPackageView.js';

const Container = styled.div`
	width : 75%;
	@media only screen and (max-width: 768px) {
		width : 100%;
	} 
`;
const RightContainer = styled.div`
	padding: 0 20px;
`;

class RightBar extends Component{
	render(){
		return (
			<Container>
				<RightContainer>
					<DimensionsTable />
					<TableControls />
					<Table />
					<DataPackageView />
				</RightContainer>
			</Container>
		)
	}
}

export default RightBar;
