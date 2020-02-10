import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../actions';
import { getUser } from '../selectors';

export const useUser = () => {
  const dispatch = useDispatch();
  return {
    user: useSelector(getUser),
    loadUser: useCallback(id => dispatch(loadUser(id)), [dispatch]),
  };
};
