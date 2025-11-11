import React, { useState, useEffect } from 'react';
import { useGetAdminStats, useGetAdminUserStats } from '../../hooks/auth';
import { FcPhone } from "react-icons/fc";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

function AdminDashboard() {
  const { data: Stats, isLoading: isStatsLoading } = useGetAdminStats();
  const [selectedTime, setSelectedTime] = useState("30d");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: UserStats, isLoading: isUserStatsLoading } = useGetAdminUserStats(selectedTime);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const timeOptions = [
    { value: "30d", label: "Last 30 Days" },
    { value: "3m", label: "Last 3 Months" },
    { value: "6m", label: "Last 6 Months" }
  ];

  const handleTimeChange = (value) => {
    setSelectedTime(value);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const chartVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  if ((isUserStatsLoading || isStatsLoading) && !isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <motion.div
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </div>
    );
  }

  const graphData = UserStats?.map((item) => ({
    name: item.date,
    user: item.count,
  })) || [];

  const selectedLabel = timeOptions.find(opt => opt.value === selectedTime)?.label;

  return (
    <div className="p-10 space-y-6 min-h-screen bg-white">
      <AnimatePresence>
        {isMounted && (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <motion.div 
                className="bg-purple-50 shadow-md p-6 rounded-xl flex items-center justify-between hover:shadow-lg transition-shadow"
                variants={cardVariants}
                whileHover={{ y: -5 }}
                style={{ visibility: isMounted ? 'visible' : 'hidden' }}
              >
                <div>
                  <h3 className="text-lg font-bold text-purple-800">Total Leads</h3>
                  <motion.p 
                    className="text-2xl mt-4 font-bold text-purple-900"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {Stats?.total_leads || 0}
                  </motion.p>
                </div>
                <motion.img 
                  src="/group.png" 
                  alt="Total Leads" 
                  className="w-12 h-12"
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  transition={{ delay: 0.3 }}
                />
              </motion.div>

              <motion.div 
                className="p-6 bg-green-50 shadow-md rounded-xl flex items-center justify-between hover:shadow-lg transition-shadow"
                variants={cardVariants}
                whileHover={{ y: -5 }}
                style={{ visibility: isMounted ? 'visible' : 'hidden' }}
              >
                <div>
                  <h3 className="text-lg font-bold text-green-800">Total Users</h3>
                  <motion.p 
                    className="text-2xl mt-4 font-bold text-green-900"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {Stats?.total_users || 0}
                  </motion.p>
                </div>
                <motion.div 
                  className='bg-green-100 p-4 text-3xl rounded-3xl'
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <FcPhone />
                </motion.div>
              </motion.div>

              <motion.div 
                className="p-6 bg-amber-50 shadow-md rounded-xl flex items-center justify-between hover:shadow-lg transition-shadow"
                variants={cardVariants}
                whileHover={{ y: -5 }}
                style={{ visibility: isMounted ? 'visible' : 'hidden' }}
              >
                <div>
                  <h3 className="text-lg font-bold text-amber-800">Total Assistant</h3>
                  <motion.p 
                    className="text-2xl mt-4 font-bold text-amber-900"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {Stats?.total_assistants || 0}
                  </motion.p>
                </div>
                <motion.img 
                  src="/assistant.png" 
                  alt="Total Assistants" 
                  className="w-12 h-12"
                  initial={{ rotate: 10 }}
                  animate={{ rotate: 0 }}
                  transition={{ delay: 0.5 }}
                />
              </motion.div>
            </motion.div>

            <motion.div 
              className="my-6 relative" 
              variants={cardVariants}
              style={{ visibility: isMounted ? 'visible' : 'hidden' }}
            >
              <label htmlFor="time-period" className="font-semibold text-sm mr-4 text-gray-700">Select Time Period:</label>
              <div className="relative inline-block w-48 mt-2">
                <button
                  onClick={toggleDropdown}
                  className="w-full bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-1 text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 flex items-center justify-between"
                >
                  <span className="text-gray-700">{selectedLabel}</span>
                  <FiChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1"
                    >
                      {timeOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`px-4 py-1 cursor-pointer hover:bg-purple-50 ${selectedTime === option.value ? 'bg-purple-100 text-purple-800' : 'text-gray-700'}`}
                          onClick={() => handleTimeChange(option.value)}
                        >
                          {option.label}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div 
              className="p-6 bg-white rounded-xl border border-gray-300 shadow-md"
              variants={chartVariants}
              whileHover={{ scale: 1.005 }}
              style={{ visibility: isMounted ? 'visible' : 'hidden' }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">User Growth Over {selectedLabel}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="user" 
                    stroke="#8b5cf6" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#8b5cf6' }}
                    activeDot={{ r: 6, stroke: '#7c3aed', strokeWidth: 2 }}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminDashboard;