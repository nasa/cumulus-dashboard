import React from 'react';
import PropTypes from 'prop-types';
import Collapsible from 'react-collapsible';

import SortableTable from '../table/sortable';

class ReportTable extends React.Component {
  render () {
    const {
      collapsible,
      collapseThreshold,
      data,
      title,
      tableHeader,
      tableRow,
      tableProps
    } = this.props;

    if (!data || !data.length) {
      return null;
    }

    let reportTable = (
      <SortableTable
        data={data}
        header={tableHeader}
        row={tableRow}
        props={tableProps}
      />
    );

    if (collapsible && data.length > collapseThreshold) {
      reportTable = (
        <Collapsible
          trigger={`Show table (${data.length} rows)`}
          triggerWhenOpen="Hide table"
          triggerClassName={'button button--green button--small'}
          triggerOpenedClassName={'button button--green button--small'}
        >
          { reportTable }
        </Collapsible>
      );
    }

    return (
      <div className='page__section--small report__table'>
        <h3 className='heading--small heading--shared-content with-description'>
          {title} ({data.length})
        </h3>
        { reportTable }
      </div>
    );
  }
}

ReportTable.propTypes = {
  collapsible: PropTypes.bool,
  collapseThreshold: PropTypes.number,
  data: PropTypes.array,
  title: PropTypes.string,
  tableHeader: PropTypes.array,
  tableRow: PropTypes.array,
  tableProps: PropTypes.array
};

ReportTable.defaultProps = {
  collapsible: true,
  collapseThreshold: 1
};

export default ReportTable;
