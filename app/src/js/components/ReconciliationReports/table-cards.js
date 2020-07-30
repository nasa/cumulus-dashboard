import React from 'react';
import PropTypes from 'prop-types';

import { Card } from 'react-bootstrap';
import { displayCase } from '../../utils/format';

const conflictedCount = (tables) => tables.reduce((acc, cv) => acc + cv.data.length, 0);

const TableCards = ({ activeCard, config, onClick, titleCaption }) => {
  function handleCardClick(e, id) {
    e.preventDefault();
    if (typeof onClick === 'function') {
      onClick(e, id);
    }
  }

  return (
    <div className='table-card'>
      <div className="table-card--title-caption">{titleCaption}</div>
      <div className="card-wrapper">
        {config.map((item, index) => {
          let { id = index, name, tables, status = 'conflict' } = item;
          const count = conflictedCount(tables);
          if (count === 0) {
            status = 'passed';
          }
          return (
            <Card
              key={id}
              className={`text-center${activeCard === id ? ' active' : ''}`}
              onClick={(e) => handleCardClick(e, id)}
            >
              <Card.Header as="h5">{name}</Card.Header>
              <Card.Body>
                <Card.Title>{count}</Card.Title>
                <Card.Text>
                  <span
                    className={`status-indicator ${
                    status === 'passed'
                      ? 'status-indicator--success'
                      : 'status-indicator--failed'
                  }`}
                  ></span>
                  {displayCase(status)}
                </Card.Text>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

TableCards.propTypes = {
  activeCard: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  config: PropTypes.array,
  onClick: PropTypes.func,
  titleCaption: PropTypes.string,
};

export default TableCards;
