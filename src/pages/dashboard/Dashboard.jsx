import React, { useEffect, useState } from 'react';
import { useGetUserStats } from '../../hooks/auth';
import { FcPhone } from "react-icons/fc";
import { motion, AnimatePresence } from 'framer-motion';
import { FiActivity, FiClock, FiXCircle } from 'react-icons/fi';

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

const tableRowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3
    }
  })
};

function Dashboard() {
  const { data: Stats, isLoading: isStatsLoading } = useGetUserStats();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // After first render, mark initial load as complete
    setIsInitialLoad(false);
  }, []);

  if (isStatsLoading && isInitialLoad) {
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

  return (
    <motion.div 
      className="p-6 md:p-10 space-y-6 min-h-screen bg-white"
      initial={isInitialLoad ? false : "hidden"}
      animate="visible"
      variants={containerVariants}
      key="dashboard" // Add key to force re-render
    >
      {/* Top Cards */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Total Leads Card */}
        <motion.div 
          className="bg-purple-50 shadow-md p-6 rounded-xl flex items-center justify-between hover:shadow-lg transition-shadow"
          variants={cardVariants}
          whileHover={{ y: -5 }}
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

        {/* Total Phone Numbers Card */}
        <motion.div 
          className="p-6 bg-green-50 shadow-md rounded-xl flex items-center justify-between hover:shadow-lg transition-shadow"
          variants={cardVariants}
          whileHover={{ y: -5 }}
        >
          <div>
            <h3 className="text-lg font-bold text-green-800">Total Phone Numbers</h3>
            <motion.p 
              className="text-2xl mt-4 font-bold text-green-900"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {Stats?.total_phone_numbers || 0}
            </motion.p>
          </div>
          <motion.div 
            className='bg-green-100 p-4 text-2xl rounded-3xl'
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <FcPhone />
          </motion.div>
        </motion.div>

        {/* Total Assistant Card */}
        <motion.div 
          className="p-6 bg-amber-50 shadow-md rounded-xl flex items-center justify-between hover:shadow-lg transition-shadow"
          variants={cardVariants}
          whileHover={{ y: -5 }}
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

      {/* Ongoing Agents Table */}
      <motion.div 
        className="p-6 rounded-xl mt-10 border border-gray-200 shadow-sm bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">On Going Agents</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm text-gray-700">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="py-3 px-4 text-left font-medium">Agent Name</th>
                <th className="py-3 px-4 text-left font-medium">Voice</th>
                <th className="py-3 px-4 text-left font-medium">Date</th>
                <th className="py-3 px-4 text-left font-medium">Initial Message</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {Stats?.assistants?.length < 1 ? (
                <motion.tr 
                  variants={tableRowVariants}
                  className="hover:bg-gray-50 transition duration-200 ease-in-out"
                >
                  <td colSpan="5" className="text-center py-6 text-gray-500 italic">
                    There are no assistants.
                  </td>
                </motion.tr>
              ) : (
                Stats?.assistants?.map((assistant, index) => (
                  <motion.tr 
                    key={index}
                    custom={index}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    className="hover:bg-gray-50 transition duration-200 ease-in-out border-b border-gray-100"
                    whileHover={{ scale: 1.005, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                  >
                    <td className="py-4 px-4">{assistant.assistant_title}</td>
                    <td className="py-4 px-4">{assistant.assistant_voice}</td>
                    <td className="py-4 px-4">{new Date(assistant.assistant_created_at).toLocaleString()}</td>
                    <td className="py-4 px-4 max-w-xs truncate">{assistant.assistant_first_message}</td>
                    <td className="py-4 px-4">
                      <motion.div 
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                          ${assistant.assistant_status === 'active' ? 'bg-green-100 text-green-800' :  'bg-yellow-100 text-yellow-800'}`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {assistant.assistant_status === 'active' ? (
                          <>
                            <FiActivity className="mr-1" /> Active
                          </>
                        ) : (
                          <>
                            <FiClock className="mr-1" /> Inactive
                          </>
                        )}
                      </motion.div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;