import React, { PureComponent } from 'react';
import Context from './context';
export default function connect(mapStateToProps, mapDispatchToProps) {
  return function (WarpComponent) {
    return class extends PureComponent {
      static contextType = Context;
      componentDidMount() {
        this.unsubscribe = this.context.subscribe(() =>
          this.setState(mapStateToProps(this.context.getState())),
        );
      }
      componentWillUnmount() {
        this.unsubscribe();
      }
      render() {
        const { getState, dispatch } = this.context;
        return (
          <WarpComponent
            {...(mapStateToProps && mapStateToProps(getState()))}
            {...(mapDispatchToProps && mapDispatchToProps(dispatch))}
          />
        );
      }
    };
  };
}
