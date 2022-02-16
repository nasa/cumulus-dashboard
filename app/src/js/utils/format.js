/* eslint-disable import/no-cycle */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import numeral from 'numeral';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { Alert } from 'react-bootstrap';
import { getPersistentQueryParams } from './url-helper';
import Tooltip from '../components/Tooltip/tooltip';
import Popover from '../components/Popover/popover';

export const nullValue = '--';

export const truthy = (value) => value || nullValue;

export const fullDate = (datestring) => {
  if (!datestring) {
    return nullValue;
  }
  return moment(datestring).format('kk:mm:ss MM/DD/YY');
};

export const dateOnly = (datestring) => {
  if (!datestring) {
    return nullValue;
  }
  return moment(datestring).format('MM/DD/YYYY');
};

export const parseJson = (jsonString) => {
  const parsed = JSON.parse(jsonString);
  return JSON.stringify(parsed, null, 2);
};

export const bigTally = (numberstring) => {
  const number = +numberstring;
  if (
    (!numberstring && numberstring !== 0) ||
    numberstring === nullValue ||
    Number.isNaN(number)
  ) {
    return nullValue;
  }

  if (number >= 1000) {
    return `${numeral(number / 1000).format('0,0')}K`;
  }
  return `${numeral(number / 1000000).format('0,0')}M`;
};

export const tally = (numberstring) => {
  const number = +numberstring;
  if (
    (!numberstring && numberstring !== 0) ||
    numberstring === nullValue ||
    Number.isNaN(number)
  ) {
    return nullValue;
  }

  if (number < 1000) {
    return number;
  }

  if (number < 100000) {
    return numeral(number).format('0,0');
  }

  return bigTally(number);
};

export const fullStatTotal = (numberstring) => {
  const number = +numberstring;
  if (
    (!numberstring && numberstring !== 0) ||
    numberstring === nullValue ||
    Number.isNaN(number)
  ) {
    return nullValue;
  }

  if (number >= 0) {
    return numeral(number).format('0,0');
  }

  return number;
};

export const numLargeTooltip = (numberstring) => (
  <Tooltip
    className="tooltip--light"
    id="card-total-tooltip"
    placement="right"
    target={
      <span className="num--large num--large--tooltip">
        {tally(numberstring)}
      </span>
    }
    tip={fullStatTotal(numberstring)}
  />
);

export const seconds = (numberstring) => {
  const number = +numberstring;
  if (numberstring === null || Number.isNaN(number)) {
    return nullValue;
  }
  return `${number.toFixed(2)}s`;
};

export const fromNow = (numberstring) => {
  const number = +numberstring;
  if (numberstring === null || Number.isNaN(number)) {
    return nullValue;
  }
  return moment(numberstring).fromNow();
};

export const fromNowWithTooltip = (timestamp) => (
  <Tooltip
    className="tooltip--blue"
    id="table-timestamp-tooltip"
    placement="bottom"
    target={<span>{fullDate(timestamp)}</span>}
    tip={fromNow(timestamp)}
  />
);

const getIndicator = (prop) => {
  const indicator = {};
  switch (prop) {
    case 'Completed':
      indicator.color = 'success';
      indicator.text = prop;
      break;
    case 'Failed':
      indicator.color = 'failed';
      indicator.text = prop;
      break;
    case 'Running':
      indicator.color = 'running';
      indicator.text = prop;
      break;
    case 'missing':
      indicator.color = 'orange';
      indicator.text = 'Granule missing';
      break;
    case 'notFound':
    case false:
      indicator.color = 'failed';
      indicator.text = 'Granule not found';
      break;
    default:
      indicator.color = 'success';
      indicator.text = 'Granule found';
      break;
  }
  return indicator;
};

export const IndicatorWithTooltip = ({ granuleId, repo, value, className }) => {
  const indicator = getIndicator(value);
  const { color, text } = indicator;
  return (
    <Tooltip
      className="tooltip--blue"
      id={`${granuleId}-${repo}-indicator-tooltip`}
      placement="right"
      target={
        <span
          className={`status-indicator status-indicator--${color} ${className}`}
        ></span>
      }
      tip={text}
    />
  );
};

