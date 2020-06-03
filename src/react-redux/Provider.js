import React, { PureComponent } from 'react';

import Context from './context';

export default class extends PureComponent {
  render() {
    const { store, children } = this.props;

    return <Context.Provider value={store}>{children}</Context.Provider>;
  }
}
