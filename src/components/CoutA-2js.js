import React, { Component } from 'react';

import { ADD1, CUT1 } from '../reducers/type';

import { connect } from '../react-redux';

class CoutA extends Component {
  render() {
    console.log(this.props);
    const { add, num } = this.props;
    return (
      <div>
        <p>CoutA组件：{num}</p>
        <button onClick={add}>CoutA组件++</button>
        {/*
        <button onClick={() => store.dispatch({ type: ADD1 })}>
          CoutA组件++
        </button>
        <button onClick={() => store.dispatch({ type: CUT1, num: 2 })}>
          CoutA组件--
        </button> */}
      </div>
    );
  }
}
const mapStateToProps = (state) => state.count1;
const mapDispatchToProps = () => {
  return {
    add() {
      return {
        type: ADD1,
      };
    },
  };
};

// 减少了无用渲染
// 科里化函数
export default connect(mapStateToProps, mapDispatchToProps)(CoutA);
