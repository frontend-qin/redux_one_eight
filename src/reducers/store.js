import { createStore, applyMiddleware } from './../redux';

import reducer from './index';

// 打印日志

// let store = createStore(reducer);

// let dispatch = store.dispatch;

// redux 中间件的核心： 对dispatch 进行重写， 在真正的派发前和派发后做某些事情
// store.dispatch = function (action) {
//   console.log(`老的值：${JSON.stringify(store.getState())}`);
//   dispatch(action);
//   console.log(`新的值：${JSON.stringify(store.getState())}`);
// };
const logger = function ({ getState, dispatch }) {
  return function (next) {
    return function (action) {
      console.log(`老的值：${JSON.stringify(getState())}`);
      next(action);
      console.log(`新的值：${JSON.stringify(getState())}`);
    };
  };
};

export default applyMiddleware(logger)(createStore)(reducer);
