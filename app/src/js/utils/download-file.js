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
