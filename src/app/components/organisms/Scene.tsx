'use client';

import * as THREE from 'three'
import React, { useRef } from 'react';
import Box from '../atoms/Box';
import { OrthographicCamera, PerspectiveCamera, shaderMaterial } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber'
import { Texture } from 'three';

const BgGridMaterial = shaderMaterial(
  {
    time: 0, 
    color: new THREE.Color(0.2, 0.0, 0.1), 
    cameraPos: new THREE.Vector3()
  },
  // vertex shader
  /*glsl*/`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  /*glsl*/`
    uniform float time;
    uniform vec3 color;
    uniform vec3 cameraPos;
    varying vec2 vUv;
    void main() {
      vec2 gridPosition = mod(vUv * 100.0 + 0.25 * cameraPos.xy, 1.0);
      float circle = smoothstep(0.1, 0.05, length(gridPosition - vec2(0.5)));
      vec3 circleColor = color;// * (0.5 + 0.5 * cos(time + length(gridPosition)));
      gl_FragColor = vec4(circleColor * circle, 1.0);
    }
  `
);


extend({ BgGridMaterial })

type BgGridMaterialImpl = {
  color: string | THREE.Color
  time: number
  cameraPos: THREE.Vector3
} & JSX.IntrinsicElements['shaderMaterial']

declare global {
  namespace JSX {
    interface IntrinsicElements {
      bgGridMaterial: BgGridMaterialImpl
    }
  }
}

export default function _Canvas() {
  const cameraRef = useRef<THREE.OrthographicCamera>(null!);
  const material = useRef<BgGridMaterialImpl>(null!);


  useFrame((state) => {
    if (material.current.uniforms) {
      material.current.uniforms.time.value = state.clock.elapsedTime
    }

    // move camera
    cameraRef.current.position.x = Math.sin(state.clock.elapsedTime) * 10

    if (material.current.uniforms) {
      material.current.uniforms.cameraPos.value = cameraRef.current.position
    }
  })


  return (
    <object3D>
      <OrthographicCamera ref={cameraRef} makeDefault position={[0, 0, 100]} zoom={10}>
        <mesh position={[0, 0, -100]} rotation={[0, 0, 0]}>
          <planeGeometry args={[400, 400]} />
          <bgGridMaterial ref={material} color="#888" time={1} cameraPos={new THREE.Vector3()} />
        </mesh>
      </OrthographicCamera>
      <ambientLight intensity={2} />
      <Box position={[-12, 0, 0]} />
      <Box position={[12, 0, 0]} />
    </object3D>
  );
}