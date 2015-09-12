import {expect} from 'chai';
import strategy from '../src/yupValidationStrategy';

describe('Yup Validator', function() {
  it('ensure exports function', function() {
    expect(typeof strategy === 'function').to.equal(true);
  });
});
