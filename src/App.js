import React, { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import Mustache from 'mustache'; // Import Mustache library
import './App.css';
import Modal from './components/Modal'; // Import the Modal component

function App() {
  const [template, setTemplate] = useState('');
  const [attributeInput, setAttributeInput] = useState('');
  const [prefix, setPrefix] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility
  const [prevValidationResult, setPrevValidationResult] = useState(null); // State to track the previous validation result

  // Function to parse attributes input and return as an object
  const parseAttributes = () => {
    const attributes = attributeInput
      .split(/[\n,]+/) // Split by new lines or commas
      .map((attr) => attr.trim()) // Trim spaces
      .filter((attr) => attr.length > 0); // Remove empty strings

    const attributeObject = {};
    attributes.forEach((attr) => {
      attributeObject[`${prefix}${attr}`] = `value_of_${attr}`;
    });
    return attributeObject;
  };

  // Function to validate the template using Mustache
  const validateTemplate = () => {
    const data = parseAttributes();
    try {
      // Render the template with the data
      Mustache.render(template, data);

      // Extract Mustache placeholders
      const templatePlaceholders = extractMustachePlaceholders(template);

      // Check if all placeholders are matched by rendered output
      const unmatchedAttributes = templatePlaceholders.filter(
        (placeholder) => !Object.keys(data).includes(placeholder)
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
    } catch (error) {
      setValidationResult({
        isValid: false,
        unmatched: [error.message],
      });
    }
  };

  // Function to extract Mustache placeholders
  const extractMustachePlaceholders = (template) => {
    // Updated regex to support dot and bracket notation
    const regex = /{{\s*([\w.]+(?:\[[\w.]+\])*)\s*}}/g;
    let match;
    const placeholders = [];
    while ((match = regex.exec(template)) !== null) {
      placeholders.push(match[1]);
    }
    return placeholders;
  };

  // Effect to handle showing the modal on validation state changes
  useEffect(() => {
    // Check if the validationResult is different from the previous one
    if (
      validationResult !== null &&
      prevValidationResult !== null &&
      validationResult.isValid !== prevValidationResult.isValid
    ) {
      setShowModal(true);
    }

    // Update the previous validation result
    setPrevValidationResult(validationResult);
  }, [validationResult, prevValidationResult]);

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
        <button onClick={validateTemplate} className="validate-button">
          Validate
        </button>
        {validationResult && (
          <span className={`status-message ${validationResult.isValid ? 'valid' : 'invalid'}`}>
            {validationResult.isValid ? 'The template is valid!' : `Invalid Template! Unmatched Attributes: ${validationResult.unmatched.join(', ')}`}
          </span>
        )}
      </div>
      {/* Modal for Alert */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={validationResult?.isValid ? "Validation Success" : "Validation Error"}
        isValid={validationResult?.isValid}
      >
        <div>
          {validationResult?.isValid ? (
            <div style={{ color: 'green' }}>
              <img src="https://img.icons8.com/color/48/000000/checkmark--v1.png" alt="Success Icon" style={{ width: '50px', marginBottom: '10px' }} />
              <p>The template is valid!</p>
            </div>
          ) : (
            <div style={{ color: 'red' }}>
              <img src="https://img.icons8.com/ios/50/000000/error--v1.png" alt="Error Icon" style={{ width: '50px', marginBottom: '10px' }} />
              <p>Invalid Template! Unmatched Attributes: {validationResult?.unmatched.join(', ')}</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default App;
