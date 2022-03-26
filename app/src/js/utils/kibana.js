import _config from '../config';

const kibanaConfigured = () => !!_config.kibanaRoot;

const linkToKibana = () => {
  if (!kibanaConfigured()) return '';
  return `${_config.kibanaRoot}/app/discover#/`;
};

export default linkToKibana;
