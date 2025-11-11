import React, { useEffect, useState } from 'react';
import { MdDataSaverOn } from 'react-icons/md';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Loader } from '../../components/Loader';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useUpdateAdminProfile } from '../../hooks/auth';

const Settings = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {authData,updateUser} =useAuth() ;
  useEffect(()=>{
    if(authData){
    setFormData({
      ...formData,
      name:authData.user.name,
      email:authData.user.email
    })
  }
  },[authData])
  const{mutate,isPending} =  useUpdateAdminProfile();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '', 
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (formData.newPassword) {
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters.";
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // console.log('Settings Updated', formData);
      mutate({name: formData.name,email: formData.email,newPassword: formData.newPassword,password: formData.currentPassword},{
        onSuccess: (data) => {
          console.log('Settings Updated', data);
          updateUser(data.data);
          toast.success('Settings Updated');
        },
        // onError: (error) => {
        //   console.error('Error updating settings', error);
        // },
      });
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white shadow-lg p-10  py-4">
      <h2 className='text-primary py-2 font-extrabold text-3xl pt-6'>Update Setting</h2>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Your name"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email Address
        </label>
        <input
          type="text"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
          placeholder="your.email@example.com"
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="currentPassword"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Current Password (optional)
        </label>
        <div className="relative">
          <input
            type={showCurrentPassword ? "text" : "password"}
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="••••••••"
          />
          <button
            type="button"
            className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>

      <div>
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          New Password (optional)
        </label>
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.newPassword ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            placeholder="••••••••"
          />
          <button
            type="button"
            className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-xs text-red-500 mt-1">{errors.newPassword}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Leave blank to keep current password
        </p>
      </div>
      {formData.newPassword && (
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
          )}
        </div>
      )}

      <div className="flex justify-end pt-4">
        
          <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark transition-all cursor-pointer"
        >
        {
          isPending ? <Loader color='white'/> :
          <>
          <MdDataSaverOn className="mr-2" />
          Save Settings</>}
        </button>
      </div>
    </form>
  );
};

export default Settings;