import React from 'react';
import { window } from '../../utils/browser';

class TopButton extends React.Component {
  constructor (props) {
    super(props);
    this.topPage = this.topPage.bind(this);
  }

  topPage () {
    if (window) {
      window.scrollTo(0, 0);
    }
  }

  render () {
    return (
      <div className='top'>
        <button className='button--top' onClick={this.topPage}> Go To &nbsp;<span> Top </span>&nbsp; of Page
        </button>
      </div>
    );
  }
}

export default TopButton;
