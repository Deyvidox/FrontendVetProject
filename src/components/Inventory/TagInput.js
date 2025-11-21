// TagInput.jsx
import React, { useState } from 'react';
import { CFormInput, CButton, CBadge } from '@coreui/react';
import '../../css/Inventory/inventory.css';

// Props:
// tags: array de etiquetas actuales
// setTags: función para actualizar las etiquetas en el formulario
const TagInput = ({ tags, setTags }) => {
  const [input, setInput] = useState('');

  const addTag = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      setTags([...tags, input.trim()]);
      setInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      <div className="d-flex gap-2 mb-2">
        {tags.map((tag, idx) => (
          <CBadge color="info" key={idx} className="d-flex align-items-center">
            {tag}
            <span
              style={{ cursor: 'pointer', marginLeft: '5px' }}
              onClick={() => removeTag(tag)}
            >
              ×
            </span>
          </CBadge>
        ))}
      </div>
      <div className="d-flex gap-2">
        <CFormInput
          placeholder="Agregar tag"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
        />
        <CButton color="primary" onClick={addTag}>
          Agregar
        </CButton>
      </div>
    </div>
  );
};

export default TagInput;
