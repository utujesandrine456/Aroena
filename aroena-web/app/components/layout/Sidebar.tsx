import React from 'react';

export default function Sidebar() {
    return (
        <div className="w-64 h-full bg-gray-800 text-white">
        <h2 className="text-2xl font-bold p-4">Sidebar</h2>
        <ul>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">Home</li>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">Profile</li>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">Settings</li>
        </ul>
        </div>
    );
}