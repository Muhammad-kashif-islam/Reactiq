import { ReactFlowComponent } from "../../components/workflow/ReactFlow"
import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  MoreVertical, 
  MessageSquare, 
  Image, 
  Search, 
  Code, 
  FileText, 
  Plus,
  Save,
  X,
  Settings,
  ChevronDown,

} from 'lucide-react';
import { ReactFlowProvider } from '@xyflow/react';
import { PiWaveformLight } from 'react-icons/pi';

import { VscCallOutgoing } from 'react-icons/vsc';
import { FcEndCall } from 'react-icons/fc';
import { useCreateAssistant, useGetAssistant, useUpdateAssistant } from "../../hooks/assistant";
import { useNavigate  , useSearchParams} from "react-router";
const voiceOptions = [
  'Alloy',
  'Ash',
  'Ballad',
  'Coral',
  'Echo',
  'Fable',
  'Nova',
  'Onyx',
  'Sage',
  'Shimmer',
  'Verse'
];
const WorkFlow = () => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [promptText, setPromptText] = useState("Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.");
  const [title, setTitle] = useState("New Assistant")
  const [selectedVoice, setSelectedVoice] = useState('Alloy');
  const [isVoiceDropdownOpen, setIsVoiceDropdownOpen] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [flowData, setFlowData] = useState(null);
  const reactFlowRef = useRef(null);
  const navigate = useNavigate()
    const [searchParam] = useSearchParams()
  
  const assistantId = searchParam.get("id")
  console.log("assistantId",assistantId);
  const { mutateAsync : createAssistant, isPending } = useCreateAssistant();
  const { mutateAsync: updateAssistant } = useUpdateAssistant();
  const { data: AssistantData , isLoading: IsAssistantLoading} = useGetAssistant(assistantId);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1024) {
        setIsLeftSidebarOpen(false);
        setIsRightSidebarOpen(false);
      }
      localStorage.removeItem("flowData")
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    if(!assistantId){
      localStorage.removeItem("flowData") 
      setFlowData(null);
    }
    if (assistantId && !IsAssistantLoading && AssistantData) {
      setPromptText(AssistantData.workflow.customPrompt)
      setSelectedVoice(AssistantData.voice)
      
      const wf = {
        nodes: AssistantData.workflow.nodes,
        edges: AssistantData.workflow.edges,
      };
      setFlowData(wf);
      localStorage.setItem("flowData", JSON.stringify(wf));

    }
  }, [assistantId, AssistantData, IsAssistantLoading]);
  
  const toggleLeftSidebar = () => {
    if (isRightSidebarOpen) setIsRightSidebarOpen(false);
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };

  const toggleRightSidebar = () => {
    if (isLeftSidebarOpen) setIsLeftSidebarOpen(false);
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  const handleAddNode = (type) => {
    if (reactFlowRef.current) {
      reactFlowRef.current.addNode(type);
    }
  };

  const handleSaveFlow = async () => {
    if (reactFlowRef.current) {
      reactFlowRef.current.saveFlowToLocal();
    }
    try {
      if (reactFlowRef.current) {
        const flowData = reactFlowRef.current.saveFlowToLocal();
        flowData.customPrompt = promptText
        if(assistantId){
          await updateAssistant({
            id: assistantId,
            data: {
              title,
              workflow: flowData,
              data_needed : [],
              voice: selectedVoice
            }
           
          },{
            onSuccess: () => {
              localStorage.removeItem("flowData")
              navigate("/assistants");
            },
          });
        }else{

       
        await createAssistant({
          title,
          workflow: flowData,
          data_needed : [],
          voice: selectedVoice
        },{
          onSuccess: () => {
            localStorage.removeItem("flowData")
            navigate("/assistants");
          },
        });
      }
    }
    } catch (error) {
      console.error('Save failed:', error);
      setSaveError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-purple-100 overflow-hidden relative">
      {/* Left Sidebar */}
      <div className={`bg-[#F5F4F8] border-r border-gray-200 w-56 flex-shrink-0 fixed lg:static top-0 left-0 h-full z-30 transition-transform duration-300 ease-in-out transform ${isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 shadow-lg lg:shadow-none`}>
        <div className="p-6 h-full flex flex-col">
          <div className="mb-6 flex-1 overflow-y-auto">
            <h2 className="text-sm font-medium text-gray-500 mb-5 uppercase tracking-wider">Add a Step</h2>
            <div className="space-y-3">
              <div 
                className="flex items-center text-gray-700 hover:bg-gray-50 rounded-lg p-3 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-200"
                onClick={() => handleAddNode('custom')}
              >
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center mr-3 shadow-sm">
                  <PiWaveformLight size={20} className="text-green-700" />
                </div>
                <span className="text-sm font-medium">Say</span>
              </div>
              
              <div 
                className="flex items-center text-gray-700 hover:bg-gray-50 rounded-lg p-3 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-200"
                onClick={() => handleAddNode('transfer')}
              >
                <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center mr-3 shadow-sm">
                  <VscCallOutgoing size={18} className="text-green-800 font-bold" />
                </div>
                <span className="text-sm font-medium">Transfer Call</span>
              </div>
              
              <div 
                className="flex items-center text-gray-700 hover:bg-gray-50 rounded-lg p-3 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-200"
                onClick={() => handleAddNode('hangup')}
              >
                <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center mr-3 shadow-sm">
                  <FcEndCall size={18} />
                </div>
                <span className="text-sm font-medium">End Call</span>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <button 
              onClick={handleSaveFlow}
              className="w-full bg-primary hover:bg-primary/80 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors shadow-sm flex items-center justify-center"
            >
              <Save size={16} className="mr-2" />
              Save Flow
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isLeftSidebarOpen || isRightSidebarOpen ? 'overflow-hidden' : ''}`}>
        {/* Header */}
     
        
        <main className="flex-1 p-2 overflow-auto">
          <ReactFlowProvider>
            <ReactFlowComponent ref={reactFlowRef}  initialFlow={flowData}/>
          </ReactFlowProvider>
        </main>
      </div>
      
      {/* Right Sidebar */}
      <div className={`bg-white border-l border-gray-200 w-64 flex-shrink-0 fixed lg:static top-0 right-0 h-full z-30 transition-transform duration-300 ease-in-out transform ${isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 shadow-lg lg:shadow-none overflow-y-auto`}>
        <div className="p-6 h-full flex flex-col">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3 shadow-sm">
                <Settings size={16} />
              </div>
              <span className="text-base font-medium text-gray-700">Agent Settings</span>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter workflow title..."
              />
            </div> <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Voice</label>
          <div className="relative">
            <button
              className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg p-2.5 text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors"
              onClick={() => setIsVoiceDropdownOpen(!isVoiceDropdownOpen)}
            >
              <span>{selectedVoice}</span>
              <ChevronDown size={16} className={`text-gray-500 transition-transform ${isVoiceDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isVoiceDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {voiceOptions.map((voice) => (
                  <button
                    key={voice}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${selectedVoice === voice ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    onClick={() => {
                      setSelectedVoice(voice);
                      setIsVoiceDropdownOpen(false);
                    }}
                  >
                    {voice}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom Prompt</label>
              <textarea
                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={promptText}
                rows={16}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Enter your custom prompt..."
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {(isLeftSidebarOpen || isRightSidebarOpen) && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => {
            setIsLeftSidebarOpen(false);
            setIsRightSidebarOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default WorkFlow