export default function bindActionCreators(actionCreator, dispatch) {
  // 给每个action绑定创建函数
  const bindActionCreator = (actionCreator) => (...args) =>
    dispatch(actionCreator(...args));

  if (typeof actionCreator === 'function') {
    return bindActionCreator(actionCreator);
  }
  let boundActions = {};
  for (let key in actionCreator) {
    boundActions[key] = bindActionCreator(actionCreator[key], dispatch);
  }
  return boundActions;
}
