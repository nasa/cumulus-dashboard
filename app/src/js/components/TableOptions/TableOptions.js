import React from 'react';
import Pagination from '../Pagination/Pagination';
import PropTypes from 'prop-types';

class TableOptions extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="options">
        <div className="row">
          <ul>
            <li className="records">Show <span className="data-record">all 100</span> Records</li>
            <li className="pager">
              <Pagination
                count={this.props.count}
                limit={this.props.limit}
                page={this.props.page}
                onNewPage={this.props.queryNewPage}
                showPages={this.props.showPages}
              />
            </li>
            <li className="amount">Show Options</li>
          </ul>
        </div>
      </div>

    );
  }
}

// TableOptions.propTypes = {
//   page: PropTypes.number,
//   limit: PropTypes.number,
//   count: PropTypes.number,
//   onNewPage: PropTypes.func,
//   showPages: PropTypes.boolean,
// };

export default TableOptions