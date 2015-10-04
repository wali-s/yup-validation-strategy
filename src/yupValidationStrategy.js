import yup from 'yup';
import set from 'lodash.set';
import isEmpty from 'lodash.isempty';
import { hydrate } from './utils';
import invariant from 'invariant';

export default yupOptions => {
  return {
    validate: function validate(data = {}, yupSchema = yup.object().shape({}), options = {}, callback) {
      invariant(typeof callback === 'function', 'yup-validation-strategy is asynchronous, a callback is expected: validate(data, schema, options, callback)');
      const {key, prevErrors = {}} = options;
      const validationOptions = {
        abortEarly: false,
        stripUnknown: true,
        ...yupOptions
      };
      yupSchema.validate(data, validationOptions, (yupResult) => {
        const errors = this.collectErrors(yupResult);
        if (key === undefined || key === null || isEmpty(errors)) {
          return callback(hydrate(errors));
        } else {
          return callback(set(prevErrors, key, errors[key]));
        }
      });
    },
    collectErrors: function(yupResult) {
      if (yupResult !== null) {
        return yupResult.inner.reduce((errors, {path, message}) => {
          return {...errors, [path]: [message]};
        }, {});
      } else {
        return {};
      }

    }
  };
};
