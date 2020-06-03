import React, { PureComponent } from 'react';
import Context from './context';

export default function connect(mapStateToProps, mapDispatchToProps) {
  return function (WarpComponent) {
    return class extends PureComponent {
      static contextType = Context;
      constructor(props, context) {
        super(props);
        this.state = context.getState();
      }
      UNSAFE_componentWillMount() {
        if (typeof mapDispatchToProps === 'function') {
          this.setState({
            ...this.state,
            ...mapDispatchToProps(this.context.dispatch),
          });
          mapDispatchToProps(this.context.dispatch);
        }
        if (typeof mapStateToProps === 'function') {
          // 把传入的数据替换到 state 上
          this.setState({
            ...this.state,
            ...mapStateToProps(this.state),
          });
          mapStateToProps(this.state);
        }
      }
      componentDidMount() {
        this.unsubscribe = this.context.subscribe(() =>
          this.setState(this.context.getState()),
        );
      }
      componentWillUnmount() {
        this.unsubscribe();
      }
      render() {
        return <WarpComponent {...this.state} />;
      }
    };
  };
}
// 处理参数;
