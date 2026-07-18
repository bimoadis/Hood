"use client";

import React from 'react';

interface PixelPetRendererProps {
  species: string;
  evolutionLvl: number;
  weaponId?: string;
  className?: string;
}

export default function PixelPetRenderer({
  species,
  evolutionLvl,
  weaponId,
  className = "w-48 h-48",
}: PixelPetRendererProps) {
  // Map species to folder structures
  const baseFolder = `/assets/pets/${species.toLowerCase()}`;

  return (
    <div className={`relative bg-[#F2F2EC] rounded-xl border border-black/10 flex items-center justify-center overflow-hidden ${className}`}>
      {/* Layer 1: Base Body Grid */}
      <img
        src={`${baseFolder}/base.png`}
        className="absolute z-10 w-full h-full object-contain pixelated"
        alt={`${species} body`}
        onError={(e) => {
          // Fallback image representation if file is missing during dev
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
    </div>
  );
}
