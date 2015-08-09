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

  it('should not lowercase first letter if next letter is also uppercase', () => {
    proto = forge({
      getXValue() {}
    });
    expect(proto).to.have.property('XValue');
  });
});

describe('constant', () => {
  let proto;
  it('should be added as not configurable', () => {
    proto = forge({
      CONSTANT: 'value'
    });
    expect(() => {
      delete proto.CONSTANT;
    }).to.throw();
  });
  it('should be added as not writable', () => {
    proto = forge({
      CONSTANT: 'value'
    });
    expect(() => {
      proto.CONSTANT = null;
    }).to.throw();
  })
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

describe('extending proto', () => {

  beforeEach(function () {
    this.proto1 = forge({
      _id: 1,
      value: 1,
      getName() { return '1'; },
      data: null,
      CONST: 'proto1',
      ONE: true
    });
    this.proto2 = forge({
      _id: 2,
      value: 2,
      name: '2',
      meta: null,
      CONST: 'proto2',
      TWO: true
    }, this.proto1);
    this.proto3 = forge({
      CONST: 'proto3',
      THREE: true
    }, this.proto2);
  });

  it('should skip not enumerable and not configurable/writable properties', function () {
    expect(this.proto2).to.have.property('_id', 2); // not reassigned by proto1
    expect(this.proto3).to.not.have.property('_id'); // not assigned form proto2
  });

  it('should assign not writable properties but not reassign them', function () {
    expect(this.proto2).to.have.property('CONST', 'proto2'); // not reassigned by proto1
    expect(this.proto3).to.have.property('CONST', 'proto3'); // not reassigned by proto2

    expect(this.proto2).to.have.property('ONE', true); // assigned
    expect(this.proto3).to.have.property('ONE', true); // assigned
  });

  it('should overwrite enumerable and configurable properties with the same name', function () {
    expect(this.proto2).to.have.property('value', 1);
    expect(this.proto2).to.have.property('name', '1');
    expect(this.proto2).to.have.property('data', null);
    expect(this.proto2).to.have.property('meta', null);
  });

});
