import { fromNow, tally } from '../format';
import { getPersistentQueryParams } from '../../withUrlHelper';

export const tableColumns = [
  {
    Header: 'Name',
    accessor: 'id',
    isLink: true,
    linkTo: (row) => {
      const queryParams = getPersistentQueryParams(window.location);
      const path = `/providers/provider/${row.id}`;
      return queryParams ? `${path}?${queryParams}` : path;
    },
    Cell: ({ cell: { value } }) => (value)
  },
  {
    Header: 'Host',
    accessor: 'host'
  },
  {
    Header: 'Global Connection Limit',
    accessor: 'globalConnectionLimit'
  },
  {
    Header: 'Protocol',
    accessor: 'protocol'
  },
  {
    Header: 'Port',
    accessor: 'port'
  },
  {
    Header: 'Updated',
    accessor: 'updatedAt',
    useTooltip: true,
    id: 'updatedAt'
  }
];

export const metaAccessors = [
  {
    label: 'Created',
    property: 'createdAt',
    accessor: fromNow
  },
  {
    label: 'Updated',
    property: 'updatedAt',
    accessor: fromNow
  },
  {
    label: 'Protocol',
    property: 'protocol'
  },
  {
    label: 'Host',
    property: 'host'
  },
  {
    label: 'Port',
    property: 'port'
  },
  {
    label: 'Global Connection Limit',
    property: 'globalConnectionLimit',
    accessor: tally
  },
  {
    label: 'Username (encrypted)',
    property: 'username'
  }
];

export default tableColumns;
