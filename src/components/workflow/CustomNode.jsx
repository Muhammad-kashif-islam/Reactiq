// components/CustomNode.jsx
import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

const CustomNode = ({ data }) => {
  const [prompt, setPrompt] = useState(data.prompt || '');

  const handleChange = (event) => {
    setPrompt(event.target.value);
    data.onChange(event.target.value);
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <Handle type="target" position={Position.Top} />
      <input
        type="text"
        value={prompt}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        placeholder="Enter prompt"
      />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomNode;
