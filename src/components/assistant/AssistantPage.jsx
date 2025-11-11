import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaRobot, FaPhoneAlt, FaMicrophone, FaDatabase } from "react-icons/fa";
import { MdDataSaverOn } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RiRobot2Line } from "react-icons/ri";
import PromptForm from "./PromptForm";
import { FaLongArrowAltLeft } from "react-icons/fa";
import VoiceSettings from "./VoiceCard";
import DynamicInputFields from "./DataNeeded";
import { useCreateAssistant } from "../../hooks/adminAssistants";
import { useGetAssistant, useUpdateAssistant } from "../../hooks/assistant";
import PhoneNumber from "./PhoneNumber";

const AssistantPage = ({
  title = "AI Assistant Configuration",
}) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [activeTab, setActiveTab] = useState("Prompt");
  const [assistantData, setAssistantData] = useState({
    name: "New Assistant",
    first_message: "Hello, this is Ava. How may I assist you today?",
    prompt:
      "I'm your virtual assistant. How can I help you today? I can provide information about our products, assist with placing orders, or help with any questions you may have. Just let me know what you're looking for!",
    voice: "Alloy",
    title: '',
    description: '',
    data_needed: [],
    status: '',
    phone_numbers : []
  });
  const navigate = useNavigate()
  const [searchParam] = useSearchParams()
  const assistantId = searchParam.get("id")
  console.log("assistantId",assistantId);
  
  const { mutateAsync, isPending } = useCreateAssistant();
  const { mutateAsync: updateAssistant } = useUpdateAssistant();
  const { data: AssistantData , isLoading: IsAssistantLoading} = useGetAssistant(assistantId);
  console.log("IsAssistantLoading, ", IsAssistantLoading);

  

  const cardDetails = [
    {
      header: "Appointment Setting",
      description: "Schedule and manage customer appointments efficiently.",
      icon: <RiRobot2Line className="text-2xl text-blue-500" />,
      prompt: `You are a professional appointment scheduling assistant. Your primary role is to help users book, reschedule, and manage appointments. Always verify availability, suggest alternative time slots when conflicts occur, and send confirmation details. Maintain a polite and professional tone while ensuring all necessary information is collected.`,
      initialMessage:
        "Hello! I'm your Appointment Assistant. How can I help schedule your appointment today?",
    },
    {
      header: "Order Taking",
      description: "Take orders quickly and accurately from customers.",
      icon: <RiRobot2Line className="text-2xl text-purple-500" />,
      prompt: `You are an efficient order-taking assistant. Your main responsibility is to accurately process food or product orders. Always confirm item selections, sizes/quantities, special requests, and payment details. Offer suggestions for popular items or combos when appropriate. Maintain a friendly and enthusiastic tone.`,
      initialMessage:
        "Hi there! I'm your Order Assistant. What delicious items can I get started for you today?",
    },
    {
      header: "Customer Service",
      description: "Provide excellent support to customers and resolve issues.",
      icon: <RiRobot2Line className="text-2xl text-green-500" />,
      prompt: `You are a customer support specialist. Your role is to resolve customer issues, answer questions, and provide solutions. Always show empathy, acknowledge concerns, and provide clear step-by-step solutions. Escalate complex issues appropriately while maintaining customer trust.`,
      initialMessage:
        "Hello! I'm your Support Assistant. How can I assist you today?",
    },
    {
      header: "Reservation",
      description: "Manage bookings for services and events.",
      icon: <RiRobot2Line className="text-2xl text-indigo-500" />,
      prompt: `You are a reservation management assistant. Handle booking requests for restaurants, events, and services. Verify availability, explain cancellation policies, and process payment details securely. Always confirm reservations with clear date/time details and special instructions.`,
      initialMessage:
        "Good day! I'm your Reservation Assistant. What booking would you like to make today?",
    },
    {
      header: "Custom",
      description: "Tailor the service based on customer preferences.",
      icon: <RiRobot2Line className="text-2xl text-orange-500" />,
      prompt: `You are a versatile assistant ready to be customized. Adapt to various user needs while maintaining professional communication. Ask clarifying questions when needed and provide detailed, accurate responses based on provided guidelines.`,
      initialMessage: "Hello! I'm your Custom Assistant. How can I help you today?",
    },
  ];
  useEffect(() => {
    if (assistantId && !IsAssistantLoading && AssistantData) {
      setSelectedCard(true);
      setActiveTab("Prompt");
      setAssistantData(prev => ({
        ...prev,
        title: AssistantData.title,
        voice:AssistantData.voice,
        description: AssistantData.description,
        data_needed:AssistantData.data_needed,
        phone_numbers:AssistantData.phone_numbers,
        first_message: AssistantData.first_message,
        prompt: AssistantData.prompt
      }));
    }
  }, [assistantId, AssistantData, IsAssistantLoading]);
  
  console.log("IsAssistantLoading, ", IsAssistantLoading);


  console.log("active tab", activeTab);
  
  const handleCardClick = (card) => {
    setSelectedCard(card);
    setAssistantData(prev => ({
      ...prev,
      title: card.header,
      description: card.description,
      first_message: card.initialMessage,
      prompt: card.prompt
    }));
    console.log("nkkj", assistantData.prompt);
    
    setActiveTab("Prompt");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const handleChange = (key , value) => [
setAssistantData((prev) => ({...prev, [key]: value}))
  ]
  const validate = () => {
    const newErrors = {};
    if (!assistantData.prompt) {
      newErrors.prompt = "Prompt is required.";
    }
    if (!assistantData.title) {
      newErrors.first_message = "Initial Greeting Message is required.";
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    console.log("calling");
    e.preventDefault();
  
    if (assistantId) {
      console.log("assistantId is present:", assistantId);
  
      // Update assistant logic
      if (validate()) {
        await updateAssistant(
          {
            id: assistantId,
            data: {
              first_message: assistantData.first_message,
              prompt: assistantData.prompt,
              title: assistantData.title,
              voice: assistantData.voice,
              data_needed: assistantData.data_needed,
              phone_numbers: assistantData.phone_numbers,
              description: assistantData.description,
            },
          },
          {
            onSuccess: () => {
              navigate("/assistants");
            },
          }
        );
      }
    } else {
      // Create assistant logic if assistantId is not present
      if (validate()) {
        await mutateAsync(
          {
            first_message: assistantData.first_message,
            prompt: assistantData.prompt,
            title: assistantData.title,
            voice: assistantData.voice,
            data_needed: assistantData.data_needed,
            phone_numbers: assistantData.phone_numbers,

            description: assistantData.description,
          },
          {
            onSuccess: () => {
              navigate("/assistants");
            },
          }
        );
      }
    }
  };


  return (
    <div className="w-full mb-4 text-gray-800">
      <div className="px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
        <button
          className="cursor-pointer flex items-center text-primary hover:text-blue-800 mb-6 transition-colors duration-200"
        >
          <FaLongArrowAltLeft onClick={()=> navigate("/assistants")} className="mr-2" size={18} />
          {selectedCard && <span>Back to options</span>}
        </button>
        <div className=" mb-10">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-primary mb-2">
            {title}
          </h1>
          <p className="text-gray-600 max-w-2xl">
            {!selectedCard
              ? "Select an AI assistant type to get started"
              : "Configure your AI assistant settings"}
          </p>
        </div>
        {!selectedCard ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {cardDetails.map((card, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-transparent cursor-pointer bg-white`}
                onClick={() => handleCardClick(card)}
              >
                <div className="flex items-start">
                  <div className="py-2 pr-2 rounded-lg bg-white shadow-sm mr-2">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-primary">
                      {card.header}
                    </h3>
                    <p className="text-gray-600 mt-2">{card.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="p-2 rounded-full bg-white text-blue-500 hover:bg-blue-50 transition-colors">
                    <AiOutlinePlus />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (

          <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
  <div className="flex items-start">
    <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
      <FaRobot className="text-xl" />
    </div>
    <div className="flex flex-col w-full">
      <label
        htmlFor="assistantTitle"
        className="text-sm font-medium text-gray-700 mb-1"
      >
        Assistant Title
      </label>
      <input
        id="assistantTitle"
        type="text"
        value={assistantData.title}
        onChange={(e) => handleChange("title", e.target.value)}
        className="text-2xl font-bold text-primary border-b border-gray-300 focus:outline-none focus:border-blue-500 p-2 mb-2"
        placeholder="Enter the title of your assistant"
      />
      
      
      <input
      type="text"
        id="assistantDescription"

        value={assistantData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        className="text-gray-600 focus:outline-none focus:border-blue-500 border-b border-gray-300 rounded-md p-1 resize-none"
        placeholder="Enter a brief description of the assistant"
      />
    </div>
  </div>
</div>

            <div className="p-6">
              <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
                <button
                  className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    activeTab === "Prompt"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => handleTabChange("Prompt")}
                >
                  <FaRobot className="text-lg" />
                  <span>Prompt</span>
                </button>
                <button
                  className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    activeTab === "Voices"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => handleTabChange("Voices")}
                >
                  <FaMicrophone className="text-lg" />
                  <span>Voices</span>
                </button>
                <button
                  className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    activeTab === "Data Needed"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => handleTabChange("Data Needed")}
                >
                  <FaDatabase className="text-lg" />
                  <span>Data</span>
                </button>

                <button
                  className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    activeTab === "Phone Number"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => handleTabChange("Phone Number")}
                >
                  <FaPhoneAlt className="text-lg" />
                  <span>Phone Numbers</span>
                </button>
              </div>
              <div className="transition-all duration-300">
                {activeTab === "Prompt" && (
                  <PromptForm
                    handleChange={handleChange}  assistantData={assistantData}
                  />
                )}
                {activeTab === "Voices" && <VoiceSettings handleChange={handleChange} assistantData={assistantData} />}
                {activeTab === "Data Needed" && <DynamicInputFields  handleChange={handleChange} assistantData={assistantData} />}
                {activeTab === "Phone Number" && <PhoneNumber  handleChange={handleChange} assistantData={assistantData} />}
              </div>
            </div>
            <div className="flex justify-end p-4">
        <button
          disabled={isPending}
          onClick={handleSubmit}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:from-blue-700 hover:to-primary transition-all cursor-pointer"
        >
          {isPending ?  (
            <>{assistantId ? 'Updating...' : 'Saving...'}</>
          ) : (
            <>
              <MdDataSaverOn className="mr-2" />
              {assistantId ? 'Update Configuration' : 'Save Configuration'}
            </>
          )}
        </button>
      </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistantPage;
