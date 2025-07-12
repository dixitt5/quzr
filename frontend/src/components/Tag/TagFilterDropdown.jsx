import Select from "react-select";
import "./TagFilterDropdown.css";

const TagFilterDropdown = ({ tags, selectedTags, onTagChange }) => {
  // Convert tags to react-select format
  const tagOptions = [
    { value: null, label: "All Tags" },
    ...tags.map(tag => ({
      value: tag.name,
      label: tag.name
    }))
  ];

  // Get current selected value
  const selectedValue = selectedTags.length > 0 
    ? tagOptions.find(option => option.value === selectedTags[0])
    : tagOptions[0];

  // Handle selection change
  const handleChange = (selectedOption) => {
    if (selectedOption && selectedOption.value) {
      onTagChange(selectedOption.value);
    } else {
      // Clear all selected tags
      selectedTags.forEach(tag => onTagChange(tag));
    }
  };

  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'var(--background-primary)',
      border: `1px solid ${state.isFocused ? 'var(--primary-color)' : 'var(--border-medium)'}`,
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-xs)',
      minHeight: '48px',
      minWidth: '220px',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(26, 137, 23, 0.1)' : 'none',
      transition: 'all var(--transition-fast)',
      '&:hover': {
        borderColor: state.isFocused ? 'var(--primary-color)' : 'var(--border-dark)'
      }
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'var(--text-tertiary)',
      fontSize: 'var(--font-size-base)',
      fontWeight: 'var(--font-weight-medium)'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'var(--text-primary)',
      fontSize: 'var(--font-size-base)',
      fontWeight: 'var(--font-weight-medium)'
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'var(--background-primary)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 20,
      marginTop: 'var(--space-xs)'
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0,
      maxHeight: '300px'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? 'var(--primary-color)' 
        : state.isFocused 
          ? 'var(--background-secondary)' 
          : 'var(--background-primary)',
      color: state.isSelected 
        ? 'var(--background-primary)' 
        : 'var(--text-primary)',
      padding: 'var(--space-md)',
      cursor: 'pointer',
      fontSize: 'var(--font-size-sm)',
      fontWeight: state.isSelected ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
      transition: 'all var(--transition-fast)',
      '&:hover': {
        backgroundColor: state.isSelected 
          ? 'var(--primary-hover)' 
          : 'var(--background-secondary)'
      }
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: 'var(--text-secondary)',
      '&:hover': {
        color: 'var(--text-primary)'
      }
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: 'var(--text-tertiary)',
      '&:hover': {
        color: 'var(--error)'
      }
    })
  };

  return (
    <div className="tag-filter-dropdown-container">
      <Select
        options={tagOptions}
        value={selectedValue}
        onChange={handleChange}
        placeholder="Filter by tag"
        isClearable={false}
        isSearchable={true}
        styles={customStyles}
        className="tag-filter-select"
        classNamePrefix="tag-filter"
      />
    </div>
  );
};

export default TagFilterDropdown;
