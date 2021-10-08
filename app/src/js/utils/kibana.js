import _config from '../config';

const kibanaConfigured = () => !!_config.kibanaRoot;

const genericKibanaLink = () => {
  if (!kibanaConfigured()) return '';
  return `${_config.kibanaRoot}/app/discover#/`;
};

export const kibanaAllLogsLink = genericKibanaLink;
export const kibanaGranuleErrorsLink = genericKibanaLink;
export const kibanaExecutionLink = (cumulusInstanceMeta, executionNameOrArn) => genericKibanaLink();

export default {};
