import lineChartView from "./lineChartView";

const circleChartView = (datapackage, row_ids) => {
  let view = lineChartView(datapackage, row_ids);
  view["mark"] = "circle";
  return view;
};

export default circleChartView;
