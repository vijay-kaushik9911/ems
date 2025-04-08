'use client';
import { useState } from 'react';

export default function SignupForm({ onSubmit }) {
  const [isEmployee, setIsEmployee] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    empId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, isEmployee);
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
        <p className="text-sm text-gray-500 mt-2">
          {isEmployee ? 'Employee' : 'Lead'} Sign Up
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium text-gray-700">
            Account Type
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm">Lead</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isEmployee}
                onChange={() => setIsEmployee(!isEmployee)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600"></div>
            </label>
            <span className="text-sm">Employee</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            name="name"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isEmployee ? 'Employee' : 'Lead'} ID
          </label>
          <input
            name="empId"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.empId}
            onChange={handleChange}
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
