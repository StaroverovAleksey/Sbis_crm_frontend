import filters from "../filters";

export default function reducer(state = {income: 0}, action) {
  switch (action.type) {
    case `GET_DATA`: return Object.assign({}, state, {
      serverData: action.payload
    });
    case `SET_INCOME`: return Object.assign({}, state, {
      income: action.payload
    });
    case `REDACT_INCOME`: return Object.assign({}, state, {
      income: state.income + action.payload
    });
    case `SET_COST_LIGHT`: let serverDataCopy = [];
      serverDataCopy = serverDataCopy.concat(state.serverData);
      for (let i = 0; i < serverDataCopy.length; i++) {
        if (serverDataCopy[i]._id === action.payload.id) {
          serverDataCopy[i][action.payload.name] = action.payload.value;
        } else {
          for (let j = 0; j < serverDataCopy[i].links.length; j++) {
            if (serverDataCopy[i].links[j]._id === action.payload.id) {
              serverDataCopy[i].links[j][action.payload.name] = action.payload.value;
            }
          }
        }
      }
      return Object.assign({}, state, {
        serverData: serverDataCopy
      });
    case `DELETE_TOKEN`: return state;
    case `DELETE_DATA`: return Object.assign({}, state, {
      serverData: null
    });
    case `ADD_OBJECT`: let dataCopy = [];
      dataCopy = dataCopy.concat(state.serverData);
      dataCopy.unshift(action.payload);
      return Object.assign({}, state, {
        serverData: dataCopy
      });
    case `REMOVE_OBJECT`: let arrayCopy = [];
      arrayCopy = arrayCopy.concat(state.serverData);
      for (let i = 0; i < arrayCopy.length; i++) {
        if (arrayCopy[i]._id === action.payload) {
          arrayCopy.splice(i, 1);
        }
      }
      return Object.assign({}, state, {
        serverData: arrayCopy
      });
    case `ADD_CLIENT`: const newClient = {
      _id: action.payload,
      inn: ``,
      name: ``,
      date: ``,
      payment: `none`,
      dateColor: `none`,
      comments: [],
      rtp: `5`,
      tenzor: `10`,
      tax: `15`,
      contacts: [],
      licenses: [],
      links: [],
      chief: `true`,
      served: `candidate`};
      let stateCopy = [];
      stateCopy = stateCopy.concat(state.serverData);
      stateCopy.unshift(newClient);
      return Object.assign({}, state, {
        serverData: stateCopy
      });
    case `SEARCH`:
      if (action.payload.length === 0) {
        return Object.assign({}, state, {
          filterActive: false
        });
      } else {
        let searchResult = state.serverData;
        for (let i of action.payload) {
          switch (i.name) {
            case `search`:
              searchResult = filters.search(searchResult, i.value);
              break;
            case `licenses`:
              searchResult = filters.licenses(searchResult, i.value);
              break;
            case `months`:
              searchResult = filters.months(searchResult, i.value);
          }
        }
        return Object.assign({}, state, {
          search: searchResult,
          filterActive: true
        });
      }
  }
  return state;
}
