
import React from "react";

const SplashScreen = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-700">
    <div className="text-center">
      <div className="relative mb-8">
        <div className="relative p-5  border-gray-100">
          <h1 className="text-5xl font-black text-black tracking-wider">
            CalBus
          </h1>
        </div>
      </div>
      <p className="text-gray-600 text-lg font-medium mb-4">Welcome to your smart business manager</p>
      <div className="flex space-x-2 justify-center">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
);

export default SplashScreen;
