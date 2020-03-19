import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import  { configureStore, history } from './store';
import App from './App';

const store = configureStore();

class ConnectedApp extends Component{
 	render() {
	 	return (
	 		<Provider store={store}>
			    <ConnectedRouter history = {history}>
			      <Switch>
			        <Route path="/" component={App} />
			      </Switch>
			    </ConnectedRouter>
			</Provider>
		)
	}
}

export default ConnectedApp;