import React from 'react';
import PropTypes from 'prop-types';
import Collapsible from 'react-collapsible';

import SortableTable from '../SortableTable/SortableTable';

const ReportTable = ({
  collapsible,
  collapseThreshold,
  data,
  title,
  tableColumns
}) => {
  if (!data || !data.length) {
    return null;
  }

  const shouldCollapse = collapsible && data.length > collapseThreshold;

  let reportTable = (
    <SortableTable
      data={data}
      tableColumns={tableColumns}
    />
  );

  if (shouldCollapse) {
    reportTable = (
      <Collapsible
        trigger={`Show table (${data.length} rows)`}
        triggerWhenOpen='Hide table'
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
};

ReportTable.propTypes = {
  collapsible: PropTypes.bool,
  collapseThreshold: PropTypes.number,
  data: PropTypes.array,
  title: PropTypes.string,
  tableColumns: PropTypes.array
};

ReportTable.defaultProps = {
  collapsible: true,
  collapseThreshold: 10
};

export default ReportTable;
