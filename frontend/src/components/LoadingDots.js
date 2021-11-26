import React from 'react';

const LoadingDots = () => {
    return (
        <div className="flex items-center justify-center space-x-2 animate-pulse">
            <div className="w-8 h-8 bg-blue-400 rounded-full"/>
            <div className="w-8 h-8 bg-blue-400 rounded-full"/>
            <div className="w-8 h-8 bg-blue-400 rounded-full"/>
        </div>
    );
};

export default LoadingDots;