// HOC router wrapper to replace withRouter that was removed in React Router v6
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return <Component {...props} router={{ location, navigate, params }} match={{ params }}/>;
  }

  return ComponentWithRouterProp;
}

export default withRouter;
