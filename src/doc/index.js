import React from './react';
import ReactDOM from './react-dom';
function FunctionCounter(props) {
  return (
    <div id={'counter' + props.number}>
      <p>{props.number}</p>
      <button onClick={props.handleClick}>+</button>
    </div>
  );
}
class Counter extends React.Component {
  // constructor(props) {
  //   super(props);
  // }
  render() {
    return (
      <div id={'counter' + this.props.number}>
        <p>{this.props.number}</p>
        <button onClick={this.props.handleClick}>+</button>
      </div>
    );
  }
}
class ClassComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
    };
  }
  handleClick = () => {
    this.setState({ number: this.state.number + 1 });
  };
  render() {
    return (
      <Counter number={this.state.number} handleClick={this.handleClick} />
    );
  }
}

// let element1 = React.createElement('div', { id: 'counter' }, 'hello');
let element2 = React.createElement(ClassComponent);
ReactDOM.render(element2, document.getElementById('root'));

/**
 * 在React中进行事件处理函数执行的时候， 会先进去批量更新模式
 * 在执行此函数的时候，可能会引起多个组件的更新，但是因为当前是批量更新的模式
 * 所以不会立即更新state, 而是先把这个状态缓存起来，在事件函数执行完成之后再全部更新这个脏组件
 */
