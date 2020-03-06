'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import Collapsible from 'react-collapsible';
import { shallow, configure } from 'enzyme';

import ReportTable from '../../../app/src/js/components/ReconciliationReports/report-table';
import SortableTable from '../../../app/src/js/components/SortableTable/SortableTable';
import { nullValue } from '../../../app/src/js/utils/format';

configure({ adapter: new Adapter() });

const tableColumns = [
  {
    Header: 'GranuleId',
    accessor: 'granuleId'
  },
  {
    Header: 'Filename',
    accessor: 'filename'
  },
  {
    Header: 'Bucket',
    accessor: 'bucket'
  },
  {
    Header: 'S3 Link',
    accessor: row => row ? <a href={row.path} target='_blank'>Link</a> : nullValue,
    id: 'link'
  }
]

const tableData = [{
  granuleId: 'g-123',
  filename: 'filename.txt',
  bucket: 'some-bucket',
  path: 's3://some-bucket/filename.txt'
}];

test('render nothing when no data is provided', function (t) {
  const report = shallow(
    <ReportTable
      data={null}
    />
  );

  t.true(report.isEmptyRender());
});

test('render nothing when no data is an empty array', function (t) {
  const report = shallow(
    <ReportTable
      data={[]}
    />
  );

  t.true(report.isEmptyRender());
});

test('render basic table', function (t) {
  const report = shallow(
    <ReportTable
      data={tableData}
      title={'Test table'}
      tableColumns={tableColumns}
    />
  );

  t.is(report.find('h3').text(), 'Test table (1)');

  const Table = report.find(SortableTable).dive();

  const headerRow = Table.find('.thead .tr').first();
  t.is(headerRow.find('.th > div:first-child').at(0).text(), 'GranuleId');
  t.is(headerRow.find('.th > div:first-child').at(1).text(), 'Filename');
  t.is(headerRow.find('.th > div:first-child').at(2).text(), 'Bucket');
  t.is(headerRow.find('.th > div:first-child').at(3).text(), 'S3 Link');

  const dataRow = Table.find('.tbody .tr').first();
  t.is(dataRow.find('Cell').at(0).dive().text(), 'g-123');
  t.is(dataRow.find('Cell').at(1).dive().text(), 'filename.txt');
  t.is(dataRow.find('Cell').at(2).dive().text(), 'some-bucket');
  t.true(dataRow.find('Cell').at(3).dive().contains(
    <a href="s3://some-bucket/filename.txt" target="_blank">Link</a>
  ));
});

test('render buttons to show/hide table when configured', function (t) {
  const data = [
    ...tableData,
    ...tableData,
    ...tableData
  ];

  const report = shallow(
    <ReportTable
      data={data}
      title={'Test table'}
      tableColumns={tableColumns}
      collapseThreshold={2}
    />
  );

  const collapsibleTable = report.find(Collapsible);
  t.true(collapsibleTable.exists());

  const collapsibleTrigger = collapsibleTable.dive().find('.Collapsible__trigger');
  t.true(collapsibleTrigger.exists());
  t.is(collapsibleTrigger.text(), 'Show table (3 rows)');
});

test('do not render buttons to show/hide table when data length is less than threshold', function (t) {
  const data = [
    ...tableData,
    ...tableData,
    ...tableData
  ];

  const report = shallow(
    <ReportTable
      data={data}
      title={'Test table'}
      tableColumns={tableColumns}
      collapseThreshold={10}
    />
  );

  const collapsibleTable = report.find(Collapsible);
  t.false(collapsibleTable.exists());
  const table = report.find(SortableTable);
  t.true(table.exists());
});

test('do not render buttons to show/hide table when disabled', function (t) {
  const data = [
    ...tableData,
    ...tableData,
    ...tableData
  ];

  const report = shallow(
    <ReportTable
      data={data}
      title={'Test table'}
      tableColumns={tableColumns}
      collapsible={false}
      collapseThreshold={2}
    />
  );

  const collapsibleTable = report.find(Collapsible);
  t.false(collapsibleTable.exists());
  const table = report.find(SortableTable);
  t.true(table.exists());
});
