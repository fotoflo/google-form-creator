import React from "react";

export function SectionButton({ icon, title, description, onClick }) {
  return (
    <div className="bg-gray-100 rounded-lg p-6 shadow-md flex flex-col h-full">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center text-white">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 ml-4">{title}</h3>
      </div>
      <p className="text-gray-600 mb-6 flex-grow">{description}</p>
      <button
        onClick={onClick}
        className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
      >
        Create {title}
      </button>
    </div>
  );
}
