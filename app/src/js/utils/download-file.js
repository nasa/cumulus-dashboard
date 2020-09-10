/**
 * downloadFile
 * @description This causes the browser to download a given file in the browser with a given filename
 * @param {string} file url to the file itself ex: csv Blob or data:text/json url
 * @param {*} fileName the name of the downloaded file
 */

export const downloadFile = (file, fileName) => {
  const link = document.createElement('a');
  link.setAttribute('download', fileName);
  link.href = file;
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};

const convertToCSV = (data, columns) => {
  const csvHeader = columns.map((column) => column.accessor).join(',');

  const csvData = data
    .map((item) => {
      let line = '';
      Object.keys(item).forEach((prop) => {
        if (line !== '') line += ',';
        line += item[prop];
      });
      return line;
    })
    .join('\r\n');
  return `${csvHeader}\r\n${csvData}`;
};

export function handleDownloadJsonClick(e, { data, reportName }) {
  e.preventDefault();
  const jsonHref = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data)
  )}`;
  downloadFile(jsonHref, `${reportName}.json`);
}

export function handleDownloadCsvClick(e, { reportName, table }) {
  e.preventDefault();
  const { name: tableName, data: tableData, columns: tableColumns } = table;
  const data = convertToCSV(tableData, tableColumns);
  const csvData = new Blob([data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(csvData);
  downloadFile(url, `${reportName}-${tableName}.csv`);
}
