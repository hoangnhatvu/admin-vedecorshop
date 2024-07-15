import React, { ChangeEvent } from "react";

interface DatePickerProps {
  className?: string;
  required?: boolean;
  selectedDate?: string;
  name?: string;
  id?: string;
  register?: any;
  message?: string;
  handleChange?(event: ChangeEvent<HTMLInputElement>): void;
}
const DatePicker = ({
  className,
  required,
  name,
  id,
  selectedDate,
  register,
  message,
  handleChange,
}: DatePickerProps) => {
  return (
    <div className={`flex flex-col items-start relative ${className}`}>
      <div>
        <input
          type="date"
          name={name}
          {...register}
          id={id}
          className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight"
          required={required}
          value={selectedDate}
          onChange={handleChange}
        />
      </div>
      <div
        style={{
          color: "red",
          fontSize: "11px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {message}
      </div>
    </div>
  );
};
export default DatePicker;
