import {
  getFormattedCollectionId,
  collectionLink,
  providerLink,
  fromNowWithTooltip,
} from '../format';
import { strings } from '../../components/locale';

export const tableColumns = [
  {
    Header: 'Name',
    accessor: 'name',
    isLink: true,
    linkTo: (row) => `/rules/rule/${row.name}`,
    Cell: ({ cell: { value } }) => value
  },
  {
    Header: 'Provider',
    accessor: 'provider',
    isLink: true,
    linkTo: (row) => `/providers/provider/${row.provider}`,
    Cell: ({ cell: { value } }) => providerLink(value)
  },
  {
    Header: strings.collection_id,
    accessor: 'collection',
    Cell: ({ cell: { value } }) => collectionLink(getFormattedCollectionId(value)),
    disableSortBy: true,
  },
  {
    Header: 'Type',
    accessor: 'rule.type',
    disableSortBy: true
  },
  {
    Header: 'State',
    accessor: 'state'
  },
  {
    Header: 'Updated',
    accessor: 'updatedAt',
    Cell: ({ cell: { value } }) => fromNowWithTooltip(value),
    id: 'updatedAt'
  }
];

export default tableColumns;
