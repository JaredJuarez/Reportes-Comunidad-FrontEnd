import React from 'react';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm z-50">
            <div className="w-16 h-16 border-8 border-t-white border-opacity-30 border-t-8 rounded-full animate-spin"></div>
        </div>
    );
};

export default LoadingScreen;
