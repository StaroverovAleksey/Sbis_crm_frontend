export default function reducer(state = {routing: `main`, filter: false}, action) {
  switch (action.type) {
    case `SET_TOKEN`: return Object.assign({}, state, {
      token: action.payload
    });
    case `CHANGE_ROUT`: return Object.assign({}, state, {
      routing: action.payload
    });
    case `DELETE_TOKEN`: return state;
    case `FILTER`: return Object.assign({}, state, {
      filter: action.payload
    });
  }
  return state;
}
