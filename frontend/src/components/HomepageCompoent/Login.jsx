import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User, Building, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Login = ({ onBack, onSignupClick }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'user',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const userTypes = [
    { value: 'user', label: 'Guest/User', icon: User, color: 'text-[#437057]' },
    { value: 'hotel_owner', label: 'Hotel Owner', icon: Building, color: 'text-[#97B067]' },
    { value: 'admin', label: 'Admin', icon: Shield, color: 'text-[#E3DE61]' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const result = await login({
          email: formData.email,
          password: formData.password,
          role: formData.userType === 'hotel_owner' ? 'hotelier' : formData.userType
        });
        
        if (result.success) {
          showToast('Login successful!', 'success');
          // Navigate based on user role
          const userRole = result.user.role;
          if (userRole === 'admin') {
            navigate('/admin');
          } else if (userRole === 'hotelier') {
            navigate('/hoteler');
          } else {
            navigate('/users');
          }
        } else {
          showToast(result.message || 'Login failed', 'error');
        }
      } catch (error) {
        console.error('Login error:', error);
        showToast('Network error. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#97B067]/20 to-[#E3DE61]/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2F5249] to-[#437057] p-8 text-white text-center relative">
          {onBack && (
            <button 
              onClick={onBack}
              className="absolute left-4 top-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="mb-4">
            <span className="text-2xl font-bold">HeavenStay Nepal</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-green-100">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-[#2F5249] mb-3">
                Login as
              </label>
              <div className="grid grid-cols-3 gap-2">
                {userTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, userType: type.value }))}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        formData.userType === type.value
                          ? 'border-[#437057] bg-[#437057]/10'
                          : 'border-gray-200 hover:border-[#97B067]'
                      }`}
                    >
                      <IconComponent className={`h-6 w-6 mx-auto mb-1 ${
                        formData.userType === type.value ? 'text-[#437057]' : 'text-gray-400'
                      }`} />
                      <span className={`text-xs font-medium ${
                        formData.userType === type.value ? 'text-[#2F5249]' : 'text-gray-500'
                      }`}>
                        {type.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2F5249] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-[#437057]" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#437057] transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#2F5249] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-[#437057]" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#437057] transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#437057] hover:text-[#2F5249]"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#437057] focus:ring-[#437057] border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-[#2F5249]">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-[#437057] hover:text-[#2F5249] transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#437057] to-[#2F5249] text-white py-3 px-4 rounded-lg font-semibold hover:from-[#2F5249] hover:to-[#437057] focus:outline-none focus:ring-2 focus:ring-[#437057] focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Login
          <div className="mt-6 space-y-3">
            <button className="w-full border border-gray-300 text-[#2F5249] py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#437057] transition-colors flex items-center justify-center space-x-2">
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="h-5 w-5" />
              <span>Continue with Google</span>
            </button>
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-center space-x-2">
              <span>Continue with Facebook</span>
            </button>
          </div> */}

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-[#2F5249]">
            Don't have an account?{' '}
            <button 
              type="button"
              onClick={onSignupClick}
              className="text-[#437057] hover:text-[#2F5249] font-medium transition-colors underline"
            >
              Sign up for free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;