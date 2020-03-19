import React, { Component } from 'react';
import styled from 'styled-components';
import RadioBox from './RadioBox.js';

const Container = styled.div`
    border: 1px solid whitesmoke;
    color: black;
    background-color: white;
    padding: 15px 10px;
    font-size: 14px;
`;

const SelectFunction = styled.div`
    display: flex;
`;

const CustomLabel = styled.label`
    font-weight: normal;
`;

class SelectFunctions extends Component{
    render(){
        return (
        <Container>
            <SelectFunction>
                <RadioBox value={"Sum"} name={"function"} />
                <CustomLabel>Sum</CustomLabel>
            </SelectFunction>
            <SelectFunction>
                <RadioBox value={"Average"} name={"function"} />
                <CustomLabel>Average</CustomLabel>
            </SelectFunction>
            <SelectFunction>
                <RadioBox value={"Median"} name={"function"} />
                <CustomLabel>Median</CustomLabel>
            </SelectFunction>
        </Container>
        )
    }
}

export default SelectFunctions;