import React from 'react';
import { connect } from 'react-redux';
import Sidebar from '../app/sidebar';

var Granules = React.createClass({
  displayName: 'Granules',

  propTypes: {
    children: React.PropTypes.object,
    location: React.PropTypes.object
  },

  render: function () {
    return (
      <div className='page__granules'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge'>Granules</h1>
          </div>
        </div>
        <div className='page__content'>
          <div className='row'>
            <Sidebar currentPath={this.props.location.pathname}/>
            <div className='page__content--shortened'>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default connect(state => state)(Granules);
