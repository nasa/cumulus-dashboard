import React from 'react';
import { connect } from 'react-redux';

var Granules = React.createClass({
  displayName: 'Granules',

  propTypes: {
    children: React.PropTypes.object
  },

  render: function () {
    return (
      <div className='page__granules'>
        <div>
	      	<h1>Granules</h1>
	      </div>
	      <Sidebar />
        {this.props.children}
      </div>
    );
  }
});

export default connect(state => state)(Granules);
