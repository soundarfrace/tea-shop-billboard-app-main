import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Phone, ArrowRight, MessageCircle } from 'lucide-react';
import { API_BASE_URL } from '@/lib/utils';

const DEFAULT_PHONE = '1234';
const DEFAULT_PASSWORD = '1234';

const Index = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Check localStorage for user details first
    const storedUserStr = localStorage.getItem('user');
    if (storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        if (
          storedUser.mobile_num === phone &&
          storedUser.pass_word === password
        ) {
          if (storedUser.expiry_date) {
            const expiryDate = new Date(storedUser.expiry_date);
            const currentDate = new Date();
            if (currentDate > expiryDate) {
              setError('Account expired. Please contact support.');
              setIsLoading(false);
              return;
            }
          }
          sessionStorage.setItem('logged-in', 'true');
          sessionStorage.setItem('user', JSON.stringify(storedUser));
          navigate('/billing');
          setIsLoading(false);
          return;
        } else {
          setError('Invalid phone number or password');
          setIsLoading(false);
          return;
        }
      } catch (err) {
        // If parsing fails, fallback to API
      }
    }else{
      try {
        const response = await fetch(API_BASE_URL + 'signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mobile_num: phone,
            pass_word: password,
          }),
        });
        
        const data = await response.json();
        if (response.ok) {
          const user = data.user;
          if (user.expiry_date) {
            const expiryDate = new Date(user.expiry_date);
            const currentDate = new Date();
            if (currentDate > expiryDate) {
              setError('Account expired. Please contact support.');
              setIsLoading(false);
              return;
            }
          }
          sessionStorage.setItem('logged-in', 'true');
          sessionStorage.setItem('user', JSON.stringify(data.user));
          navigate('/billing');
        } else {
          setError(data.message || 'Invalid phone number or password');
          setIsLoading(false);
        }
      } catch (err) {
        setError('Network error. Please try again.');
        setIsLoading(false);
      }
    }


  };

  const handleCreateAccount = () => {
    navigate('/create-account');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border-2 border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-xl mb-6 shadow-md">
              <Lock className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-black mb-2">Welcome Back</h1>
            <p className="text-gray-600">CALBUS</p>
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
                autoFocus
                disabled={isLoading}
                autoComplete="username"
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
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group mb-4"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Create Account Button */}
          <button
            type="button"
            onClick={handleCreateAccount}
            className="w-full py-4 bg-white hover:bg-gray-50 text-black font-semibold rounded-xl border-2 border-gray-200 hover:border-black transition-all duration-300"
            disabled={isLoading}
          >
            Create Account
          </button>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">Powered by Techies Magnifier Technologies</p>
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
              <span>Support: 9940292919</span>
              <a 
                href="https://wa.me/919940292919?text=Hello%2C%20I%20need%20support%20for%20the%20CalBus%20app." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center"
                aria-label="Contact support on WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-green-600 hover:text-green-700 transition-colors" />
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Index;
