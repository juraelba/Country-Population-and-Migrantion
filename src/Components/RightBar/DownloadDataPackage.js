import DataFrame from "dataframe-js";
import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

const DropdownList = styled.div`
height: 20px;
background: ${props =>
  props.isActive
    ? "linear-gradient(180deg, #FFEF7E 0%, #EDDC6A 100%);"
    : "#F3F3F3"};
color: ${props => (props.isActive ? "#847109" : "#A39135")};
font-size: 15px;
color: #a39135;
letter-spacing: 0.3px;
padding: 10px 16px;
cursor: pointer;
font-weight: 500;
align-items: center;
display: flex;
align-items: center;
justify-content: center;
:hover,
:focus {
  outline: none;
}
&.svg {
  cursor: pointer;
}
`;

const Icon = styled.span`
padding: 0 5px;
`;
  

const mapStateToProps = state => ({
  datapackage: state.datapackage
});

class CSVAdapter {
  constructor(datapackage) {
    this.datapackage = datapackage;
  }

  getStringBlob() {
    const {
      data,
      schema: { fields }
    } = this.datapackage.resources[0];
    const dataframe = new DataFrame(data, fields.map(x => x.name));
    return dataframe.toCSV(true);
  }

  getFile() {
    return {
      blob: new Blob([this.getStringBlob()], { type: "text/csv" }),
      fileName: "data.csv"
    };
  }
}

class JSONAdapter {
  constructor(datapackage) {
    this.datapackage = datapackage;
  }

  getStringBlob() {
    return JSON.stringify(this.datapackage.resources[0].data);
  }

  getFile() {
    return {
      blob: new Blob([this.getStringBlob()], { type: "application/json" }),
      fileName: "data.json"
    };
  }
}

class DownloadDataPackageView extends Component {
  adapters = {
    csv: CSVAdapter,
    json: JSONAdapter
  };

  getFile = () => {
    const data = this.props.datapackage;
    const adapter = this.adapters[this.props.format];
    return new adapter(data).getFile();
  };

  downloadFile = () => {
    const { blob, fileName } = this.getFile();
    const element = document.createElement("a");
    element.href = URL.createObjectURL(blob);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
  };

  render() {
    const format = this.props.format
    return (
      <DropdownList
        isActive={true}
        onClick={this.downloadFile}
        title={this.props.format}
      > 
     <Icon>{format === 'csv'?<img src={"/csv-icon.svg"} alt="CSV"/>: <img src={"/json-icon.svg"} alt="JSON"/> }</Icon>
      {format}
      </DropdownList>
    );
  }
}

export default connect(mapStateToProps)(DownloadDataPackageView);
