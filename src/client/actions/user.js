import { getUser } from '../api';
import { getToken } from '../selectors';

export const LOAD_USER = 'LOAD_USER';
export const LOADED_USER = 'LOADED_USER';

export const loadUser = (id) => async (dispatch, getState) => {
  dispatch({ type: LOAD_USER });
  const state = getState();
  const token = getToken(state);
  try {
    const { data } = await getUser(token, id);
    dispatch({ type: LOADED_USER, data });
  } catch {}
};