IndicatorWithTooltip.propTypes = {
  className: PropTypes.string,
  granuleId: PropTypes.string,
  repo: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export const CopyCellPopover = ({ cellContent, id, popoverContent, value }) => {
  const [copyStatus, setCopyStatus] = useState('');

  async function copyToClipboard(e) {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(value || popoverContent);
      setCopyStatus('Copied!');
    } catch (err) {
      setCopyStatus('Failed to copy!');
    }
  }

  function handleMouseLeave() {
    if (copyStatus !== '') {
      setCopyStatus('');
    }
  }

  return (
    <Popover
      className="popover--blue"
      id={id}
      onMouseLeave={handleMouseLeave}
      placement="bottom"
      popover={true}
      target={cellContent}
      popoverContent={
        <>
          <div className="popover-body--main">{popoverContent}</div>
          <div className="popover-body--footer">
            {copyStatus && <span>{copyStatus}</span>}

            <button
              className="button button--small button--no-left-padding"
              onClick={copyToClipboard}
            >
              <FontAwesomeIcon icon={faCopy} /> Copy
            </button>
          </div>
        </>
      }
    />
  );
};

CopyCellPopover.propTypes = {
  cellContent: PropTypes.node,
  id: PropTypes.string,
  popoverContent: PropTypes.node,
  value: PropTypes.string,
};

export const lastUpdated = (datestring, text) => {
  const meta = text || 'Last Updated';
  let day,
    time;
  if (datestring) {
    const date = moment(datestring);
    day = date.format('MMM. D, YYYY');
    time = date.format('h:mm a');
  }
  return (
    <dl className="metadata__updated">
      <dt>{meta}:</dt>
      <dd>{day}</dd>
      {time ? <dd className="metadata__updated__time">{time}</dd> : null}
    </dl>
  );
};

export const granuleLink = (granuleId) => {
  if (!granuleId) return nullValue;
  return (
    <Link
      to={(location) => ({
        pathname: `/granules/granule/${granuleId}`,
        search: getPersistentQueryParams(location),
      })}
    >
      {granuleId}
    </Link>
  );
};

export const pdrLink = (pdrName) => {
  if (!pdrName) return nullValue;
  return (
    <Link
      to={(location) => ({
        pathname: `/pdrs/pdr/${pdrName}`,
        location: getPersistentQueryParams(location),
      })}
    >
      {pdrName}
    </Link>
  );
};

export const providerLink = (provider) => {
  if (!provider) return nullValue;
  return (
    <Link
      to={(location) => ({
        pathname: `/providers/provider/${provider}`,
        search: getPersistentQueryParams(location),
      })}
    >
      {provider}
    </Link>
  );
};

export const bool = (value) => (value ? 'Yes' : 'No');

