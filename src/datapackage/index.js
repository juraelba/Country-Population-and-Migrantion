import merge from "deepmerge";
import areaChartView from "./views/areaChartView";
import barChartView from "./views/barChartView";
import circleChartView from "./views/circleChartView";
import lineChartView from "./views/lineChartView";
import pieChartView from "./views/pieChartView";

const deepCopy = object => merge({}, object);

const template = {
  name: "default",
  resources: [
    {
      format: "json",
      data: [],
      schema: {
        fields: []
      }
    }
  ],
  views: []
};

const schemaFields = dataframe => {
  const columns = dataframe.listColumns();
  const firstRow = dataframe.getRow(0);
  return columns.map(col => {
    return {
      name: col,
      type: typeof firstRow.get(col)
    };
  });
};

const dataframeToDataPackage = (dataframe, row_ids) => {
  let datapackage = deepCopy(template);
  datapackage["resources"][0]["schema"]["fields"] = schemaFields(dataframe);
  datapackage["resources"][0]["data"] = dataframe.toCollection();
  const views = {
    "Line Chart": lineChartView,
    "Bar Chart": barChartView,
    "Scatter Plot": circleChartView,
    "Stacked Area Chart": areaChartView,
    "Pie Chart": pieChartView
  };
  if (row_ids.length === 0) {
    row_ids = ["TOTAL"];
  }
  Object.entries(views).forEach(([title, fun]) => {
    datapackage["views"].push({
      name: title.toLowerCase().replaceAll(" ", "-"),
      spec: fun(datapackage, row_ids),
      title: title
    });
  });
  return datapackage;
};

export { dataframeToDataPackage };
