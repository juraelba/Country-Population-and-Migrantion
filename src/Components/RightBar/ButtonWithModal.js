import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { IoIosCloseCircle } from "react-icons/io";
import { SET_MODAL_VISIBILITY,SET_SELECT_FUNCTION} from '../../Constants/actionTypes';


const Container = styled.div`
    position : relative;
    display: flex;
    background-image: ${props => props.isActive ? 'linear-gradient(180deg, #FFEF7E 0%, #EDDC6A 100%)' : 'none'};
    background-color: ${props => props.isActive ? 'none' : 'whitesmoke'};
    color: ${props => props.isActive ? '#847109' : '#bfbfbf'};    
`;

const Button = styled.div`
    border: 0.8 solid #C3B763;
    font-size: 15px;
    color: #A39135;
    letter-spacing: 0.3px;
    padding : 10px 16px;
    cursor: pointer;
    font-weight: 500;
    height: 20px;  
    display : flex;
    align-items: center;
    justify-content: center;

    :hover, :focus{
        outline: none
    }

    &.svg{
        cursor:pointer;
    }
`;

const mapStateToProps = state => ({
    table_controls : state.table_controls,
});

const mapDispatchToProps = dispatch => ({
    setModalVisibility : (payload) => dispatch({ type : SET_MODAL_VISIBILITY, payload }),
    setSelectFunction : (payload) => dispatch({ type : SET_SELECT_FUNCTION, payload }),
});

class ButtonWithModal extends Component{

	constructor(props) {
		super(props);
        this.handleCloseButton = this.handleCloseButton.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);
        this.state = {
            show: false,
        }
    }
   
    componentWillReceiveProps(nextProps){
        // this.setState({ show: this.props.table_controls["show"] === })
    }
    // handleCloseButton = (event)=>{
        
    //     const show = this.props.table_controls.show === 'add_function';

    //     this.props.setAddFunction({ 
    //         select_function : "none"
    //     });
    //     this.props.setModalVisibility({
    //         control_type : "add_function",
    //         show : false
    //     });
    // }
    handleOnClick = () => {
        const { control_type } = this.props;
        this.props.setModalVisibility({
            control_type : control_type,
            show : true
        });
    }
    handleCloseButton = (event)=>{
        this.props.setSelectFunction({ 
            checked_function : [],
            all_items : {}
        });

        this.props.setModalVisibility({
            control_type : "check_function",
            show : false
        });
       
    }
 
	render(){
        const { children, label, isActive, table_controls, control_type } = this.props;
        const show = table_controls["show"] === control_type;
        const condition = (label === "Select Function" &&  (!this.props.table_controls.check_function.checked_function.length == 0));
        return (
                <Container isActive={isActive} >
                    <Button onClick={ this.handleOnClick } >
                        { 
                            label ? label : this.props.icon
                        }
                    </Button>
                        {
                            condition ? (<IoIosCloseCircle  style={{cursor : "default", fontSize: "18px", color: "#BEA281",marginTop: "12px",marginLeft: "-18px"}} onClick={this.handleCloseButton} />)
                                    : ("")
                        }
                    {
                         show ? children : null
                    }
                </Container>
        )
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonWithModal);
