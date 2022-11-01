import React from "react";

interface InnerFieldProps {
  value: number;
}

const InnerField: React.FC<InnerFieldProps> = (props) => {
  const val = props.value;
  return <div>{val === 0 ? "" : val}</div>;
};
export default InnerField;
