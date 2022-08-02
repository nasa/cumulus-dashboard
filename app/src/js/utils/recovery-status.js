const filenamify = (fileName) => fileName.replace(/["%*/:<>?\\|]/g, '_');

export const downloadFile = (file, fileName) => {
  const link = document.createElement('a');
  link.setAttribute('download', filenamify(fileName));
  link.href = file;
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};
