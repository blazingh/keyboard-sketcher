"use client"
import React, { useEffect, useState } from 'react';
import { StlViewer } from "react-stl-viewer";

const style = {
  width: '100%',
  height: '100%',
}

export default function ModelPreview({ fiberGeometries }: any) {
  const [url, setUrl] = useState<any>(null);
  useEffect(() => {
    console.log("nnn", fiberGeometries)
    const newUrl = URL.createObjectURL(new Blob(fiberGeometries))
    console.log(newUrl)
    setUrl(newUrl)
  }, fiberGeometries)

  if (!url) return "haha"

  return (
    <StlViewer
      style={style}
      orbitControls
      shadows
      url={url}
    />
  );
}
