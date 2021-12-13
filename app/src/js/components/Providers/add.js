import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createProvider } from '../../actions';
import AddRecord from '../Add/add';
import { isValidProvider } from '../../utils/validate';

const SCHEMA_KEY = 'provider';

const nonSftpExcludes = ['privateKey', 'cmKeyId'];
const nonHttpsExcludes = ['allowedRedirects', 'certificateUri'];
const s3Excludes = [
  ...nonSftpExcludes,
  ...nonHttpsExcludes,
  'username',
  'password',
  'port',
];

const AddProvider = ({ providers }) => {
  const [exclude, setExclude] = useState(nonSftpExcludes);
  const [selectedProtocol, setSelectedProtocol] = useState('http');

  const handleInputChange = {
    protocol: (value) => {
      if (value === 's3') setExclude(s3Excludes);
      else if (value.includes('http')) setExclude(nonSftpExcludes);
      else if (value === 'sftp') setExclude(nonHttpsExcludes);
      else if (value === 'ftp') setExclude([...nonHttpsExcludes, ...nonSftpExcludes]);
      setSelectedProtocol(value);
    },
  };

  const data = {
    protocol: selectedProtocol,
  };

  return (
    <div className="add_providers">
      <Helmet>
        <title> Add Provider </title>
      </Helmet>
      <AddRecord
        baseRoute="/providers/provider"
        createRecord={createProvider}
        data={data}
        exclude={exclude}
        handleInputChange={handleInputChange}
        primaryProperty="id"
        schemaKey={SCHEMA_KEY}
        state={providers}
        title="Create a provider"
        validate={isValidProvider}
        validationError="Concurrent Connection Limit cannot be a negative value"
      />
    </div>
  );
};

AddProvider.propTypes = {
  providers: PropTypes.object,
};

export default withRouter(
  connect((state) => ({
    providers: state.providers,
  }))(AddProvider)
);
