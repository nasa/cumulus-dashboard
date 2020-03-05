'use strict';
import React from 'react';
import c from 'classnames';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { logout, getApiVersion, getCumulusInstanceMetadata } from '../../actions';
import { graphicsPath, nav } from '../../config';
import { window } from '../../utils/browser';
import { strings } from '../locale';
import { kibanaAllLogsLink } from '../../utils/kibana';

const paths = [
  ['PDRs', '/pdrs'],
  ['Providers', '/providers'],
  [strings.collections, '/collections'],
  [strings.granules, '/granules'],
  ['Workflows', '/workflows'],
  ['Executions', '/executions'],
  ['Operations', '/operations'],
  ['Rules', '/rules'],
  ['Logs', 'logs'],
  ['Reconciliation Reports', '/reconciliation-reports']
];

class Header extends React.Component {
  constructor () {
    super();
    this.displayName = 'Header';
    this.logout = this.logout.bind(this);
    this.className = this.className.bind(this);
    this.linkTo = this.linkTo.bind(this);
  }

  componentDidMount () {
    const { dispatch, api } = this.props;
    if (api.authenticated) dispatch(getApiVersion());
    dispatch(getCumulusInstanceMetadata());
  }

  logout () {
    const { dispatch } = this.props;
    dispatch(logout()).then(() => {
      if (window.location && window.location.reload) {
        window.location.reload();
      }
    });
  }

  className (path) {
    const active = this.props.location.pathname.slice(0, path.length) === path; // nav issue with router
    const menuItem = path.replace('/', '');
    const order = 'nav__order-' + (nav.order.indexOf(menuItem) === -1 ? 2 : nav.order.indexOf(menuItem));
    return c({
      'active': active,
      [order]: true
    });
  }

  linkTo (path) {
    if (path[0] === 'Logs') {
      const kibanaLink = kibanaAllLogsLink(this.props.cumulusInstance);
      return <a href={kibanaLink} target="_blank">{path[0]}</a>;
    } else {
      return <Link to={{pathname: path[1], search: this.props.location.search}}>{path[0]}</Link>;
    }
  }

  render () {
    const { authenticated } = this.props.api;
    const activePaths = paths.filter(path => nav.exclude[path[0]] !== true);
    const logoPath = graphicsPath.substr(-1) === '/' ? `${graphicsPath}${strings.logo}` : `${graphicsPath}/${strings.logo}`;
    return (
      <div className='header'>
        <div className='row'>
          <h1 className='logo'><Link to={{pathname: '/', search: this.props.location.search}}><img alt="Logo" src={logoPath} /></Link></h1>
          <nav>
            { !this.props.minimal ? <ul>
              {activePaths.map(path => <li
                key={path[0]}
                className={this.className(path[1])}>{this.linkTo(path)}</li>)}
              <li className='rightalign nav__order-8'>{ authenticated ? <a onClick={this.logout}><span className="log-icon"></span>Log out</a> : <Link to={'/login'}>Log in</Link> }</li>
            </ul> : <li>&nbsp;</li> }
          </nav>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  api: PropTypes.object,
  dispatch: PropTypes.func,
  location: PropTypes.object,
  minimal: PropTypes.bool,
  cumulusInstance: PropTypes.object
};

export default withRouter(Header);
