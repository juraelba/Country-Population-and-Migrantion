import merge from "deepmerge";

const deepCopy = object => merge({}, object);

const template = {
  $schema: "https://vega.github.io/schema/vega/v5.8.1.json",
  width: 800,
  height: 450,
  data: [
    {
      name: "table",
      values: [],
      transform: [
        {
          type: "fold",
          fields: [],
          as: ["columnAgg", "value"]
        },
        {
          type: "formula",
          expr: "",
          as: "rowAgg"
        },
        {
          type: "impute",
          field: "value",
          groupby: ["rowAgg"],
          key: "columnAgg",
          method: "value",
          value: 0
        },
        {
          type: "stack",
          groupby: ["columnAgg"],
          field: "value",
          sort: { field: ["rowAgg"], order: ["descending"] },
          as: ["value_start", "value_end"],
          offset: "zero"
        },
        {
          type: "aggregate",
          groupby: ["rowAgg"],
          ops: ["sum"],
          fields: ["value"],
          as: ["value"]
        },
        {
          type: "pie",
          field: "value",
          sort: false
        }
      ]
    }
  ],
  marks: [
    {
      type: "arc",
      from: { data: "table" },
      encode: {
        enter: {
          fill: { scale: "color", field: "rowAgg" },
          x: { signal: "width / 2" },
          y: { signal: "height / 2" },
          startAngle: { field: "startAngle" },
          endAngle: { field: "endAngle" },
          outerRadius: { signal: "width / 4" }
        }
      }
    }
  ],
  scales: [
    {
      name: "color",
      type: "ordinal",
      domain: { data: "table", field: "rowAgg" },
      range: { scheme: "category20" }
    }
  ],
  legends: [
    {
      stroke: "color",
      title: "Row",
      orient: "bottom",
      encode: {
        symbols: {
          update: {
            fill: { value: "" },
            strokeWidth: { value: 2 },
            size: { value: 64 }
          }
        }
      }
    }
  ],
  config: {
    legend: {
      orient: "bottom",
      direction: "vertical",
      "labelFontSize": 16,
      labelLimit: 550,
      "titleFontSize": 20
    }
  }
};

const pieChartView = (datapackage, row_ids) => {
  let view = deepCopy(template);
  view["data"][0]["values"] = datapackage["resources"][0]["data"];
  const columnValues = datapackage["resources"][0]["schema"]["fields"]
    .map(attr => attr["name"])
    .filter(attr => !row_ids.includes(attr));
  view["data"][0]["transform"][0]["fields"] = columnValues;
  const calculateGroupByKey = row_ids
    .map(attr => `datum.${attr}`)
    .join(` + ' / ' + `);
  view["data"][0]["transform"][1]["expr"] = calculateGroupByKey;
  return view;
};

export default pieChartView;
