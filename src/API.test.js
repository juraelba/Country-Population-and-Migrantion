import fs from 'fs';
import path from 'path';
let API

const fixtureFile = fs.readFileSync(path.resolve(__dirname, './fixtures/dataflow.json'));
const fixture = JSON.parse(fixtureFile);
let fixtureDF;

const mockIMJS = {
  IMJSStatic : {
    getInstance : jest.fn(),
  },
  IMUtils : {
    callSDMXGETService : jest.fn(() => {
      return new Promise(resolve => resolve(fixture));
    }),
  },
};

beforeEach(() => {
  jest.mock('./Vendor/IMJS.js', () => mockIMJS);
  API = require('./API');

  fixtureDF = API.dataframeFromDataflow(fixture);
});

describe('initialize()', () => {
  it('sets up instance configuration', () => {
    API.initialize();
    expect(mockIMJS.IMJSStatic.getInstance).toBeCalled();
  });

  it('returns IMJS global variable', () => {
    const instance = API.initialize();
    expect(instance).toBe(mockIMJS);
  });
});

describe('getDataflow()', () => {
  it('sends request to endpoint /data', () => {
    API.getDataflow('GCC_STAT', 'DF_GCC_ENERGY_ENVIRON', '1.0');
    const expectedPath = 'data/GCC_STAT,DF_GCC_ENERGY_ENVIRON,1.0/all?format=sdmx-json&detail=full&references=none';
    expect(mockIMJS.IMUtils.callSDMXGETService).toBeCalledWith(expectedPath);
  });

  it('returns observation', () => {
    API.getDataflow('GCC_STAT', 'DF_GCC_ENERGY_ENVIRON', '1.0').then(({ observation }) => {
      expect(observation).toBe(fixture.structure.dimensions.observation);
    });
  });

  it('returns series', () => {
    API.getDataflow('GCC_STAT', 'DF_GCC_ENERGY_ENVIRON', '1.0').then(({ series }) => {
      expect(series).toBe(fixture.structure.dimensions.series);
    });
  });
});

describe('pivotDataframe', () => {
  test('with one value, one index, and one column', () => {
    const values = ['OBS_VALUE'];
    const index = ['UNIT_MEASURE'];
    const columns = ['COUNTRY'];

    const result = API.pivotDataframe(fixtureDF, values, index, columns);
    expect(result).toMatchSnapshot();
  });

  test('without index, aggregates values only by columns', () => {
    const values = ['OBS_VALUE'];
    const index = [];
    const columns = ['COUNTRY'];

    const result = API.pivotDataframe(fixtureDF, values, index, columns);
    expect(result).toMatchSnapshot();
  });

  test('without columns, aggregates values only by columns', () => {
    const values = ['OBS_VALUE'];
    const index = ['UNIT_MEASURE'];
    const columns = [];

    const result = API.pivotDataframe(fixtureDF, values, index, columns);
    expect(result).toMatchSnapshot();
  });

  test('with one value, one index, and multiple columns', () => {
    const values = ['OBS_VALUE'];
    const index = ['UNIT_MEASURE'];
    const columns = ['COUNTRY', 'TIME_PERIOD'];

    const result = API.pivotDataframe(fixtureDF, values, index, columns);
    expect(result).toMatchSnapshot();
  });

  test('with one value, multiple index, and one column', () => {
    const values = ['OBS_VALUE'];
    const index = ['UNIT_MEASURE', 'TIME_PERIOD'];
    const columns = ['COUNTRY'];

    const result = API.pivotDataframe(fixtureDF, values, index, columns);
    expect(result).toMatchSnapshot();
  });

  test('with one value, multiple index, and multiple columns', () => {
    const values = ['OBS_VALUE'];
    const index = ['UNIT_MEASURE', 'ENERGY_FLOW'];
    const columns = ['COUNTRY', 'TIME_PERIOD'];

    const result = API.pivotDataframe(fixtureDF, values, index, columns);
    expect(result).toMatchSnapshot();
  });
});
