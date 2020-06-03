import React, { PureComponent } from 'react';
import Context from './context';
import { bindActionCreators } from './../redux';
export default function connect(mapStateToProps, mapDispatchToProps) {
  return function (WarpComponent) {
    return class extends PureComponent {
      static contextType = Context;

      constructor(props, context) {
        super(props);
        this.state = mapStateToProps(context.getState());
      }
      componentDidMount() {
        this.unsubscribe = this.context.subscribe(() =>
          this.setState(mapStateToProps(this.context.getState())),
        );
      }
      componentWillUnmount() {
        this.unsubscribe();
      }
      render() {
        let boundActions = bindActionCreators(
          mapDispatchToProps(),
          this.context.dispatch,
        );
        return <WarpComponent {...this.state} {...boundActions} />;
      }
    };
  };
}
