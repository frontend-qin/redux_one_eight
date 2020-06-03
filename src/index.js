import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from './react-redux';
import store from './reducers/store';
import CoutA from './components/CoutA';
import CoutB from './components/CoutB';
ReactDOM.render(
  <Provider store={store}>
    <CoutA />
    <CoutB />
  </Provider>,
  document.getElementById('root'),
);
