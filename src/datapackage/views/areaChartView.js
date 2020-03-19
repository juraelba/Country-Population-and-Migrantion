import lineChartView from "./lineChartView";

const areaChartView = (datapackage, row_ids) => {
  let view = lineChartView(datapackage, row_ids);
  view["mark"] = "area";
  return view;
};

export default areaChartView;
