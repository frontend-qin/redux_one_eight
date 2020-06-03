import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore, bindActionCreators } from '../redux';

// 初始数据
let initData = {
  num: 10,
};
// type 类型
const ADD = 'ADD';
const CUT = 'CUT';

// 创建reducer
function reducer(state = initData, action) {
  switch (action.type) {
    case ADD:
      return {
        num: state.num + 1,
      };
    case CUT:
      return {
        num: state.num - action.num,
      };
    default:
      return state;
  }
}

// 创建数据源
let store = createStore(reducer);

let add = () => ({ type: ADD });

let cut = (num) => ({ type: CUT, num });

let addFn = bindActionCreators(add, store.dispatch);
let cutFn = bindActionCreators(cut, store.dispatch);

const actions = {
  // 加
  add: () => ({ type: ADD }),
  // 减
  cut: (num) => ({ type: CUT, num }),
};
let boundAction = bindActionCreators(actions, store.dispatch);

// 解构出数据
const { num } = store.getState();

class App extends Component {
  state = {
    num,
  };
  componentDidMount() {
    // 订阅数据
    this.unSubscribe = store.subscribe(() =>
      this.setState({
        num: store.getState().num,
      }),
    );
  }
  componentWillUnmount() {
    // 取消订阅
    this.unSubscribe();
  }
  render() {
    return (
      <div>
        <p>{this.state.num}</p>
        <button onClick={() => store.dispatch(add())}>add()+</button>
        <br />
        <button onClick={addFn}>boundAction函数+</button>
        <br />
        <button onClick={() => cutFn(5)}>boundAction函数传参-</button>
        <br />
        <button onClick={boundAction.add}>boundAction对象+</button>
        <br />
        <button onClick={() => boundAction.cut(2)}>boundAction对象传参-</button>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('root'));

/**
 * 1. dispatch 即可以提交一个对象， 还可以提交一个函数
 * 2. 也就是 actionCreate ,即创建 action 函数
 * const add = () => ({ type: ADD });
 * 提交add函数 执行结果
 * store.dispatch(add())
 * 当有多个 动作派发时， 就需要写多次 dispatch
 * 所以为了简化api，我想直接写成
 *
 * onClick={() => add()}
 *
 * 但是还是不少代码量，也很麻烦，
 */

/**
 * 仓库和状态只能有一个， 但组件可能有多个
 */
