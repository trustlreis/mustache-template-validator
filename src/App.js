import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import './App.css';

function App() {
  const [template, setTemplate] = useState('');
  const [attributeInput, setAttributeInput] = useState('');
  const [prefix, setPrefix] = useState('');
  const [validationResult, setValidationResult] = useState(null);

  // Function to parse attributes input and return as an array
  const parseAttributes = () => {
    return attributeInput
      .split(/[\n,]+/) // Split by new lines or commas
      .map((attr) => attr.trim()) // Trim spaces
      .filter((attr) => attr.length > 0); // Remove empty strings
  };

  // Function to validate the template
  const validateTemplate = () => {
    const validAttributes = parseAttributes().map(attr => `${prefix}${attr}`); // Concatenate prefix

    // Extract Mustache placeholders
    const placeholders = extractMustachePlaceholders(template);

    // Compare placeholders with valid attributes
    const unmatchedAttributes = placeholders.filter(
      (placeholder) => !validAttributes.includes(placeholder)
    );

    if (unmatchedAttributes.length > 0) {
      setValidationResult({
        isValid: false,
        unmatched: unmatchedAttributes,
      });
    } else {
      setValidationResult({
        isValid: true,
        unmatched: [],
      });
    }
  };

  // Function to extract Mustache placeholders
  const extractMustachePlaceholders = (template) => {
    const regex = /{{\s*([\w\.]+)\s*}}/g;
    let match;
    const placeholders = [];
    while ((match = regex.exec(template)) !== null) {
      placeholders.push(match[1]);
    }
    return placeholders;
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Mustache Template Validator</h1>
        <input
          type="text"
          placeholder="Enter prefix..."
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          className="prefix-input"
        />
      </div>
      <div className="main-content">
        <textarea
          placeholder="Enter valid attributes here, separated by commas or new lines..."
          value={attributeInput}
          onChange={(e) => setAttributeInput(e.target.value)}
          rows="10"
          cols="30"
          className="attributes-input"
        />
        <div className="editor-container">
          <MonacoEditor
            height="100%"
            defaultLanguage="html"
            value={template}
            onChange={(value) => setTemplate(value || '')}
            options={{
              selectOnLineNumbers: true,
              automaticLayout: true,
              minimap: { enabled: false },
              scrollbar: {
                verticalScrollbarSize: 12,
                horizontalScrollbarSize: 12,
              },
              lineNumbers: 'on',
              fontSize: 14,
              wordWrap: 'on',
              wrappingIndent: 'same',
            }}
            data-testid="monaco-editor"
          />
        </div>
      </div>
      <div className="validation-result">
        <button onClick={validateTemplate}>Validate</button>
        {validationResult && (
          <div>
            {validationResult.isValid ? (
              <p style={{ color: 'green' }}>The template is valid!</p>
            ) : (
              <div>
                <p style={{ color: 'red' }}>Invalid Template!</p>
                <p>Unmatched Attributes: {validationResult.unmatched.join(', ')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
