import React, { useState, useRef, useEffect } from 'react';

const CostInputWithSuggestions = ({ value, onChange, placeholder, suggestions }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSelect = (suggestion) => {
    // Mimic the event object expected by the parent's onChange
    onChange({ target: { value: suggestion } });
    setShowSuggestions(false);
  };

  return (
    <div className="relative flex-1" ref={wrapperRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setShowSuggestions(true)}
        className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all"
      />
      
      {showSuggestions && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-xl mt-1 max-h-60 overflow-y-auto">
          <div className="sticky top-0 bg-gray-50 p-2 text-xs text-gray-500 uppercase font-bold tracking-wider border-b border-gray-100">
            Sugestões Rápidas (Clique para preencher)
          </div>
          {suggestions.map((item, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-50 last:border-0"
              onClick={() => handleSelect(item)}
              type="button" // Prevent form submission if inside a form
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CostInputWithSuggestions;
