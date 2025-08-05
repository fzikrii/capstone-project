import React from 'react';

const LoadingPage = ({ isFading }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-700 ease-out ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Container logo dengan efek shine */}
      <div className="relative overflow-hidden">
        {/* Logo */}
        <img
          src="/assets/logo.png"
          alt="Spark.up Logo"
          className="w-40 h-40"
        />

        {/* Efek shine */}
        <div className="absolute top-0 -left-full h-full w-full animate-shine bg-gradient-to-r from-transparent via-white/25 to-transparent"></div>
      </div>
    </div>
  );
};

export default LoadingPage;
