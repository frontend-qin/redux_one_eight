import React from 'react';

export default function One(props) {
  return <div>One:{props.id}</div>;
}
One.defaultProps = {
  id: 10,
  name: 'lisi',
};
