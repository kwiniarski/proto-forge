import assign from "object-assign";

const ENUMERABLE_RX = /^_/;
const ACCESSOR_RX = /^_?(set|get)([A-Z].+)/;
const CONSTANT_RX = /^_?[A-Z_][A-Z0-9_]+/;

let firstLetterToLowerCase = (string) => {
  let str = String(string);

  if (str.length > 1 && str[1].match(/[A-Z]/)) {
    return str;
  } else {
    return str[0].toLowerCase() + str.slice(1);
  }
};

export function forge(prototype = {}, ...implement) {

  let proto = Object.create(prototype);
  let props = Object.getOwnPropertyNames(prototype);

  let descriptors = props.reduce((result, propertyName) => {
    let accessor = propertyName.match(ACCESSOR_RX);
    let descriptor = {
      enumerable: propertyName.match(ENUMERABLE_RX) === null,
      configurable: propertyName.match(CONSTANT_RX) === null
    };

    if (accessor) {
      let generatedPropertyName = firstLetterToLowerCase(accessor[2]);

      result[generatedPropertyName] = result[generatedPropertyName] || descriptor;
      result[generatedPropertyName][accessor[1]] = proto[propertyName];
    } else {
      result[propertyName] = descriptor;
      result[propertyName].writable = propertyName.match(CONSTANT_RX) === null;
      result[propertyName].value = proto[propertyName];
    }

    return result;
  }, {});

  Object.defineProperties(proto, descriptors);
  implement.forEach(i => assign(proto, i));

  return proto;
}
