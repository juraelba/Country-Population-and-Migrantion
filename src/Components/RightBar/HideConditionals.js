import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    border: 1px solid #E9E4C8;
    color: black;
    padding: 18px 10px;
    font-size: 14px;
`;

const HideConditional = styled.div`
    display: flex;
    &:not(:last-child) {
        margin-bottom: 14px
    }
`;

const CustomInput = styled.input`
    cursor: pointer;
`;

const CustomLabel = styled.label`
    font-weight: 600;
    padding-left: 10px;
    color: #7D7D7D;
    font-size: 14px;
`;

class HideConditionals extends Component{
    render(){
        const { hide_conditionals } = this.props;
        const { hide_zeroes, hide_empty_fields, hide_non_numerics } = hide_conditionals;
        return (
        <Container>
            <HideConditional>
                <CustomInput 
                    type="checkbox" 
                    checked={hide_zeroes} 
                    onChange={(e) => { this.props.handleCheckBox(e, "hide_zeroes") }}
                />
                <CustomLabel>Hide Zeroes</CustomLabel>
            </HideConditional>
            <HideConditional>
                <CustomInput 
                    type="checkbox" 
                    checked={hide_empty_fields} 
                    onChange={(e) => { this.props.handleCheckBox(e, "hide_empty_fields") }}
                />
                <CustomLabel>Hide Empty Fields</CustomLabel>
            </HideConditional>
            <HideConditional>
                <CustomInput 
                    type="checkbox" 
                    checked={hide_non_numerics} 
                    onChange={(e) => { this.props.handleCheckBox(e, "hide_non_numerics") }}
                />
                <CustomLabel>Hide Non Numerics</CustomLabel>
            </HideConditional>
        </Container>
        )
    }
}

export default HideConditionals;