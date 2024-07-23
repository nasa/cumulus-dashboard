import _config from '../config/index.js';

const kibanaConfigured = () => !!_config.kibanaRoot;

const linkToKibana = () => {
  if (!kibanaConfigured()) return '';
  return `${_config.kibanaRoot}/app/discover#/`;
};

export default linkToKibana;
