import React, { useRef } from "react";
import ReactSelect from "react-select";
import { useDispatch, useSelector } from "react-redux";

export const MultiSelect = (props) => {
  // isOptionSelected sees previous props.value after onChange
  const valueRef = useRef(props.value);
  valueRef.current = props.value;
  if (valueRef.current[0] === null) valueRef.current = [];

  const selectAllOption = {
    value: "<SELECT_ALL>",
    label: "Select All",
  };

  const isSelectAllSelected = () => {
    console.log(valueRef.current);
    return valueRef.current.length === props.options.length;
  };

  const isOptionSelected = (option) =>
    valueRef.current.some(({ value }) => value === option.value) ||
    isSelectAllSelected();

  const getOptions = () => [selectAllOption, ...props.options];

  const getValue = () =>
    isSelectAllSelected() ? [selectAllOption] : props.value;

  const onChange = (newValue, actionMeta) => {
    const { action, option, removedValue } = actionMeta;

    console.log(action);

    if (action === "select-option" && option.value === selectAllOption.value) {
      props.onChange(props.options, actionMeta);
    } else if (
      (action === "deselect-option" &&
        option.value === selectAllOption.value) ||
      (action === "remove-value" &&
        removedValue.value === selectAllOption.value)
    ) {
      props.onChange([], actionMeta);
    } else if (
      actionMeta.action === "deselect-option" &&
      isSelectAllSelected()
    ) {
      props.onChange(
        props.options.filter(({ value }) => value !== option.value),
        actionMeta
      );
    } else {
      props.onChange(newValue || [], actionMeta);
    }
  };

  return (
    <ReactSelect
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      menuPortalTarget={document.body}
      isMulti
      isClearable={true}
      placeholder={props.placeholder}
      name="colors"
      className="basic-multi-select"
      classNamePrefix="select"
      isOptionSelected={isOptionSelected}
      options={getOptions()}
      value={getValue()}
      onChange={onChange}
      hideSelectedOptions={false}
      closeMenuOnSelect={true}
    />
  );
};
