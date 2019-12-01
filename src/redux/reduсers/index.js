import {combineReducers} from 'redux';

import data from './data';
import user from './user';
import licenses from './license';

export default combineReducers({
  data,
  user,
  licenses
});
