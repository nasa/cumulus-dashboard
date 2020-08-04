/* eslint-disable import/no-cycle */

import React from 'react';
import moment from 'moment';
import numeral from 'numeral';
import { Link } from 'react-router-dom';
import { getPersistentQueryParams } from './url-helper';

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

export const collectionSearchResult = (collection) => {
  const { name, version } = collection;
  return (
    <li key={name}>
      <Link
        to={(location) => ({
          pathname: `collections/collection/${name}/${version}`,
          search: getPersistentQueryParams(location),
        })}
      >
        {name} / {version}
      </Link>
    </li>
  );
};

export const granuleSearchResult = (granule) => {
  const { granuleId, status } = granule;
  return (
    <li key={granuleId}>
      <Link
        to={(location) => ({
          pathname: `granules/granules/${granuleId}/${status}`,
          search: getPersistentQueryParams(location),
        })}
      >
        {granuleId} / {status}
      </Link>
    </li>
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
  return `${string.slice(0, to)}... Show More`;
};

export const getFormattedCollectionId = (collection) => {
  const collectionId = getCollectionId(collection);
  return formatCollectionId(collectionId);
};

export const formatCollectionId = (collectionId) => (collectionId === undefined ? nullValue : collectionId);

export const getCollectionId = (collection) => {
  if (collection && collection.name && collection.version) {
    return `${collection.name}___${collection.version}`;
  }
};

// "MYD13A1___006" => "MYD13A1 / 006"
export const collectionName = (collectionId) => {
  if (!collectionId) return nullValue;
  return collectionId.split('___').join(' / ');
};

export const collectionNameVersion = (collectionId) => {
  if (!collectionId) return nullValue;
  const [name, version] = collectionId.split('___');
  return { name, version };
};

export const constructCollectionNameVersion = (name, version) => `${name}___${version}`;

/**
 * Returns the name and version of a collection based on
 * the collectionId used in elasticsearch indexing
 *
 * @param {string} collectionId - collectionId used in elasticsearch index
 * @returns {Object} name and version as object
 */
export const deconstructCollectionId = (collectionId) => {
  const [name, version] = collectionId.split('___');
  return {
    name,
    version,
  };
};

export const collectionLink = (collectionId) => {
  if (!collectionId || collectionId === nullValue) return nullValue;
  const { name, version } = collectionNameVersion(collectionId);
  return (
    <Link
      to={(location) => ({
        pathname: `/collections/collection/${name}/${version}`,
        search: getPersistentQueryParams(location),
      })}
    >
      {collectionName(collectionId)}
    </Link>
  );
};

export const collectionHref = (collectionId) => {
  if (!collectionId) return nullValue;
  const { name, version } = collectionNameVersion(collectionId);
  return `/collections/collection/${name}/${version}`;
};

export const enableText = (name) => `You are enabling rule ${name}`;

export const enableConfirm = (name) => `Rule ${name} was enabled`;

export const disableText = (name) => `You are disabling rule ${name}`;

export const disableConfirm = (name) => `Rule ${name} was disabled`;

export const deleteText = (name) => `Are you sure you want to permanently delete ${name}?`;

export const rerunText = (name) => `Are you sure you want to rerun ${name}?`;

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
