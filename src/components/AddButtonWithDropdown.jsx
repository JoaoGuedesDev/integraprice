import React, { useState, useRef, useEffect } from 'react';

const AddButtonWithDropdown = ({ onSelect, suggestions, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSelect = (item) => {
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium flex items-center gap-2 transition-colors"
      >
        + {label}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 w-56 mt-1 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
              Sugestões Rápidas
            </div>
            {suggestions.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSelect(item)}
                className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900"
              >
                {item}
              </button>
            ))}
          </div>
          <div className="py-1">
            <button
              onClick={() => handleSelect('')}
              className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 italic"
            >
              + Outro / Em branco
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddButtonWithDropdown;
