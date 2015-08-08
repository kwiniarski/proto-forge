import {describe, it, beforeEach} from "mocha"
import {expect} from "chai"
import {forge} from "../src/proto-forge"

describe('underscored properties', () => {
  let proto;

  beforeEach(() => {
    proto = forge({_id:100});
  });

  it('should be not enumerable', () => {
    expect(proto.propertyIsEnumerable('_id')).to.be.falsy;
  });

  it('should be accessible', () => {
    expect(proto._id).to.equal(100);
  });
});

describe('accessor methods', () => {
  let data;
  let proto;

  beforeEach(() => {
    proto = forge({
      setName(value) {
        data = value.toLowerCase();
      },
      getName() {
        return data;
      }
    });
  });

  it('should be not enumerable', () => {
    expect(proto.propertyIsEnumerable('setName')).to.be.falsy;
    expect(proto.propertyIsEnumerable('getName')).to.be.falsy;
  });

  it('should create equivalent enumerable property', () => {
    expect(proto.propertyIsEnumerable('name')).to.be.true;
  });

  it('should be used when accessing generated property', () => {
    proto.name = 'TEST';
    expect(proto.name).to.equal('test');
  });
});

describe('duplicated properties in definitions', () => {
  it('should throw error', () => {
    expect(() => {
      forge({
        name: null,
        getName() {
          return 'test';
        }
      });
    }).to.throw();
  });
});
