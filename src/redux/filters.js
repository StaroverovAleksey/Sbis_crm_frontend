const licenseRecursion = (object, data) => {
  for (let license of object.licenses) {
    for (let i of data) {
      if (license._id === i) {
        return true;
      }
    }
  }
  return null;
};
const dateParse = (date) => {
  return date.split(`.`)[1];
};
const monthsRecursion = (object, data) => {
  for (let i of data) {
    if (dateParse(object.date) === i) {
      return true;
    }
  }
  return null;
};

export default {
  search: (result, data) => {
    const searchArray = [];
    if (isNaN(data)) {
      for (let chief of result) {
        if (chief.name.indexOf(data) !== -1) {
          searchArray.push(chief);
        } else {
          for (let i = 0; i < chief.links.length; i++) {
            if (chief.links[i].name.indexOf(data) !== -1) {
              searchArray.push(chief);
              i = chief.links.length;
            }
          }
        }
      }
    } else {
      for (let chief of result) {
        if (chief.inn.indexOf(data) !== -1) {
          searchArray.push(chief);
        } else {
          for (let i = 0; i < chief.links.length; i++) {
            if (chief.links[i].inn.indexOf(data) !== -1) {
              searchArray.push(chief);
              i = chief.links.length;
            }
          }
        }
      }
    }
    return searchArray;
  },
  licenses: (result, data) => {
    const searchArray = [];
    for (let object of result) {
      if (licenseRecursion(object, data)) {
        searchArray.push(object);
      } else {
        for (let i = 0; i < object.links.length; i++) {
          if (licenseRecursion(object.links[i], data)) {
            searchArray.push(object);
            i = object.links.length;
          }
        }
      }
    }
    return searchArray;
  },
  months: (result, data) => {
    const searchArray = [];
    for (let object of result) {
      if (monthsRecursion(object, data)) {
        searchArray.push(object);
      } else {
        for (let i = 0; i < object.links.length; i++) {
          if (monthsRecursion(object.links[i], data)) {
            searchArray.push(object);
            i = object.links.length;
          }
        }
      }
    }
    return searchArray;
  }
};