export const displayCase = (string) => {
  const split = string.split(' ');
  return split
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const storage = (n) => {
  const number = +n;
  if (!n || Number.isNaN(number)) return nullValue;

  if (number === 0) return n;

  if (number < 1e9) return `${(number / 1e6).toFixed(2)}mb`;
  if (number < 1e12) return `${(number / 1e9).toFixed(2)}gb`;
  if (number < 1e15) return `${(number / 1e12).toFixed(2)}tb`;
  return `${(number / 1e15).toFixed(2)}pb`;
};

export const link = (url) => (
  <a href={url} target="_blank">
    Link
  </a>
);

export const truncate = (string, to = 100) => {
  if (!string) return nullValue;
  if (string.length <= to) return string;
  return `${string.slice(0, to)}...`;
};

const collectionIdSeparator = '___';
/**
 * Returns the name and version of a collection based on
 * the collectionId used in elasticsearch indexing
 *
 * @param {string} collectionId - collectionId used in elasticsearch index
 * @returns {Object} name and version as object
 */
export const deconstructCollectionId = (collectionId) => {
  let name;
  let version;
  try {
    const last = collectionId.lastIndexOf(collectionIdSeparator);
    name = collectionId.substring(0, last);
    version = collectionId.substring(last + collectionIdSeparator.length);
    if (name && version) {
      return {
        name,
        version,
      };
    }
  } catch (error) {
    // do nothing  error thrown below
  }
  if (collectionId && collectionId.match(' / ')) {
    console.debug(`deconstructCollectionId called with previously deconstructed ID ${collectionId}`);
    return collectionId;
  }
  throw new Error(`invalid collectionId: ${JSON.stringify(collectionId)}`);
};

// "MYD13A1___006" => "MYD13A1 / 006"
// "trailing_____1.0" => "trailing__ / 1.0"
export const collectionName = (collectionId) => {
  if (!collectionId) return nullValue;
  const collection = deconstructCollectionId(collectionId);
  return `${collection.name} / ${collection.version}`;
};

export const collectionNameVersion = (collectionId) => {
  if (!collectionId) return nullValue;
  return deconstructCollectionId(collectionId);
};

export const constructCollectionId = (name, version) => `${name}${collectionIdSeparator}${version}`;

export const getFormattedCollectionId = (collection) => {
  const collectionId = getCollectionId(collection);
  return formatCollectionId(collectionId);
};

export const formatCollectionId = (collectionId) => (collectionId === undefined ? nullValue : collectionId);

export const getCollectionId = (collection) => {
  if (collection && collection.name && collection.version) {
    return constructCollectionId(collection.name, collection.version);
  }
};

export const getEncodedCollectionId = (collection) => {
  if (collection && collection.name && collection.version) {
    return constructCollectionId(collection.name, encodeURIComponent(collection.version));
  }
  return nullValue;
};

export const collectionLink = (collectionId) => {
  if (!collectionId || collectionId === nullValue) return nullValue;
  return (
    <Link
      to={(location) => ({
        pathname: collectionHrefFromId(collectionId),
        search: getPersistentQueryParams(location),
      })}
    >
      {collectionName(collectionId)}
    </Link>
  );
};

export const collectionHrefFromId = (collectionId) => {
  if (!collectionId) return nullValue;
  const { name, version } = collectionNameVersion(collectionId);
  return `/collections/collection/${name}/${encodeURIComponent(version)}`;
};

export const collectionHrefFromNameVersion = ({ name, version } = {}) => {
  if (!name || !version) return nullValue;
  return `/collections/collection/${name}/${encodeURIComponent(version)}`;
};

/* Modal Text */
export const enableText = (name) => [
  <p>You have submitted a request to enable the following rule:</p>,
  <strong>{name}</strong>,
  <p>Are you sure you want to enable this rule?</p>
];

export const enableConfirm = (name) => `Rule ${name} was enabled`;

export const disableText = (name) => [
  <p>You have submitted a request to disable the following rule:</p>,
  <strong>{name}</strong>,
  <p>Are you sure you want to disable this rule?</p>
];

export const disableConfirm = (name) => `Rule ${name} was disabled`;

export const deleteText = (name) => [
  <Alert variant="warning"><strong>Warning:</strong> This action can not be reversed once you submit it.</Alert>,
  <p>You have submitted a request to permanently delete the following:</p>,
  <strong>{name}</strong>,
  <p>Are you sure you want to permanently delete? Click confirm to proceed.</p>
];

export const rerunText = (name) => [
  <p>You have submitted a request to rerun the following:</p>,
  <strong>{name}</strong>,
  <p>Are you sure you want to rerun?</p>
];

export const recoverCollectionText = (d) => [
  <p>You have submitted a Collection recovery request</p>,
  <strong>Recover {d} Collection{d > 1 ? 's' : ''}</strong>,
  <p>Click <strong>confirm</strong> to proceed with the Collection Recovery.</p>
];

export const recoverGranules = (d) => [
  <p>You have submitted the following request:</p>,
  <strong>Recover {d} Granule{d > 1 ? 's' : ''}</strong>, <br></br>, <br></br>,
  `Are you sure you want to recover ${d > 1 ? 'these granules' : 'this granule'}?`
];

export const recoverCollections = (d) => [
  <p>You have submitted a Collection recovery request</p>,
  <strong>Recover {d} Collection{d > 1 ? 's' : ''}</strong>,
  <p>Click <strong>confirm</strong> to proceed with the Collection Recovery</p>
];

export const removeFromCmr = (name) => [
  <Alert variant="warning"><strong>Warning:</strong> This action can not be reversed once you submit it.</Alert>,
  <p>You have submitted a request to remove this Granule from CMR:</p>,
  <strong>{name}</strong>,
  <p>Are you sure you want to permanently remove this Granule from CMR?</p>
];

export const removeFromCmrDelete = (d) => [
  <Alert variant="warning"><strong>Warning:</strong> Contains granules that are published to CMR.</Alert>,
  <p className="disclaimer">In order to delete these granules from Cumulus, we will first remove them from CMR.</p>,
  `You have submitted a request to delete ${d} Granule${d > 1 ? 's' : ''}. `,
  'Would you like to continue with your request?'
];

export const removeGranulesFromCmr = (d) => [
  <Alert variant="warning"><strong>Warning:</strong> This action can not be reversed once you submit it.</Alert>,
  <p>You have submitted the following request:</p>,
  <p><strong>Remove {d} Granule{d > 1 ? 's' : ''} from CMR</strong></p>,
  `Are you sure you want to permanently remove ${d > 1 ? 'these granules' : 'this granule'} from CMR?`
];

export const deleteGranules = (d) => [
  <Alert variant="warning"><strong>Warning:</strong> This action can not be reversed once you submit it.</Alert>,
  <p>You have submitted the following request:</p>,
  <p><strong>Delete {d} Granule{d > 1 ? 's' : ''}</strong></p>,
  `Are you sure you want to permanently delete ${d > 1 ? 'these granules?' : 'this granule?'}`
];

export const deletePdrs = (d) => [
  <Alert variant="warning"><strong>Warning:</strong> This action can not be reversed once you submit it.</Alert>,
  <p>You have submitted the following request:</p>,
  <p><strong>Delete {d} PDR{d > 1 ? 's' : ''}</strong></p>,
  `Are you sure you want to permanently remove ${d > 1 ? 'these PDRS?' : 'this PDR?'}`
];

export const enableRules = (d) => [
  <p>You have submitted the following request:</p>,
  <p><strong>Enable {d} Rule{d > 1 ? 's' : ''}</strong></p>,
  `Are you sure you want to enable ${d > 1 ? 'these rules?' : 'this rule?'}`
];

export const disableRules = (d) => [
  <p>You have submitted the following request:</p>,
  <p><strong>Disable {d} Rule{d > 1 ? 's' : ''}</strong></p>,
  `Are you sure you want to disable ${d > 1 ? 'these rules?' : 'this rule?'}`
];

export const deleteRules = (d) => [
  <Alert variant="warning"><strong>Warning:</strong> This action can not be reversed once you submit it.</Alert>,
  <p>You have submitted the following request:</p>,
  <p><strong>Delete {d} Rule{d > 1 ? 's' : ''}</strong></p>,
  `Are you sure you want to permanently delete ${d > 1 ? 'these rules?' : 'this rule?'}`
];
/* End of Modal Text */

export const buildRedirectUrl = ({ origin, pathname, hash }) => {
  const hasQuery = hash.indexOf('?');

  if (hasQuery !== -1) {
    // TODO [MHS, 2020-04-04] Fix with the test changes.
    // const hashPrefix = hash.substr(0, hash.indexOf('/') + 1);
    const baseHash = hash.substr(hash.indexOf('/') + 1);
    const parsedUrl = new URL(baseHash, origin);
    // Remove any ?token query parameter to avoid polluting the login link
    parsedUrl.searchParams.delete('token');
    return encodeURIComponent(parsedUrl.href);
  }
  return encodeURIComponent(new URL(pathname + hash, origin).href);
};
