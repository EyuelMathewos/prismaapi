const _ = require("lodash");

export function selectedFields(fields ? : any, ALL_FIELDS ? : any) {
  let newFields: any = {};
  for (const key in fields) {
    let name = fields[key];
    if (typeof name == 'string') {
      newFields[name] = true;
    } else {
      newFields = {};
      for (const key in ALL_FIELDS) {
        let name = ALL_FIELDS[key];
        if (typeof name == 'string') {
          newFields[name] = true;
        }
      }
    }
  };
  return newFields;
};
export function pickFields(listdata: Array<object>, value: any) {
  let newList: Array<object> = [];
  for (const key in listdata) {
    let element = listdata[key];
    let newElement = _.pickBy(element, function (value: object, key: any) {
      if (key == "fields" || key == "conditions") {
        return !(_.isEqual(value, []) || _.isEqual(value, {}) || value === undefined);
      }
      return true;
    })
    newList.push(newElement);
  }
  return newList;
}