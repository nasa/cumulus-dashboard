import React from 'react';
import { connect } from 'react-redux';
import Sidebar from '../app/sidebar';

var Granules = React.createClass({
  displayName: 'Granules',

  propTypes: {
    children: React.PropTypes.object
  },

  render: function () {
    return (
      <div className='page__granules'>
        <div className='content__header'>
          <h1>Granules</h1>
        </div>
        <Sidebar />
        <div className='page__content--shortened'>
          {this.props.children}
        </div>
      </div>
    );
  }
});

export default connect(state => state)(Granules);
