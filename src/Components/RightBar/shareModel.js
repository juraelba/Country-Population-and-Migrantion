import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { IoIosCloseCircle } from "react-icons/io";

import { SET_MODAL_VISIBILITY } from '../../Constants/actionTypes';

const mapStateToProps = state => ({
    conditional_filter : state.table_controls.share_modal,
    show : state.table_controls.show
});

const mapDispatchToProps = dispatch => ({
    setModalVisibility : (payload) => dispatch({ type : SET_MODAL_VISIBILITY, payload })
});

const Container = styled.div`
    border: 0.85px solid rgba(142, 142, 140, 0.335309);;
    position: absolute;
    top: 40px;
    right:0;
    color: black;
    z-index: 5;
    background: linear-gradient(180deg, #FFFFFF 0%, #FBFBFB 100%);
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.02);
    width: 330px;
    border-radius: 6px;
    div:not(:last-child) {
        border-right: none !important;
      }
`;

const Header = styled.div`
    padding: 10px 12px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid whitesmoke;
`;

const Heading = styled.div`
    font-weight: 600;
    color: #959595;
    font-size : 14px;
    border-right: none !important;
    `;

const InputLabel = styled.div`
    font-weight: 600;
    color: #959595;
    font-size : 14px;
    text-align: left;
    border-right: none !important;
    padding: 18px 0px

    `;
const ShareContainer = styled.div`
      padding 10px 10px;
`;

const InputArea = styled.div`
    display: block;
    padding : 0px 4px 0px 4px;
`;

const CustomInput = styled.input`
    width: 100%;
    padding: 10px 5px;
    outline: none;
    background-color : ${props => props.disabled ? 'whitesmoke' : 'none'};
    border: 0.85px solid #DEDEDE;
    border-radius: 5px;
    font-size: 14px;
    color: #959595;
    `;
  
const CustomLargeInput = styled.input`
    width: 100%;
    padding: 10px 5px;
    outline: none;
    background-color : ${props => props.disabled ? 'whitesmoke' : 'none'};
    border: 0.85px solid #DEDEDE;
    border-radius: 5px;
    font-size: 14px;
    color: #959595;
    height: 70px;
    `;

const InputContainer = styled.div`
    text-align: right;
    display: flex;
`;

const CopyButton = styled.button`
    background-color: #4a86e2;
    outline:none;
    color: white;
    font-size: 13px;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    border : none;
    max-height: 40px;
    position: absolute;
    right: 15px;
`;
const SocialIcons = styled.div`
      display: flex;
      svg{
        padding:10px;
      }
`;

const Icons = styled.a`
  border: 1px solid rgba(216, 212, 185, 0.226754);
  padding: 15px 20px;
  background: linear-gradient(180deg, #FFFFFF 0%, #FBFBFB 100%);
  &:first-child {
    border-radius: 8px 0px 0px 8px;
  }
  &:last-child {
    border-radius: 0px 8px 8px 0px;
  }
`;

class ShareModal extends Component{
	constructor(props) {
        super(props);
        this.handleCloseButton = this.handleCloseButton.bind(this);
    }

    handleCloseButton = (event)=>{
        const show = this.props.show === 'share_modal';

        this.props.setModalVisibility({
            control_type : "share_modal",
            show : !show
        });
    }



    render(){
        return (
        <Container>
            <Header>
                <Heading>
                    Share
                </Heading>
                <IoIosCloseCircle style={{"cursor" : "pointer", "fontSize" : "18px", "color":"#BEA281","marginRight": "10px"}} onClick={this.handleCloseButton} />
            </Header>
            <ShareContainer>
              <InputLabel> Public Link </InputLabel>
              <InputArea>
                  <InputContainer>
                    <CustomInput />
                    <CopyButton >Copy</CopyButton>
                  </InputContainer>
              </InputArea>
              <InputLabel> Embed Code </InputLabel>
              <InputArea>
                  <InputContainer>
                    <CustomLargeInput/>
                    <CopyButton style={{}}>Copy</CopyButton>
                  </InputContainer>
              </InputArea>
              <InputLabel> Social Media</InputLabel>
              <SocialIcons>
                <Icons href="#"><img src={"/facebook-icon.svg"} alt="facebook"/></Icons>
                <Icons href="#"><img src={"/twitter-icon.svg"} alt="twitter"/></Icons>
                <Icons href="#"><img src={"/linkedin-icon.svg"} alt="linkedin"/></Icons>
              </SocialIcons>  
            </ShareContainer>     
        </Container>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareModal);
