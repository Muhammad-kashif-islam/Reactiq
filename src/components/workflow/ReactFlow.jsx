"use client"
import React, { useCallback, useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Panel,
  Handle,
  ReactFlowProvider,
  useKeyPress,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const CustomNode = ({ id, data, selected }) => {
  console.log('Node data:', data);
  const [contentType, setContentType] = useState(data.contentType || 'prompt');
  const [promptContent, setPromptContent] = useState(data.promptContent || '');
  const [exactContent, setExactContent] = useState(data.exactContent || '');
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const selectOption = (value) => {
    setContentType(value);
    updateNodeData({ contentType: value });
    setIsDropdownOpen(false);
  };

  const { setNodes } = useReactFlow();

  const handleContentChange = (e) => {
    const value = e.target.value;
    if (contentType === 'prompt') {
      setPromptContent(value);
    } else {
      setExactContent(value);
    }

    updateNodeData(contentType === 'prompt' ? { promptContent: value } : { exactContent: value });
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    updateNodeData({ phoneNumber: value });
  };

  const updateNodeData = (newData) => {
    setNodes(nodes => nodes.map(node => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            ...newData,
            contentType,
            nodeType: node.data.nodeType || 'custom'
          }
        };
      }
      return node;
    }));
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setContentType(value);
    updateNodeData({ contentType: value });
  };

  const renderContent = () => {
    switch (data.nodeType) {
      case 'transfer':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="+[country code][number]"
              pattern="^\+[1-9]\d{1,14}$"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <small className="text-xs text-gray-500">Format: +[country code][number] (e.g., +1234567890)</small>
          </div>
        );
      case 'hangup':
        return (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">Call will be ended here</p>
          </div>
        );
        case 'start':
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm font-medium text-gray-700">
              {data.label || 'Start'}
            </p>
          </div>
        );
      default:
        return (
          <textarea
            className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary resize-y"
            value={contentType === 'prompt' ? promptContent : exactContent}
            onChange={handleContentChange}
            placeholder={`Enter ${contentType} content...`}
          />
        );
    }
  };

  const getNodeContainerClasses = () => {
    const baseClasses = "rounded-xl shadow-md p-4 w-80 transition-all duration-200";
    const selectedClasses = selected ? "ring-2 ring-offset-2" : "";
    
    switch(data.nodeType) {
      case 'transfer':
        return `${baseClasses} ${selectedClasses} bg-green-50 border border-green-200 ring-green-300`;
      case 'hangup':
        return `${baseClasses} ${selectedClasses} bg-red-50 border border-red-200 ring-red-300`;
        case 'start':
          return `${baseClasses} ${selectedClasses} bg-blue-50 border border-blue-200 ring-blue-300 w-[120px] h-[60px]`;
      default:
        return `${baseClasses} ${selectedClasses} bg-white border border-gray-200 ring-gray-300`;
    }
  };

  return (
    <div className={getNodeContainerClasses()}>

      
      {data.nodeType === 'custom' && (
        <div className="flex items-center mb-3">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </div>
          <p className='text-blue-600 font-medium mr-5'>Say</p>
          <div className="flex-1 relative">
            <button
              onClick={toggleDropdown}
              className="w-full flex items-center justify-between text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-gray-50"
            >
              <span className="capitalize">{contentType}</span>
              <svg
                className={`w-4 h-4 ml-2 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 ring-1 ring-gray-200 ring-opacity-5 focus:outline-none">
                <button
                  onClick={() => selectOption('prompt')}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center ${contentType === 'prompt' ? 'bg-blue-50 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Prompt
                </button>
                <button
                  onClick={() => selectOption('exact')}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center ${contentType === 'exact' ? 'bg-blue-50 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Exact
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {data.nodeType === 'transfer' && (
        <div className="flex items-center mb-3">
          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-green-800">Transfer Call</h3>
        </div>
      )}
      
      {renderContent()}
      
      {data.nodeType !== 'hangup' && (
        <Handle 
          type="source" 
          position="bottom" 
          className="!w-3 !h-3 !bg-primary !border-2 !border-white" 
        />
      )}
      <Handle 
        type="target" 
        position="top" 
        className="!w-3 !h-3 !bg-primary !border-2 !border-white" 
      />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
  input:CustomNode
};

const initialNodes = [
  {
    id: 'start',
    type: 'custom',
    position: { x: window.innerWidth / 2 - 100, y: 50 }, 
    data: { 
      nodeType: 'start',
      label: 'Start' ,
    style: {
      width: '120px', 
      height: '60px' 
    }
  }
}
];
const initialEdges = [];

const ReactFlowComponent = forwardRef(({ initialFlow }, ref) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowInstance = useReactFlow();
  const [selectedElements, setSelectedElements] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const deleteKeyPressed = useKeyPress(['Delete', 'Backspace']);
  const flowWrapperRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      reactFlowInstance.fitView({ padding: 0.5 });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [reactFlowInstance]);
  const onSelectionChange = useCallback(({ nodes, edges }) => {
    setSelectedElements([...nodes, ...edges]);
  }, []);
  useEffect(() => {
    if (initialFlow) {
      setNodes(initialFlow.nodes);
      setEdges(initialFlow.edges);
    }
  }, [initialFlow, setNodes, setEdges]);
  // Handle context menu
  const onPaneClick = useCallback(() => setContextMenu(null), []);
  const onNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault();
      setContextMenu({
        id: node.id,
        top: event.clientY,
        left: event.clientX,
        type: 'node',
      });
    },
    []
  );

  const onEdgeContextMenu = useCallback(
    (event, edge) => {
      event.preventDefault();
      setContextMenu({
        id: edge.id,
        top: event.clientY,
        left: event.clientX,
        type: 'edge',
      });
    },
    []
  );

  useEffect(() => {
    if (deleteKeyPressed && selectedElements.length > 0) {
      handleDelete();
    }
  }, [deleteKeyPressed, selectedElements]);

  const onNodesChangeMod = useCallback(
    (changes) => {
      const filteredChanges = changes.filter(change => {
        if (change.type === 'remove') {
          const node = nodes.find(n => n.id === change.id);
          return node?.data?.nodeType !== 'start';
        }
        return true;
      });
      
      onNodesChange(filteredChanges);
    },
    [nodes, onNodesChange]
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true }, eds)),
    [setEdges]
  );

  const handleDelete = useCallback((id = null) => {
    setNodes((nds) => {
      if (id) {
        return nds.filter((node) => {
          if (node.id === id) {
            const element = document.querySelector(`[data-id="${node.id}"]`);
            if (element) {
              element.classList.add('node-deleting');
              setTimeout(() => element.remove(), 300);
            }
            return false;
          }
          return true;
        });
      }
      
      return nds.filter((node) => {
        const isSelected = selectedElements.some(el => el.id === node.id);
        if (isSelected && node.data?.nodeType !== 'start') {
          const element = document.querySelector(`[data-id="${node.id}"]`);
          if (element) {
            element.classList.add('node-deleting');
            setTimeout(() => element.remove(), 300);
          }
          return false;
        }
        return true;
      });
    });

    setEdges((eds) => {
      if (id) {
        return eds.filter((edge) => {
          if (edge.source === id || edge.target === id) {
            const element = document.querySelector(`[data-id="${edge.id}"]`);
            if (element) {
              element.classList.add('edge-deleting');
              setTimeout(() => element.remove(), 300);
            }
            return false;
          }
          return true;
        });
      }
      
      return eds.filter((edge) => {
        const isSelected = selectedElements.some(el => el.id === edge.id);
        if (isSelected) {
          const element = document.querySelector(`[data-id="${edge.id}"]`);
          if (element) {
            element.classList.add('edge-deleting');
            setTimeout(() => element.remove(), 300);
          }
          return false;
        }
        return true;
      });
    });

    setSelectedElements([]);
    setContextMenu(null);
  }, [selectedElements]);

  const addNode = useCallback((type = 'custom') => {
    const lastNode = nodes[nodes.length - 1];
    const lastNodePosition = lastNode ? lastNode.position : { x: 0, y: 0 };
    
    const newNode = {
      id: `${Date.now()}`,
      type: 'custom',
      position: { 
        x: lastNodePosition.x + 100,
        y: lastNodePosition.y + 150
      },
      data: { 
        promptContent: '',
        exactContent: '',
        phoneNumber: '',
        contentType: 'prompt',
        nodeType: type
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [nodes, setNodes]);

  const saveFlowToLocal = useCallback(() => {
    const flowData = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          promptContent: node.data.promptContent || '',
          exactContent: node.data.exactContent || '',
          phoneNumber: node.data.phoneNumber || '',
          contentType: node.data.contentType || 'prompt',
          nodeType: node.data.nodeType || 'custom'
        }
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type
      }))
    };
    localStorage.setItem('flowData', JSON.stringify(flowData));
    return flowData;
  }, [nodes, edges]);

  const loadFlowFromLocal = useCallback(() => {
    const savedFlow = localStorage.getItem('flowData');
    if (savedFlow) {
      try {
        const flowData = JSON.parse(savedFlow);
        const hasStartNode = flowData.nodes.some((n) => n.data?.nodeType === 'start');
        if (!hasStartNode) {
          flowData.nodes.unshift(initialNodes[0]);
        }
        setNodes(flowData.nodes || [initialNodes[0]]);
        setEdges(flowData.edges || []);
      } catch (error) {
        console.error('Error parsing saved flow:', error);
      }
    }
  }, [setNodes, setEdges]);

  useEffect(() => {
    loadFlowFromLocal();
  }, [loadFlowFromLocal]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .node-deleting {
        transform: scale(0.9);
        opacity: 0;
        transition: transform 0.2s ease, opacity 0.2s ease;
      }
      .edge-deleting path {
        stroke-dasharray: 10;
        stroke-dashoffset: 100;
        animation: dash 0.3s linear forwards;
      }
      @keyframes dash {
        to {
          stroke-dashoffset: 0;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useImperativeHandle(ref, () => ({
    addNode,
    saveFlowToLocal
  }));

  return (
    <div className="w-full h-full bg-gray-100 relative" ref={flowWrapperRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeMod}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        nodeTypes={nodeTypes}
        connectionRadius={30}
        defaultEdgeOptions={{ 
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#555', strokeWidth: 2 }
        }}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        deleteKeyCode={null} // We handle deletion ourselves
        fitView={false}
        fitViewOptions={{ padding: 0.5 }}
        defaultViewport={{ x: -50, y: 0, zoom: 0.6 }}
      >
        <Controls className="bg-white rounded-lg shadow-md border border-gray-200" />
        <MiniMap 
          nodeStrokeWidth={3} 
          nodeColor={(node) => {
            if (node.type === 'input') return '#3b82f6';
            if (node.data?.nodeType === 'transfer') return '#10b981';
            if (node.data?.nodeType === 'hangup') return '#ef4444';
            return '#6366f1'
          }}
          maskColor="rgba(255, 255, 255, 0.6)"
          className="bg-white rounded-lg shadow-md border border-gray-200"
        />
        <Background 
          variant="dots" 
          gap={25} 
          size={1} 
          color="#393a3b"
          style={{ 
            backgroundColor: '#f8fafc',
            backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Context Menu */}
        {contextMenu && (
          <div
            className="fixed z-50 bg-white shadow-lg rounded-md py-1 w-40 border border-gray-200"
            style={{
              top: contextMenu.top,
              left: contextMenu.left,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
              onClick={() => {
                handleDelete(contextMenu.id);
              }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        )}

        {/* Selection Info Panel */}
       
      </ReactFlow>
    </div>
  );
});

ReactFlowComponent.displayName = 'ReactFlowComponent';

export { ReactFlowComponent };