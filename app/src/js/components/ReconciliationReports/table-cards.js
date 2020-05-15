'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import { Card } from 'react-bootstrap';

const TableCards = ({
  config,
  onClick,
  activeCard
}) => {
  function handleCardClick (e, index) {
    e.preventDefault();
    if (typeof onClick === 'function') {
      onClick(e, index);
    }
  }

  return (
    <div className='card-wrapper'>
      {config.map((item, index) => {
        // TODO: once API is updated with status indicator, remove the default
        const { name, data, status = 'success' } = item;
        const count = data.length;
        if (!data || !count) {
          return null;
        }
        return (
          <Card key={index} className={`text-center${activeCard === index ? ' active' : ''}`} onClick={e => handleCardClick(e, index)}>
            <Card.Header as='h5'>{name}</Card.Header>
            <Card.Body>
              <Card.Title>{count}</Card.Title>
              <Card.Text>
                <span className={`status-indicator ${status === 'success' ? 'status-indicator--success' : 'status-indicator--failed'}`}></span>
                {status}
              </Card.Text>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

TableCards.propTypes = {
  config: PropTypes.array,
  onClick: PropTypes.func,
  activeCard: PropTypes.number
};

export default TableCards;
