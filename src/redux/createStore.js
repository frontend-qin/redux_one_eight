export default function createStore(reducer) {
  let currData;
  let listeners = [];
  function getState() {
    return currData;
  }
  function dispatch(action) {
    currData = reducer(currData, action);
    listeners.forEach((fn) => fn());
  }
  dispatch({ type: '@@_REDUX' });
  // 订阅数据
  function subscribe(listener) {
    listeners.push(listener);
    return function () {
      listeners = listeners.filter((fn) => fn !== listener);
    };
  }
  return {
    getState,
    dispatch,
    subscribe,
  };
}
