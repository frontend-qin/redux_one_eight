import React, { PureComponent } from 'react';
import Context from './context';
export default function connect(mapStateToProps, mapDispatchToProps) {
  return function (WarpComponent) {
    return class extends PureComponent {
      static contextType = Context;
      constructor(props, context) {
        super(props);
        this.boundActions =
          mapDispatchToProps && mapDispatchToProps(context.dispatch);
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
        const { getState } = this.context;
        return (
          <WarpComponent
            {...(mapStateToProps && mapStateToProps(getState()))}
            {...this.boundActions}
          />
        );
      }
    };
  };
}
