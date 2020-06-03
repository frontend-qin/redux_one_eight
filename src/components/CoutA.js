import React, { Component } from 'react';

import { ADD1, ASYNCADD } from '../reducers/type';

import { connect } from './../react-redux';

class CoutA extends Component {
  render() {
    const { add, num, asyncAdd } = this.props;
    // console.log('CoutA:render');
    return (
      <>
        <p>CoutA组件：{num}</p>
        <button onClick={add}>CoutA组件++</button>
        <button onClick={asyncAdd}>Async++</button>
      </>
    );
  }
}
const mapStateToProps = (state) => state.count1;
const mapDispatchToProps = (dispatch) => ({
  add() {
    dispatch({ type: ADD1 });
  },
  asyncAdd() {
    setTimeout(() => {
      dispatch({ type: ASYNCADD });
    }, 1000);
  },
});
// 减少了无用渲染
// 科里化函数
export default connect(mapStateToProps, mapDispatchToProps)(CoutA);
