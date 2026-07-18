'use client';

import React, { useState } from 'react';
import { CHARACTER_ROLES } from 'shared';

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGroup, setActiveGroup] = useState('All');

  const groups = ['All', 'Forest Rangers', 'Recon Corps', 'Shadow Guild', 'Logistics & Engineering Corps', 'Wisdom & Command Council'];

  const filteredRoles = Object.values(CHARACTER_ROLES).filter((char) => {
    const matchesSearch = char.characterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          char.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = activeGroup === 'All' || char.group === activeGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="min-h-screen bg-[#F2F2EC] text-[#1f2937] font-mono p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 border-b border-black/10 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-[#047857] mb-2">🌲 HOODLINGS GALLERY</h1>
          <p className="text-gray-600">Explore the complete registry of active outlaw companions, their tactical roles, and divisions.</p>
        </header>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-8">
          <input
            type="text"
            placeholder="Search outlaws by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 max-w-md px-4 py-2 border border-black/10 rounded bg-white focus:outline-none focus:border-[#047857]"
          />
          <div className="flex flex-wrap gap-2">
            {groups.map((group) => (
              <button
                key={group}
                onClick={() => setActiveGroup(group)}
                className={`px-3 py-1 text-sm border rounded transition ${
                  activeGroup === group
                    ? 'bg-[#047857] border-[#047857] text-white'
                    : 'bg-white border-black/10 hover:bg-black/5 text-[#4b5563]'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((char) => {
            const petImageName = char.characterName.toLowerCase().replace(' ', '_');
            return (
              <div
                key={char.characterName}
                className="bg-white border border-black/10 rounded-lg p-6 shadow-sm hover:shadow transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full aspect-square bg-transparent flex items-center justify-center overflow-hidden mb-4">
                    {/* Render Character Image */}
                    <img
                      src={`/uploads/${petImageName}.png`}
                      alt={char.characterName}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback image source if file not found
                        e.currentTarget.src = 'https://placehold.co/300x300?text=' + char.characterName;
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{char.characterName}</h3>
                  <span className="inline-block bg-[#D1FAE5] text-[#065F46] text-xs font-bold px-2 py-0.5 rounded mb-3">
                    {char.role}
                  </span>
                  <p className="text-sm text-gray-600 mb-4">{char.description}</p>
                </div>
                <div className="border-t border-black/5 pt-3 flex justify-between items-center text-xs text-gray-500">
                  <span>Group: <strong className="text-gray-700">{char.group}</strong></span>
                  <span className="text-[#047857] font-semibold">Active</span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredRoles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No outlaws matched your filters. Try search term again.
          </div>
        )}
      </div>
    </div>
  );
}
