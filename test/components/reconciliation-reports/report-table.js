'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { shallow, configure } from 'enzyme';

import ReportTable from '../../../app/scripts/components/reconciliation-reports/report-table';
import SortableTable from '../../../app/scripts/components/table/sortable';
import { nullValue } from '../../../app/scripts/utils/format';

configure({ adapter: new Adapter() });

const tableData = [{
  granuleId: 'g-123',
  filename: 'filename.txt',
  bucket: 'some-bucket',
  path: 's3://some-bucket/filename.txt'
}];

export const tableHeader = [
  'GranuleId',
  'Filename',
  'Bucket',
  'S3 Link'
];

export const tableRow = [
  (d) => d.granuleId,
  (d) => d.filename,
  (d) => d.bucket,
  (d) => d ? <a href={d.path} target='_blank'>Link</a> : nullValue
];

export const tableProps = ['granuleId', 'filename', 'bucket', 'link'];

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
      tableHeader={tableHeader}
      tableRow={tableRow}
      tableProps={tableProps}
    />
  );

  t.is(report.find('h3').text(), 'Test table (1)');

  const Table = report.find(SortableTable).dive();

  const headerRow = Table.find('tr').first();
  t.is(headerRow.children('td').at(0).text(), 'GranuleId');
  t.is(headerRow.children('td').at(1).text(), 'Filename');
  t.is(headerRow.children('td').at(2).text(), 'Bucket');
  t.is(headerRow.children('td').at(3).text(), 'S3 Link');

  const dataRow = Table.find('tr').at(1);
  t.is(dataRow.children('td').at(0).text(), 'g-123');
  t.is(dataRow.children('td').at(1).text(), 'filename.txt');
  t.is(dataRow.children('td').at(2).text(), 'some-bucket');
  t.true(dataRow.children('td').at(3).contains(
    <a href="s3://some-bucket/filename.txt" target="_blank">Link</a>
  ));
});
