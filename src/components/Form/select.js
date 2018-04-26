import React from 'react';
import PropTypes from 'prop-types';


const Select = ({ config }) => {
  const {
    field,
    onChange,
    value,
    options,
    multiple,
    error,
  } = config;
  return (
    <div className="form-group">
      {field.label && <label className="label-top">{field.label}</label>}
      <select id={field.name} name={field.name} className="form-control form-control-top" onChange={onChange} value={value} multiple={multiple}>
        <option value="">{field.defaultOption}</option>
        {options.map((option, index) => <option key={index} value={option}>{option}</option>)}
      </select>
      {error && <small>{error}</small>}
    </div>
  );
};

Select.propTypes = {
  config: PropTypes.object.isRequired,
};

export default Select;
