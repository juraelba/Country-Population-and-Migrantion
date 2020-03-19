import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'

//reducers
import selections from './selections';
import dataflow from './dataflow';
import datapackage from './datapackage';
import utils from './utils';
import TableControls from './TableControls';

const reducer = (history) => combineReducers({
    router: connectRouter(history),
    selections,
    utils,
    dataflow,
    table_controls : TableControls,
    datapackage,
  })

export default reducer;
