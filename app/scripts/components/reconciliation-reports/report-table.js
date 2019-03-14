import React from 'react';
import PropTypes from 'prop-types';

import SortableTable from '../table/sortable';

class ReportTable extends React.Component {
  render () {
    const {
      data,
      title,
      tableHeader,
      tableRow,
      tableProps
    } = this.props;

    return (
      <div className='page__section--small'>
        <h3 className='heading--small heading--shared-content with-description'>
          {title} ({data.length})
        </h3>
        <SortableTable
          data={data}
          header={tableHeader}
          row={tableRow}
          props={tableProps}
        />
      </div>
    );
  }
}

ReportTable.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string,
  tableHeader: PropTypes.array,
  tableRow: PropTypes.array,
  tableProps: PropTypes.array
};

export default ReportTable;
