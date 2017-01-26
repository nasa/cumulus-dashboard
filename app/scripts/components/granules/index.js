import React from 'react';
import { connect } from 'react-redux';

var Granules = React.createClass({
  displayName: 'Granules',

  render: function () {
    return (
      <div className='page__granules'>
        <h1>Granules</h1>
      </div>
    );
  }
});

export default connect(state => state)(Granules);
