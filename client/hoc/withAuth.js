import React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'ramda';
import Auth from '../containers/Auth';
import { getAuth } from '../selectors';

const withAuth = Component => {
  const EnhancedComponent = props => (isEmpty(props.auth) ? <Auth /> : <Component {...props} />);
  const mapStateToProps = state => ({ auth: getAuth(state) });
  return connect(mapStateToProps)(EnhancedComponent);
};

export default withAuth;
