import {assign} from "object-assign";

const ENUMERABLE_RX = /^_/;
const ACCESSOR_RX = /^_?(set|get)([A-Z].+)/;

let firstLetterToLowerCase = (string) => {
  let str = String(string);
  return str[0].toLowerCase() + str.slice(1);
};

export function forge(prototype = {}, ...implement) {

  let proto = Object.create(prototype);
  let props = Object.getOwnPropertyNames(prototype);

  let descriptors = props.reduce((result, propertyName) => {
    let accessor = propertyName.match(ACCESSOR_RX);
    let enumerable = !propertyName.match(ENUMERABLE_RX);

    if (accessor) {
      let generatedPropertyName = firstLetterToLowerCase(accessor[2]);

      result[generatedPropertyName] = result[generatedPropertyName] || {
          enumerable: enumerable,
          configurable: false
        };
      result[generatedPropertyName][accessor[1]] = proto[propertyName];
    } else {
      result[propertyName] = {
        enumerable: enumerable,
        writable: true,
        value: proto[propertyName]
      };
    }

    return result;
  }, {});

  Object.defineProperties(proto, descriptors);
  implement.forEach(i => assign(proto, i));

  return proto;
}
