import { useState } from 'react';
import { useCreateCampaign, useGetCampaigns, useDeleteCampaign, useUpdateCampaign } from '../../hooks/campaign';
import { useGetAssistants } from '../../hooks/assistant';
import { useGetLeads } from '../../hooks/leads';
import { RiRobot3Line, RiDeleteBinLine, RiPlayLine } from "react-icons/ri";
import { AiOutlinePause  } from "react-icons/ai";

import { FiExternalLink } from "react-icons/fi";
import ConfirmationModal from '../../components/forms/ConfirmationModal';

const Campaign = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignName, setCampaignName] = useState('');
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState([]);
  
  // Confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const [firstMessage, setFirstMessage] = useState('');
  const { data: campaigns = [], refetch: refetchCampaigns } = useGetCampaigns();
  const { data: assistants = [] } = useGetAssistants();
  const { data: leads = [] } = useGetLeads();
  const { mutate: createCampaign } = useCreateCampaign();
  const { mutate: deleteCampaign } = useDeleteCampaign();
  const { mutate: updateCampaign } = useUpdateCampaign();

  const handleLeadSelection = (lead) => {
    if (selectedLeads.some(l => l.id === lead.id)) {
      setSelectedLeads(selectedLeads.filter(l => l.id !== lead.id));
    } else {
      setSelectedLeads([...selectedLeads, lead]);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const startCampaign = () => {
    createCampaign({
      name: campaignName,
      assistant_id: selectedAssistant.id,
      lead_ids: selectedLeads.map(lead => lead.id),
      first_message: firstMessage
    }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setCurrentStep(1);
        setCampaignName('');
        setSelectedAssistant(null);
        setSelectedLeads([]);
        setFirstMessage('');
        refetchCampaigns();
      }
    });
  };


  const handleDeleteClick = (campaign) => {
    setCurrentCampaign(campaign);
    setConfirmAction('delete');
    setShowConfirmModal(true);
  };

  const handleToggleStatusClick = (campaign) => {
    setCurrentCampaign(campaign);
    setConfirmAction(campaign.status === 'active' ? 'pause' : 'resume');
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    if (confirmAction === 'delete') {
      deleteCampaign(currentCampaign.id, {
        onSuccess: () => {
          refetchCampaigns();
          setShowConfirmModal(false);
        }
      });
    } else {
      const newStatus = currentCampaign.status === 'active' ? 'paused' : 'active';
      updateCampaign({
        id: currentCampaign.id,
        status: newStatus
      }, {
        onSuccess: () => {
          refetchCampaigns();
          setShowConfirmModal(false);
        }
      });
    }
  };

  const getConfirmMessage = () => {
    switch (confirmAction) {
      case 'delete':
        return `Are you sure you want to delete the campaign "${currentCampaign.name}"? This action cannot be undone.`;
      case 'pause':
        return `Are you sure you want to pause the campaign "${currentCampaign.name}"?`;
      case 'resume':
        return `Are you sure you want to resume the campaign "${currentCampaign.name}"?`;
      default:
        return 'Are you sure you want to perform this action?';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAction}
        message={getConfirmMessage()}
      />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-500">Manage your outreach campaigns</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r cursor-pointer from-primary to-primary-dark hover:from-primary-dark hover:from-primary-dark hover:to-primary text-white px-6 py-3 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Campaign
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map(campaign => (
          <div 
            key={campaign.id} 
            className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all ${
              campaign.status === false ? 'opacity-70' : ''
            }`}
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mr-3">
                    <span className="text-lg font-bold text-primary">
                      {campaign.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {campaign.name}
                  </h3>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full ${
                  campaign.status === true ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {campaign.status === true ? 'Active' : 'Paused'}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <RiRobot3Line className="mr-1" />
                <span className="truncate">{campaign.assistant_name || 'No assistant'}</span>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <span className="bg-blue-50 text-primary px-2 py-1 rounded-md">
                    {campaign.leads_count} {campaign.leads_count === 1 ? 'lead' : 'leads'}
                  </span>
                </div>
                <span className="text-gray-400">Created {formatDate(campaign.created_at)}</span>
              </div>
              
              <div className="flex justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center space-x-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={campaign.status === true}
                      onChange={() => handleToggleStatusClick(campaign)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                  <button 
                    onClick={() => handleDeleteClick(campaign)}
                    className="p-2 cursor-pointer rounded-md text-red-600 hover:bg-red-50"
                  >
                    <RiDeleteBinLine size={18} />
                  </button>
                </div>
                <button className="flex cursor-pointer items-center text-primary hover:text-primary-dark text-sm font-medium">
                  View details <FiExternalLink className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {campaigns.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <RiRobot3Line className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No campaigns yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first outreach campaign</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md shadow-sm"
          >
            Create Campaign
          </button>
        </div>
      )}

{isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="border-b border-gray-200 p-5 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
              <h3 className="text-xl font-semibold text-gray-800">Create New Campaign</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex justify-between px-8 py-6 border-b border-gray-200">
              {[1, 2, 3, 4].map(step => (
                <div key={step} className="flex flex-col items-center relative">
                  {step > 1 && (
                    <div className={`absolute h-0.5 w-6 -left-10 xs:w-12 xs:-left-16 sm:w-20 md:w-20 lg:w-24 sm:-left-24 md:-left-28 lg:-left-32 top-4 ${
                      currentStep >= step ? 'bg-primary' : 'bg-gray-200'
                    }`}></div>
                  )}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    currentStep === step ? 'bg-primary text-white shadow-md' : 
                    currentStep > step ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {step}
                  </div>
                  <span className="text-xs mt-2 font-medium text-gray-600">
                    {step === 1 ? 'Details' : step === 2 ? 'Assistant' : step === 3 ? 'Leads' : 'Message'}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {currentStep === 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="e.g. Summer Outreach"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  <p className="mt-2 text-sm text-gray-500">Give your campaign a descriptive name</p>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Assistant</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-64 pr-2">
                    {assistants.map(assistant => (
                      <div
                        key={assistant.id}
                        onClick={() => setSelectedAssistant(assistant)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedAssistant?.id === assistant.id 
                            ? 'border-primary bg-blue-50 ring-1 ring-primary' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="border rounded-3xl border-gray-200 p-2 mr-3 bg-white">
                            <RiRobot3Line className="text-primary" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-800">{assistant.title}</span>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{assistant.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Leads <span className="text-primary">({selectedLeads.length} selected)</span>
                  </label>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {leads.map(lead => (
                      <div
                        key={lead.id}
                        onClick={() => handleLeadSelection(lead)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all flex items-center ${
                          selectedLeads.some(l => l.id === lead.id)
                            ? 'border-primary bg-blue-50 ring-1 ring-primary'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                          selectedLeads.some(l => l.id === lead.id)
                            ? 'bg-primary border-primary'
                            : 'bg-white border-gray-300'
                        }`}>
                          {selectedLeads.some(l => l.id === lead.id) && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">{lead.name}</p>
                          <p className="text-sm text-gray-600 truncate">{lead.email || lead.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Message</label>
                  <textarea
                    value={firstMessage}
                    onChange={(e) => setFirstMessage(e.target.value)}
                    placeholder="Write your first message to send to leads..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-h-32"
                    rows={5}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    This message will be sent as the first outreach to your selected leads
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 p-5 flex justify-between bg-gray-50">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className={`px-5 py-2.5 rounded-lg ${
                  currentStep === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Back
              </button>
              
              {currentStep < 4 ? (
                <button
                  onClick={handleNextStep}
                  disabled={
                    (currentStep === 1 && !campaignName) || 
                    (currentStep === 2 && !selectedAssistant) ||
                    (currentStep === 3 && selectedLeads.length === 0)
                  }
                  className={`px-5 py-2.5 rounded-lg font-medium ${
                    (currentStep === 1 && !campaignName) || 
                    (currentStep === 2 && !selectedAssistant) ||
                    (currentStep === 3 && selectedLeads.length === 0)
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary-dark text-white shadow-md'
                  }`}
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={startCampaign}
                  disabled={!firstMessage}
                  className={`px-5 py-2.5 rounded-lg font-medium ${
                    !firstMessage
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary to-primary-dark hover:from-primary hover:to-green-700 text-white shadow-md'
                  }`}
                >
                  Launch Campaign
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default Campaign;