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
    <div className={`relative bg-[#F2F2EC] rounded-xl border border-black/10 flex items-center justify-center overflow-hidden ${className}`}>
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
  );
}
