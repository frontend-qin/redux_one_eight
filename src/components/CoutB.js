import React, { Component } from 'react';

import { ADD2 } from '../reducers/type';

import { connect } from './../react-redux';

class CoutB extends Component {
  render() {
    const { add, num } = this.props;
    console.log('CoutB- render');
    return (
      <>
        <p>CoutB组件：{num}</p>
        <button onClick={add}>CoutB组件++</button>
      </>
    );
  }
}
const mapStateToProps = (state) => state.count2;
const mapDispatchToProps = (dispatch) => ({
  add() {
    dispatch({ type: ADD2 });
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(CoutB);
