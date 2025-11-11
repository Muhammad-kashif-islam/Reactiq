import React from "react";

const PromptForm = ({  handleChange, assistantData}) => {


 console.log("---", assistantData.prompt);
 

  return (
    <>
      <div>
        <label
          htmlFor="prompt"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          AI System Prompt
        </label>
        <div className="relative">
          <textarea
            id="prompt"
            name="prompt"
            value={assistantData.prompt}
            onChange={(e) => handleChange("prompt", e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 transition-all`}
            placeholder="Define how your AI should behave..."
            rows="5"
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-500">
            {assistantData.prompt.length}/1000
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="first_message"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Initial Greeting Message
        </label>
        <div className="relative">
          <textarea
            id="first_message"
            name="first_message"
            value={assistantData.first_message}
            onChange={(e) => handleChange("first_message" , e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 transition-all`}
            placeholder="What should the AI say first?"
            rows="3"
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-500">
            {assistantData.first_message && assistantData.first_message.length}/500
          </div>
        </div>
       
      </div>

  
      </>
  );
};

export default PromptForm;
