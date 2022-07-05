const _ = require("lodash");

export function selectedFields(fields ? : any) {
  const newFields: any = {};
  for (const key in fields) {
    const name = fields[key];
    if (typeof name == 'string') {
      newFields[name] = true;
    }
  }
  return newFields;
}
export function pickFields(listdata: Array<object>, value: any) {
  const newList: Array<object> = [];
  for (const key in listdata) {
    const element = listdata[key];
    const newElement = _.pickBy(element, function (value: object, key: any) {
      if (key == "fields" || key == "conditions") {
        return !(_.isEqual(value, []) || _.isEqual(value, {}) || value === undefined);
      }
      return true;
    })
    newList.push(newElement);
  }
  return newList;
}