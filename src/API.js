import DataFrame from "dataframe-js";
const IMJS = require("./Vendor/IMJS.js");

const instanceURL =
  "https://gcc-fr.mga.com.pl/FusionRegistry/ws/public/sdmxapi/rest/";
const defaultQueryString = "?format=sdmx-json&detail=full&references=none";
const APIGet = IMJS.IMUtils.callSDMXGETService;

const initialize = () => {
  IMJS.IMJSStatic.getInstance({
    includeMetadata: true,
    url: instanceURL
  });
  return IMJS;
};

const getAgencies = () => {
  const url = `agencyscheme/all/all/latest/${defaultQueryString}`;

  return APIGet(url)
    .then(data => {
      let agencies = [];

      data["AgencyScheme"].forEach(data_point => {
        if (data_point.hasOwnProperty("items")) {
          agencies = agencies.concat(data_point["items"]);
        }
      });

      return {
        agencies
      };
    })
    .catch(error => {
      console.error("onRejected function called: " + error.message);
    });
};

const getCategories = () => {
  const url = `categoryscheme/GCC_STAT/CS_GCC_STAT/1.0/all${defaultQueryString}`;

  return APIGet(url)
    .then(data => {
      let categories = [];

      data["CategoryScheme"].forEach(data_point => {
        if (data_point.hasOwnProperty("items")) {
          data_point["items"].forEach(each_data_point => {
            if (each_data_point.hasOwnProperty("items")) {
              categories = categories.concat(each_data_point["items"]);
            }
          });
        }
      });

      return {
        categories
      };
    })
    .catch(error => {
      console.error("onRejected function called: " + error.message);
    });
};

const getDataflow = (agencyID, dataflowID, dataflowVersion) => {
  const url = `data/${agencyID},${dataflowID},${dataflowVersion}/all${defaultQueryString}`;
  return APIGet(url)
    .then(dataflow => {
      const { observation, series } = dataflow.structure.dimensions;
      const dataframe = dataframeFromDataflow(dataflow);
      return {
        dataset: dataframe.toCollection(),
        observation,
        series,
        dataflow
      };
    })
    .catch(error => {
      console.error("onRejected function called: " + error.message);
    });
};

const getDataflows = () => {
  const url = `dataflow/all/all/all${defaultQueryString}&includeMetadata=true&includeMetrics=only&includeAllAnnotations=true`;

  return APIGet(url)
    .then(data => {
      return {
        dataflows: data["Dataflow"]
      };
    })
    .catch(error => {
      console.error("onRejected function called: " + error.message);
    });
};

const dataframeFromDataflow = (dataflow, shouldConvertEnums = true) => {
  const valueAttr = "OBS_VALUE";
  let table = [];

  // Columns
  const dimensions = dataflow.structure.dimensions;
  let columns = dimensions.series.map(v => v.id);
  const obsCols = dimensions.observation.map(v => v.id);
  columns = columns.concat(obsCols);
  columns.push(valueAttr);

  // Row
  const series = Object.entries(dataflow.dataSets[0].series);
  series.forEach(([seriesKey, seriesValue]) => {
    let baseRow = seriesKey.split(":");

    if (shouldConvertEnums) {
      baseRow = baseRow.map(
        (value, index) => dimensions.series[index].values[value].name
      );
    }

    Object.entries(seriesValue.observations).forEach(([key, value]) => {
      let row = baseRow.slice();

      if (shouldConvertEnums) {
        key = dimensions.observation[0].values[key].name;
      }

      row.push(key);
      row.push(value[0]);
      table.push(row);
    });
  });

  let dataframe = new DataFrame(table, columns);
  dataframe = dataframe.cast(valueAttr, Number);
  return dataframe;
};

const transformDataframe = (dataframe, index, columns, filters) => {
  dataframe = filterDataframe(dataframe, filters);
  return pivotDataframe(dataframe, index, columns);
};

const filterDataframe = (dataframe, filters = {}) => {
  const operations = Object.entries(filters).map(([col, values]) => {
    return row => {
      if (row.has(col)) {
        return values.has(row.get(col));
      }
      return null;
    }
  });
  return dataframe["chain"](...operations);
};

const pivotDataframe = (dataframe, index = [], columns = []) => {
  const value = "OBS_VALUE";
  const hasSelectedIndex = index && index.length;
  const hasSelectedColumns = columns && columns.length;

  let agg = new Map();
  const aggKeys = index.concat(columns).filter(x => x);
  const groupedDF = dataframe["groupBy"](...aggKeys);
  let rowKey = value;
  let colKey = value;
  groupedDF.aggregate(group => {
    const row = group.getRow(0);
    if (hasSelectedIndex) {
      rowKey = row
        .select(...index)
        .toArray()
        .join("_");
    }
    const baseAttrs = Object.fromEntries(index.map(i => [i, row.get(i)]));
    agg.set(rowKey, agg.get(rowKey) || baseAttrs);
    if (hasSelectedColumns) {
      colKey = row
        .select(...columns)
        .toArray()
        .join("_");
    }
    agg.get(rowKey)[colKey] = group.stat.sum(value);
  });
  return new DataFrame(Array.from(agg.values()));
};

export {
  dataframeFromDataflow,
  getAgencies,
  getCategories,
  getDataflow,
  getDataflows,
  initialize,
  pivotDataframe,
  transformDataframe
};
