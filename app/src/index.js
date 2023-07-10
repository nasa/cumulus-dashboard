import React from 'react';
import ReactDOM from 'react-dom';

import './css/main.scss';
import './public/favicon.ico';

import App from './js/App';

if (process.env.NODE_ENV !== 'production') {
  import('@axe-core/react')
    .then((axe) => {
      try {
        axe.default(React, ReactDOM, 1000);
      } catch (error) {
        console.log('***Warning - @axe-core/react threw error and did not start');
      }
      return null;
    });
}

ReactDOM.render(<App />, document.getElementById('site-canvas'));
