import { UPDATE_DATA_PACKAGE } from '../Constants/actionTypes';
import { dataframeToDataPackage } from '../datapackage/index';

const defaultState = {};

export default (state = defaultState, action) => {
  switch(action.type) {
    case UPDATE_DATA_PACKAGE: {
      const { dataframe, row_ids } = action.payload;
      return dataframeToDataPackage(dataframe, row_ids);
    }

    default: {
      return state;
    }
  }
}
