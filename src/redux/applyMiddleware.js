export default function applyMiddleware(middleWare) {
  return function (createStore) {
    return function (reducers) {
      let store = createStore(reducers);
      middleWare = middleWare(store);
      let dispatch = middleWare(store.dispatch);
      return {
        ...store,
        dispatch,
      };
    };
  };
}
