// components/FertilizerModel.js
"use client";

import React, { useEffect } from 'react';

// This is a simple wrapper component for the <model-viewer> web component.
// It makes it easier to use within a React/Next.js application.
export default function FertilizerModel() {
  // We need to useEffect to ensure the model-viewer script has loaded
  // before we try to use the component. This avoids potential hydration errors.
  useEffect(() => {
    // Dynamically import the model-viewer library.
    // This ensures it only runs on the client-side.
    import('@google/model-viewer');
  }, []);

  return (
    <div className="w-full h-full">
      {/* The <model-viewer> element is a custom HTML tag provided by the library.
        We can pass properties to it just like standard HTML attributes.
      */}
      <model-viewer
        src="/fertilizer-bag.glb" // Make sure this path is correct in your `public` folder
        alt="A 3D model of a fertilizer bag"
        camera-controls
        auto-rotate
        ar
        shadow-intensity="1"
        style={{ width: '100%', height: '100%', '--poster-color': 'transparent' }}
      ></model-viewer>
    </div>
  );
}
