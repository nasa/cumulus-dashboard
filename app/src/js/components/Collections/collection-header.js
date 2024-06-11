import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  collectionName as collectionLabelForId,
  getCollectionId,
  lastUpdated,
  collectionHrefFromNameVersion,
} from '../../utils/format.js';
import { getPersistentQueryParams } from '../../utils/url-helper.js';
import { strings } from '../locale.js';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.js';

const CollectionHeader = ({
  breadcrumbConfig,
  name,
  queriedAt,
  version,
}) => {
  const collectionId = getCollectionId({ name, version });
  let breadcrumbOptions = [
    {
      label: 'Dashboard Home',
      href: '/',
    },
    {
      label: 'Collections',
      href: '/collections/all',
    },
    {
      label: 'Collection Overview',
      href: collectionHrefFromNameVersion({ name, version }),
    },
  ];

  breadcrumbOptions = breadcrumbOptions.concat(breadcrumbConfig);

  return (
    <>
      <section className="page__section page__section__controls">
        <Breadcrumbs config={breadcrumbOptions} />
      </section>
      <section className="page__section page__section__header-wrapper">
        <h1 className="heading--large heading--shared-content with-description ">
          {strings.collection}: {collectionLabelForId(collectionId)}
        </h1>
        <Link
          className="button button--edit button--small form-group__element--right button--green"
          to={(location) => ({
            pathname: `/collections/edit/${name}/${encodeURIComponent(version)}`,
            search: getPersistentQueryParams(location),
          })}
        >
          Edit
        </Link>
        <dl className="metadata__updated">
          <dd>{lastUpdated(queriedAt)}</dd>
        </dl>
      </section>
    </>
  );
};

CollectionHeader.propTypes = {
  breadcrumbConfig: PropTypes.array,
  name: PropTypes.string,
  queriedAt: PropTypes.number,
  version: PropTypes.string,
};

export default CollectionHeader;
