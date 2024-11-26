import React from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

// import { withRouter } from 'react-router-dom';
import {
  getRule,
  updateRule,
  clearUpdateRule
} from '../../actions';

import EditRaw from '../EditRaw/edit-raw';
import { withRouter } from '../../withRouter';

const SCHEMA_KEY = 'rule';

const EditRule = ({
  router
}) => {
  const { params: { ruleName } } = router;
  const rules = useSelector((state) => state.rules);

  return (
    <div className = "edit_rules">
      <Helmet>
        <title> Edit Rule </title>
      </Helmet>
      <EditRaw
        pk={ruleName}
        schemaKey={SCHEMA_KEY}
        primaryProperty='name'
        state={rules}
        getRecord={() => getRule(ruleName)}
        updateRecord={updateRule}
        backRoute={`rule/${ruleName}`}
        clearRecordUpdate={clearUpdateRule}
        hasModal={true}
      />
    </div>
  );
};

EditRule.propTypes = {
  match: PropTypes.object,
  rules: PropTypes.object,
  router: PropTypes.shape({
    rules: PropTypes.object,
    params: PropTypes.object,
  }),

};

export default withRouter(EditRule);
