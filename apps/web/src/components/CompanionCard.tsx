"use client";

import React from 'react';
import PixelPetRenderer from './PixelPetRenderer';

interface CompanionCardProps {
  cardType: 'Hatching card' | 'Meal card' | 'Status card' | 'Adventure card';
  cardNumber: string;
  title: string;
  description: string;
  bottomLeft?: string;
  bottomRight?: string | React.ReactNode;
  species: string;
  evolutionLvl: number;
  weaponId?: string;
  companionName?: string;
  // Custom status metadata for Card 3 specifically
  statusMetadata?: {
    mood: string;
    stage: string;
  };
}

export default function CompanionCard({
  cardType,
  cardNumber,
  title,
  description,
  bottomLeft,
  bottomRight,
  species,
  evolutionLvl,
  weaponId,
  companionName,
  statusMetadata,
}: CompanionCardProps) {
  // Determine Theme Style based on Card Type
  let theme = {
    primary: '#4c7a4c', // green
    secondary: '#2e5b2e',
    light: '#f1f6f1',
    borderColor: '#8ba68b',
    icon: '🍃',
  };

  if (cardType === 'Meal card') {
    theme = {
      primary: '#c4935a', // orange/brown
      secondary: '#9e6e36',
      light: '#faf6f0',
      borderColor: '#d9b993',
      icon: '🍴',
    };
  } else if (cardType === 'Status card') {
    theme = {
      primary: '#3b7a57', // forest green
      secondary: '#225238',
      light: '#f2faf5',
      borderColor: '#82bfa2',
      icon: '📈',
    };
  } else if (cardType === 'Adventure card') {
    theme = {
      primary: '#8b5cf6', // purple
      secondary: '#6d28d9',
      light: '#f5f3ff',
      borderColor: '#c084fc',
      icon: '🧭',
    };
  }



  return (
    <div 
      className="relative w-full bg-white rounded-2xl p-4 shadow-sm flex flex-col justify-between gap-2"
      style={{ 
        border: `3px double ${theme.borderColor}`,
      }}
    >
      {/* Corner Ornate Decorations */}
      <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2" style={{ borderColor: theme.primary }} />
      <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2" style={{ borderColor: theme.primary }} />
      <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2" style={{ borderColor: theme.primary }} />
      <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2" style={{ borderColor: theme.primary }} />

      {/* HEADER SECTION */}
      <div className="w-full flex justify-between items-center font-mono text-[10px] font-bold tracking-wider mb-1 px-0.5">
        <div className="flex items-center gap-1" style={{ color: theme.primary }}>
          <span>{theme.icon}</span>
          <span className="uppercase text-[9px]">{cardType}</span>
        </div>
        <span className="text-gray-400 text-[9px]">{cardNumber}</span>
      </div>

      {/* PORTRAIT SECTION */}
      <div className="w-full h-32 relative flex items-center justify-center">
        <PixelPetRenderer
          companionName={companionName}
          species={species}
          evolutionLvl={evolutionLvl}
          weaponId={weaponId}
          className="w-full h-full"
        />
      </div>

      {/* DIVIDER WITH BADGE */}
      <div className="w-full relative flex items-center justify-center my-3">
        <div className="w-full border-t border-dashed" style={{ borderColor: theme.borderColor }} />
        <div 
          className="absolute w-8 h-8 rounded-full border flex items-center justify-center bg-white text-sm"
          style={{ borderColor: theme.borderColor, color: theme.primary }}
        >
          {theme.icon}
        </div>
      </div>

      {/* TITLE & DESCRIPTION */}
      <div className="w-full text-center flex-1 flex flex-col justify-center px-2">
        {/* Small separator diamond */}
        <div className="text-[10px] leading-none mb-1" style={{ color: theme.primary }}>◆</div>
        <h3 className="font-display font-bold text-lg text-gray-900 leading-tight mb-2">
          {title}
        </h3>
        <div className="text-[10px] leading-none mb-2" style={{ color: theme.primary }}>◆</div>
        <p className="text-gray-600 text-xs leading-relaxed max-w-[220px] mx-auto">
          {description}
        </p>
      </div>

      {/* METADATA SECTION */}
      <div 
        className="w-full mt-4 pt-2.5 border-t border-dashed flex flex-col gap-1 text-[10px] font-mono"
        style={{ borderColor: theme.borderColor }}
      >
        {statusMetadata ? (
          // Custom Metadata layout for Status Card (Card 3)
          <div className="flex flex-col gap-1 px-1">
            <div className="flex justify-between items-center text-gray-600">
              <span className="flex items-center gap-1 font-bold">❤️ MOOD:</span>
              <span className="uppercase text-gray-800 font-bold">{statusMetadata.mood}</span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span className="flex items-center gap-1 font-bold">🍃 STAGE:</span>
              <span className="uppercase text-gray-800 font-bold">{statusMetadata.stage}</span>
            </div>
          </div>
        ) : (
          // Default Metadata layout (Cards 1, 2, 4)
          <div className="flex justify-between items-center px-1">
            <span className="flex items-center gap-1 text-gray-600 font-bold uppercase">
              {theme.icon} {bottomLeft}
            </span>
            <div className="flex items-center">
              {cardType === 'Meal card' ? (
                <span 
                  className="px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase"
                  style={{ 
                    borderColor: theme.primary, 
                    color: theme.primary, 
                    backgroundColor: theme.light 
                  }}
                >
                  {bottomRight}
                </span>
              ) : (
                <span className="text-gray-800 font-bold uppercase">
                  {bottomRight}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
