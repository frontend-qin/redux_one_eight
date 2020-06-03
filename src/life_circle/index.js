import React from 'react';
import ReactDOM from 'react-dom';

class ABB extends React.Component {
  render() {
    console.log('ABB render');
    return <App msg={'i m here'}>ABB</App>;
  }
}
class App extends React.Component {
  constructor() {
    super();
    console.log('constructor');
    this.state = {
      a: 10,
    };
  }
  static getDerivedStateFromProps(props, state) {
    console.log(props);
    console.log(state);
    return { ...state, ...props };
  }
  // UNSAFE_componentWillMount() {
  //   console.log('UNSAFE_componentWillMount');
  // }
  componentDidMount() {
    console.log('componentDidMount');
  }
  render() {
    console.log('render');
    console.log(this.state);
    return <div>APp</div>;
  }
}
ReactDOM.render(<ABB> </ABB>, document.getElementById('root'));
