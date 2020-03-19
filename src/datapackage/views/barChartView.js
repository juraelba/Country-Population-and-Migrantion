import lineChartView from "./lineChartView";

const barChartView = (datapackage, row_ids) => {
  let view = lineChartView(datapackage, row_ids);
  view["mark"] = "bar";
  return view;
};

export default barChartView;
