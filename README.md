# client-axenit

*Website: https://datopian.gitlab.io/clients/axenit*

## Test suite

This project is backed by a test suite. There are unit tests and integration tests. They can be run with the following commands:

```sh
$ npm test
$ npm run cy:test
```

## API module

The API module contains code for connecting to a Fusion Registry instance through a webservice. After running the function to initialize the connection, the functions are ready to be used.

```javascript
import { getDataflow, initialize as initializeAPI } from '../API';

initializeAPI();

getDataflow('GCC_STAT', 'DF_GCC_POP_AREA', '1.0').then((result) => {
  const { dataflow, observation, series } = result;

  // ...
});
```

`getDataflow` returns a Dataflow, Fusion Registry's version of a dataset - as explained in [./docs/fusion-registry.md](./docs/fusion-registry.md).

## Dataset search

The feature of dataset search, present in the sidebar of the explorer, is implemented with [Fuse.js](https://fusejs.io/). The configuration of the library is currently present in [./src/Components/LeftBar/DataSets.js](./src/Components/LeftBar/DataSets.js).

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). Please head to their offical website in case you need more information about the conventions chosen by this project.
