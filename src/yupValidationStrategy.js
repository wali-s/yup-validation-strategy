import yup from 'yup';
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
      yupSchema.validate(data, validationOptions, (errors) => {
        const errorState = errors ?
          errors.inner.reduce((previousValue, {path, message}) => {
            return {...previousValue, ... {[path]: [message]}};
          }, {}) : {};
        Object.keys(data).forEach((formItem) => {
          errorState[formItem] = errorState[formItem] || [];
        });
        callback(errorState);
      });
    }
  };
};
