import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowLeft, Building } from 'lucide-react';

const Signup = ({ onBack, onLoginClick }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'user', // 'user' or 'hotel_owner'
    agreeToTerms: false,
    hotelName: '',
    hotelAddress: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const userTypes = [
    { value: 'user', label: 'Guest/User', icon: User },
    { value: 'hotel_owner', label: 'Hotel Owner', icon: Building }
  ];

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^A-Za-z\d]/.test(password)) strength += 1;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    setSubmitError('');
    setSubmitSuccess('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    if (formData.userType === 'hotel_owner') {
      if (!formData.hotelName.trim()) newErrors.hotelName = 'Hotel name is required';
      if (!formData.hotelAddress.trim()) newErrors.hotelAddress = 'Hotel address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength < 2) return 'bg-red-500';
    if (strength < 4) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (strength) => {
    if (strength < 2) return 'Weak';
    if (strength < 4) return 'Medium';
    return 'Strong';
  };

  // New: Axios POST on submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    if (!validateForm()) return;

    // Prepare data to send to backend
    const dataToSend = {
      role: formData.userType === 'user' ? 'user' : 'hotelier',
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      hotelName: formData.userType === 'hotel_owner' ? formData.hotelName : undefined,
      hotelAddress: formData.userType === 'hotel_owner' ? formData.hotelAddress : undefined
    };

    const url = 'http://localhost:5000/api/auth/register';
 
    try {
      const res = await axios.post(url, dataToSend);

      if (res.status === 201) {
        setSubmitSuccess('Registration successful! Please login.');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          userType: formData.userType,
          agreeToTerms: false,
          hotelName: '',
          hotelAddress: ''
        });
        setPasswordStrength(0);
        setErrors({});
      }
    } catch (error) {
      // Backend might return validation errors or simple error messages
      if (error.response?.data?.errors) {
        // Express-validator style errors
        const backendErrors = {};
        error.response.data.errors.forEach(err => {
          backendErrors[err.param] = err.msg;
        });
        setErrors(backendErrors);
      } else if (error.response?.data?.error) {
        setSubmitError(error.response.data.error);
      } else {
        setSubmitError('Registration failed, please try again later.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-yellow-400 p-8 text-white text-center relative">
          {onBack && (
            <button
              onClick={onBack}
              className="absolute left-4 top-4 p-2 rounded-full bg-white/20 hover:bg-white/30"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <h2 className="text-2xl font-bold mb-1">HeavenStay Nepal</h2>
          <p>Join Our Community and Start Exploring</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Register as</label>
            <div className="grid grid-cols-2 gap-3">
              {userTypes.map(type => {
                const Icon = type.icon;
                const isSelected = formData.userType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, userType: type.value }))}
                    className={`p-3 border rounded-lg text-center transition-all ${
                      isSelected ? 'bg-green-100 border-green-600' : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    <Icon className={`mx-auto mb-1 ${isSelected ? 'text-green-600' : 'text-gray-500'}`} />
                    <span className={`text-sm ${isSelected ? 'text-green-700 font-semibold' : 'text-gray-600'}`}>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Common Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className={`mt-1 w-full border px-3 py-2 rounded-lg ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className={`mt-1 w-full border px-3 py-2 rounded-lg ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              className={`mt-1 w-full border px-3 py-2 rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+977-98xxxxxxx"
              className={`mt-1 w-full border px-3 py-2 rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>

          {/* Hotel Owner Fields */}
          {formData.userType === 'hotel_owner' && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700">Hotel Name</label>
                <input
                  name="hotelName"
                  value={formData.hotelName}
                  onChange={handleChange}
                  placeholder="Hotel Paradise"
                  className={`mt-1 w-full border px-3 py-2 rounded-lg ${errors.hotelName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.hotelName && <p className="text-sm text-red-500">{errors.hotelName}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Hotel Address</label>
                <input
                  name="hotelAddress"
                  value={formData.hotelAddress}
                  onChange={handleChange}
                  placeholder="Lakeside, Pokhara"
                  className={`mt-1 w-full border px-3 py-2 rounded-lg ${errors.hotelAddress ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.hotelAddress && <p className="text-sm text-red-500">{errors.hotelAddress}</p>}
              </div>
            </>
          )}

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 w-full border px-3 py-2 rounded-lg pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-2 rounded-full ${getPasswordStrengthColor(passwordStrength)}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">{getPasswordStrengthText(passwordStrength)}</span>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`mt-1 w-full border px-3 py-2 rounded-lg pr-10 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>

          {/* Terms & Conditions */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} />
              I agree to the Terms & Conditions
            </label>
            {errors.agreeToTerms && <p className="text-sm text-red-500">{errors.agreeToTerms}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Create Account
          </button>

          {submitError && <p className="text-center text-red-500 mt-3">{submitError}</p>}
          {submitSuccess && <p className="text-center text-green-600 mt-3">{submitSuccess}</p>}

          <p className="text-center text-sm mt-4 text-gray-600">
            Already have an account? <button 
              type="button"
              onClick={onLoginClick}
              className="text-green-600 font-medium underline"
            >
              Sign in here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
