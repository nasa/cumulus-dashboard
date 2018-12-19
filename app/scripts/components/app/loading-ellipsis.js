'use strict';
import React from 'react';
import createReactClass from 'create-react-class';

const Loading = createReactClass({
  displayName: 'Ellipsis',
  render: function () {
    return (
      <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    );
  }
});
export default Loading;
