const _ = require("lodash");

export function selectedFields(fields ? : any) {
  let newFields: any = {};
  for (const key in fields) {
    let name = fields[key];
    if (typeof name == 'string') {
      newFields[name] = true;
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