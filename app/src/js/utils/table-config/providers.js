import { fromNow, tally } from '../format';

export const tableColumns = [
  {
    Header: 'Name',
    accessor: 'id',
    isLink: true,
    linkTo: (value) => `/providers/provider/${value}`,
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
