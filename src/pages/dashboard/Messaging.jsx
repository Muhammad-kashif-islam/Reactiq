import { useState, useRef, useEffect } from 'react';

const Messaging = () => {
  const [activeChat, setActiveChat] = useState('Anil');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const messagesEndRef = useRef(null);
  
  const leads = [
    { id: 1, name: "Anil", lastMessage: "April, both day", time: "9:52pm", unread: 0, online: true },
    { id: 2, name: "Chuxthiya", lastMessage: "You have to trust or it...", time: "12:19pm", unread: 3 },
    { id: 3, name: "Bill Gates", lastMessage: "Nevermind is in", time: "11:13am", unread: 0 },
    { id: 4, name: "Victoria H", lastMessage: "Okay, Helluce, let's see...", time: "11:13am", unread: 0 },
    { id: 5, name: "Friends@5.52pm", lastMessage: "International", time: "5:52pm", unread: 0 },
    { id: 6, name: "Kyukumar???", lastMessage: "Wednesday, 7:31 pm", time: "7:31pm", unread: 2 },
    { id: 7, name: "Hiking Group", lastMessage: "It's not going to happen", time: "9:12am", unread: 0 },
    { id: 8, name: "Victoria H", lastMessage: "Okay, Helluce, let's see...", time: "11:13am", unread: 0 },
    { id: 9, name: "Friends@5.52pm", lastMessage: "International", time: "5:52pm", unread: 0 },
    { id: 10, name: "Kyukumar???", lastMessage: "Wednesday, 7:31 pm", time: "7:31pm", unread: 2 },
    { id: 11, name: "Hiking Group", lastMessage: "It's not going to happen", time: "9:12am", unread: 0 },
  ];

  const messages = {
    'Anil': [
      { id: 1, text: "Hey There!\nHow are you?", time: "8:30pm", sent: false },
      { id: 2, text: "Hello!", time: "8:33pm", sent: false },
      { id: 3, text: "I am fine and how are you?", time: "8:34pm", sent: true },
      { id: 4, text: "I am doing well, Can we meet tomorrow?", time: "8:36pm", sent: false },
      { id: 5, text: "Yes Sure!", time: "8:58pm", sent: true },
    ],
    'Chuxthiya': [
      { id: 1, text: "May ma'am", time: "12:19pm", sent: false },
      { id: 2, text: "May a'am?", time: "12:20pm", sent: false },
      { id: 3, text: "You have to trust or it...", time: "12:22pm", sent: false },
    ],
    // Add messages for other contacts
  };

  // Filter leads based on search query
  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat, messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-light">
      <div className={`flex flex-col ${sidebarCollapsed ? 'w-20' : 'w-80'} bg-white border-r border-gray-200 transition-all duration-300`}>
        <div className="p-4 flex items-center justify-between">
       
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-full hover:bg-primary-light hover:bg-opacity-30 text-white"
          >
            {sidebarCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        <div className="p-3 bg-gray-50">
          {!sidebarCollapsed ? (
            <div className="relative">
              <input
                type="text"
                placeholder="Search leads..."
                className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          ) : (
            <div className="flex justify-center">
              <button className="p-2 rounded-full hover:bg-gray-200 text-gray-600">
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => setActiveChat(lead.name)}
              className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${activeChat === lead.name ? 'bg-primary-light bg-opacity-20' : ''}`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-icon flex items-center justify-center text-white font-semibold">
                  {lead.name.charAt(0)}
                </div>
                {lead.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              {!sidebarCollapsed && (
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-dark truncate">{lead.name}</h3>
                    <span className="text-xs text-gray-500">{lead.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 truncate">{lead.lastMessage}</p>
                    {lead.unread > 0 && (
                      <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {lead.unread}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 bg-white border-b border-gray-200 flex items-center">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-icon flex items-center justify-center text-white font-semibold">
              {activeChat.charAt(0)}
            </div>
            {leads.find(l => l.name === activeChat)?.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-dark">{activeChat}</h2>
            <p className="text-xs text-gray-500">
              {leads.find(l => l.name === activeChat)?.online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        <div 
  className="flex-1 p-4 overflow-y-auto bg-yellow-50 bg-opacity-50 relative"
  style={{ 
    backgroundImage: "url('/chatbackground.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat"
  }}
>
  <div className="absolute inset-0 bg-purple-50/90"></div>
  
  <div className="relative z-10">
    {messages[activeChat]?.map((msg) => (
      <div
        key={msg.id}
        className={`flex mb-4 ${msg.sent ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sent ? 'bg-primary text-white' : 'bg-white text-dark border border-gray-200'}`}
        >
          {msg.text.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
          <p className={`text-xs mt-1 ${msg.sent ? 'text-white text-opacity-70' : 'text-gray-500'}`}>
            {msg.time}
          </p>
        </div>
      </div>
    ))}
    <div ref={messagesEndRef} />
  </div>
</div>

        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 py-2 px-4 mx-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="p-2 rounded-full bg-primary text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messaging;