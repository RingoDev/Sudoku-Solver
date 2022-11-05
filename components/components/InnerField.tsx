import React from "react";

interface InnerFieldProps {
  value: number;
}

const InnerField: React.FC<InnerFieldProps> = ({ value }) => {
  return (
    <div className={"md:text-lg lg:text-lg xl:text-2xl 2xl:text-5xl"}>
      {value === 0 ? "" : value}
    </div>
  );
};
export default InnerField;
