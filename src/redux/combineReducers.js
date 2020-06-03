/**
 * 合并多个reducer
 * @param {*} reducers 对象
 */

export default function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers);
  return function (state = {}, action) {
    const nextState = {};
    for (let i = 0; i < reducerKeys.length; i++) {
      // 拿到每一个数组的每一项
      const key = reducerKeys[i];
      // 拿到每个reducer函数的状态
      const reducerState = state[key];
      // 获取每个 reducer函数
      const reducer = reducers[key];
      // 给 nextState对象赋值，key 是传入的key, 值为每个reducer函数执行的结果
      nextState[key] = reducer(reducerState, action);
    }
    return nextState;
  };
}

// 简化代码
// export default function combineReducers(reducers) {
//   const reducerKeys = Object.keys(reducers);
//   return function (state = {}, action) {
//     const nextState = {};
//     reducerKeys.forEach(
//       (reducerKey) =>
//         (nextState[reducerKey] = reducers[reducerKey](
//           state[reducerKey],
//           action,
//         )),
//     );
//     return nextState;
//   };
// }
