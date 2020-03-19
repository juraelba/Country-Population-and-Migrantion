import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding: 15px 10px;
`;

const Color = styled.div`
    background-color : ${props => props.color};
    border-radius : 100px;
    width: 20px;
    height: 20px;
    margin: 1.5px;
    border: 1px solid ${props => props.color};
    cursor: pointer;
    outline: ${props => props.isActive ? '1px dashed' : 'none'};
`;

const COLORS = ["#020202","#444444","#646464","#989898","#b7b7b7","#cbcbcb","#d9d9d9","#eeeeee","#f3f3f3","#ffffff","#96251e","#e93f33","#f19833","#fdf732","#7ff238","#76f9fb","#4985e8","#294afb","#9b53fb","#e55efb","#e7b7ae","#f5cbcb","#fbe6cb","#fef1cd","#d8e9d2","#d1dfe3","#c8daf7","#cee1f3","#dad2e8","#ead2dd","#db7d67","#e99995","#f7c99a","#fce499","#b5d7a7","#a1c3c6","#a2c3f4","#9fc5e8","#b5a6d3","#d5a6bf","#c93f2b","#e06561","#f4b16b","#fbd867","#91c47b","#75a4ad","#6c9cea","#71aadf","#8d7ac3","#c07a9f","#a52a22","#cc362c","#e59038","#f1c231","#68a64f","#46808f","#3d77d6","#3d83c6","#654ea6","#a64c77","#832118","#9a271f","#b25f24","#bf9026","#3a751c","#1f4f5c","#1054ca","#125292","#342075","#732047","#58120d","#641610","#753f14","#7f5f15","#274f0f","#11333d","#1b4487","#0b3862","#20124b","#4b1231","#FFFFFF"];

class ColorPalette extends Component{
	constructor(props) {
        super(props);

        this.state = {
            searchValue : this.props.cell_color
        };
    }

    handleColorSelect = (color) => {
        this.props.handleColorChange(color);
    }

    render(){
        const { cell_color } = this.props;
        return (
        <Container>
            {
                COLORS.map((color, index) => {
                    return <Color 
                                key={index}
                                color={color} 
                                isActive={cell_color === color}
                                onClick={() => { this.handleColorSelect(color) }}
                            />
                })
            }
        </Container>
        )
    }
}

export default ColorPalette;
