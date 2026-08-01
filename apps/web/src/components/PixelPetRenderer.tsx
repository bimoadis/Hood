"use client";

import React from 'react';

interface PixelPetRendererProps {
  species: string;
  evolutionLvl: number;
  weaponId?: string;
  className?: string;
  companionName?: string;
}

export default function PixelPetRenderer({
  species,
  evolutionLvl,
  weaponId,
  className = "w-48 h-48",
  companionName,
}: PixelPetRendererProps) {
  // Map species to folder structures
  const baseFolder = `/assets/pets/${species.toLowerCase()}`;
  const customImgName = companionName ? companionName.toLowerCase().replace(' ', '_').replace('-', '_') : '';
  const customSrc = customImgName ? `/uploads/${customImgName}.png` : '';

  return (
    <div className={`relative flex flex-col items-center justify-center overflow-hidden ${className}`}>
      {/* Scaling wrapper (15% larger) */}
      <div className="w-full h-full flex items-center justify-center z-10" style={{ transform: 'scale(1.15)' }}>
        {/* Animated character container */}
        <div className="relative w-full h-[85%] flex items-center justify-center animate-walk">
          {customSrc ? (
            <img
              src={customSrc}
              className="absolute z-10 w-full h-full object-contain pixelated"
              alt={companionName || species}
            />
          ) : (
            <>
              {/* Layer 1: Base Body Grid */}
              <img
                src={`${baseFolder}/base.png`}
                className="absolute z-10 w-full h-full object-contain pixelated"
                alt={`${species} body`}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />

              {/* Layer 2: Evolution Clothes Overlay */}
              <img
                src={`${baseFolder}/outfit_stage_${evolutionLvl}.png`}
                className="absolute z-20 w-full h-full object-contain pixelated"
                alt={`${species} evolution stage ${evolutionLvl}`}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />

              {/* Layer 3: Weapon Attachment Overlay */}
              {weaponId && (
                <img
                  src={`/assets/equipments/${weaponId.toLowerCase()}.png`}
                  className="absolute z-30 w-full h-full object-contain pixelated"
                  alt={`${weaponId} weapon attachment`}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Dynamic shadow at the bottom */}
      <div className="absolute bottom-2 w-1/4 h-2 bg-black rounded-full animate-shadow filter blur-[1px] z-0" />
    </div>
  );
}
