// components/WorkflowEditor.jsx
import React, { useState, useCallback, useMemo } from 'react';
import { ReactFlow, addEdge, applyNodeChanges, applyEdgeChanges, Position } from '@xyflow/react';
import CustomNode from '../../components/workflow/CustomNode';
import '@xyflow/react/dist/style.css';
const initialNodes = [
  { id: '1', type: 'custom', position: { x: 100, y: 100 }, data: { prompt: '', onChange: () => {} } },
  { id: '2', type: 'custom', position: { x: 300, y: 100 }, data: { prompt: '', onChange: () => {} } },
];

const initialEdges = [];

const FlowChart = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), []);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      style={{ width: '100%', height: '500px' }}
    />
</div>

  );
};
export default FlowChart;
