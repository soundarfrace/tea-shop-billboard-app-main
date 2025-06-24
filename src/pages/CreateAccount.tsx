import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Phone, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../lib/utils';

const CreateAccount = () => {
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!shopName.trim() || !phone.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_BASE_URL + 'createusers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop_name: shopName,
          mobile_num: phone,
          pass_word: password,
          country_code: '91', // default country code
          expire_dt: null,      // or set a default expiry date if needed
          create_usr: "calbus"
        }),
      });
      const data = await response.json();
      if (response.ok && data.user) {
        // Store user details in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsLoading(false);
        navigate('/');
      } else {
        setError(data.message || 'Failed to create account');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border-2 border-gray-100" autoComplete="off">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-xl mb-6 shadow-md">
              <Store className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-black mb-2">Create Account</h1>
            <p className="text-gray-600">Setup your business calculator</p>
          </div>

          {/* Shop Name Field */}
          <div className="mb-6">
            <div className="relative group">
              <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors" />
              <input
                type="text"
                placeholder="Shop Name"
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
                autoFocus
                disabled={isLoading}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Phone Field */}                                
          <div className="mb-6">
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors" />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
                disabled={isLoading}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group mb-4"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Back to Login Button */}
          <button
            type="button"
            onClick={handleBackToLogin}
            className="w-full py-4 bg-white hover:bg-gray-50 text-black font-semibold rounded-xl border-2 border-gray-200 hover:border-black transition-all duration-300 flex items-center justify-center space-x-2"
            disabled={isLoading}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Login</span>
          </button>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">Powered by Techies Magnifier Technologies</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
