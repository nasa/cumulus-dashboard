import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ErrorReport from './report';

class ErrorBoundary extends Component {
  constructor (props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError (_error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch (error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error,
      errorInfo
    });
    // You can also log the error to an error reporting service
    return (<ErrorReport />);
  }

  render () {
    const { error, errorInfo, hasError } = this.state;
    const children = this.props;

    if (hasError) {
      // Error path
      // You can render any custom fallback UI
      return (
        <div>
          <h1>Oops. We're sorry something went wrong.</h1>;
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {error && error.toString()}
            <br />
            {errorInfo.componentStack}
          </details>
        </div>
      );
    }
    // Just render children
    return children;
  }
}

ErrorBoundary.PropTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;
