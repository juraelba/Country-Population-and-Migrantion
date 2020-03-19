import merge from "deepmerge";

const deepCopy = object => merge({}, object);

const template = {
  $schema: "https://vega.github.io/schema/vega-lite/v4.json",
  width: "container",
  height: 450,
  autosize: {
    type: "fit-x"
  },
  data: {
    values: []
  },
  transform: [
    {
      fold: [],
      as: ["columnAgg", "value"]
    },
    {
      calculate: "",
      as: "rowAgg"
    }
  ],
  mark: "line",
  encoding: {
    x: {
      field: "columnAgg",
      type: "nominal",
      title: "Column"
    },
    y: {
      field: "value",
      type: "quantitative",
      title: "Observation"
    },
    color: {
      field: "rowAgg",
      type: "nominal",
      title: "Row"
    }
  },
  config: {
    axis: {
      titleFontSize: 20,
      labelFontSize: 16
    },
    legend: {
      direction: "vertical",
      labelFontSize: 16,
      labelLimit: 550,
      orient: "bottom",
      titleFontSize: 20
    }
  }
};

const lineChartView = (datapackage, row_ids) => {
  let view = deepCopy(template);
  view["data"]["values"] = datapackage["resources"][0]["data"];
  const columnValues = datapackage["resources"][0]["schema"]["fields"]
    .map(attr => attr["name"])
    .filter(attr => !row_ids.includes(attr));
  view["transform"][0]["fold"] = columnValues;
  const calculateGroupByKey = row_ids
    .map(attr => `datum.${attr}`)
    .join(` + ' / ' + `);
  view["transform"][1]["calculate"] = calculateGroupByKey;
  return view;
};

export default lineChartView;
