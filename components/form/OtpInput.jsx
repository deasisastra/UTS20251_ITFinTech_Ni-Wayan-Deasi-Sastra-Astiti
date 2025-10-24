import React from 'react';

const OtpInput = ({ value = '', onChange }) => {
  const handleChange = (e) => {
    // Only allow numbers and limit to 6 digits
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    if (newValue.length <= 6) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={6}
        value={value}
        onChange={handleChange}
        placeholder="Enter 6-digit code"
        className="w-64 h-14 text-center text-2xl font-bold border-2 rounded-lg
                  bg-white border-gray-300 focus:border-primary focus:outline-none
                  transition-colors duration-200"
      />
      <div className="text-sm text-gray-500">
        Enter or paste verification code
      </div>
    </div>
  );
};

export default OtpInput;