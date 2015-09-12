import yup from 'yup';

export default yupOptions => {
  return {
    validate: function validate(data = {}, yupSchema = yup.object().shape({}), key, callback = () => {}) {
      const options = {
        abortEarly: false,
        stripUnknown: true,
        ...yupOptions
      };
      yupSchema.validate(data, options, (errors) => {
        const errorState = errors ?
          errors.inner.reduce((previousValue, currentValue) => {
            return {...previousValue, ...{
              [currentValue.path]: [currentValue.message]
            }};
          }, {})
        : {};
        Object.keys(data).forEach((formItem) => {
          errorState[formItem] = errorState[formItem] || [];
        });
        callback(errorState);
      });
    }
  };
};
