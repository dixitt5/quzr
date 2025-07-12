import React, { useState, useRef, useEffect } from "react";
import "./TagFilterDropdown.css";

const TagFilterDropdown = ({ tags, selectedTags, onTagChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getButtonText = () => {
    if (selectedTags.length === 0) {
      return "Filter by tags";
    }
    if (selectedTags.length === 1) {
      return `1 tag selected`;
    }
    return `${selectedTags.length} tags selected`;
  };

  return (
    <div className="tag-filter-dropdown" ref={dropdownRef}>
      <button onClick={handleToggle} className="dropdown-toggle">
        {getButtonText()} <span className="arrow">{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {tags.map((tag) => (
            <label key={tag.id} className="dropdown-item">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag.name)}
                onChange={() => onTagChange(tag.name)}
              />
              {tag.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagFilterDropdown;
