export default function reducer(state = {}, action) {
  switch (action.type) {
    case `GET_LICENSES`: return Object.assign({}, state, {
      licenses: action.payload
    });
    case `UPDATE_LICENSE`: let licenseCopy = [];
      licenseCopy = licenseCopy.concat(state.licenses);
      for (let i = 0; i < state.licenses.length; i++) {
        if (state.licenses[i]._id === action.payload.id) {
          state.licenses[i][action.payload.name] = action.payload.value;
        }
      }
      return Object.assign({}, state, {
        licenses: licenseCopy
      });
    case `ADD_LICENSE`: const newLicense = {
      _id: action.payload,
      name: ``,
      reduction: ``,
      sum: ``,
      description: ``};
      let stateCopy = [];
      stateCopy = stateCopy.concat(state.licenses);
      stateCopy.unshift(newLicense);
      return Object.assign({}, state, {
        licenses: stateCopy
      });
    case `DELETE_LICENSE`: let copyLicenseList = [];
      copyLicenseList = copyLicenseList.concat(state.licenses);
      for (let i = 0; i < copyLicenseList.length; i++) {
        if (copyLicenseList[i]._id === action.payload) {
          copyLicenseList.splice(i, 1);
        }
      }
      return Object.assign({}, state, {
        licenses: copyLicenseList
      });
  }
  return state;
}
