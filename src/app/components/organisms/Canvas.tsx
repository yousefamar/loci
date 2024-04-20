'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';

export default function _Canvas() {
  return (
    <Canvas>
      <Scene />
    </Canvas>
  );
}