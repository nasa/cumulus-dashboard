import React from 'react';

class ShowRecords extends React.Component {
  render () {

        return (
        <div className="ShowRecords">
            <span>Showing <span className="amount--records">{'all 100'}</span> Records</span>
        </div>
        );
  }
}

export default ShowRecords;