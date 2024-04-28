import { CSSProperties, useEffect, useRef } from 'react';
import { ReactFlowState, useStore } from 'reactflow';

const canvasStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  zIndex: 10,
  pointerEvents: 'none',
};

export type HelperLinesProps = {
  horizontal?: number;
  vertical?: number;
  width: number,
  height: number
};

// a simple component to display the helper lines
// it puts a canvas on top of the React Flow pane and draws the lines using the canvas API
export function SnapLinesRenderer({ horizontal, vertical, width, height }: HelperLinesProps) {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!ctx || !canvas) {
      return;
    }

    const dpi = window.devicePixelRatio;
    canvas.width = width * dpi;
    canvas.height = height * dpi;

    ctx.scale(dpi, dpi);
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#0041d0';

    if (typeof vertical === 'number') {
      ctx.moveTo(vertical, 0);
      ctx.lineTo(vertical, height);
      ctx.stroke();
    }

    if (typeof horizontal === 'number') {
      ctx.moveTo(0, horizontal);
      ctx.lineTo(width, horizontal);
      ctx.stroke();
    }
  }, [width, height, horizontal, vertical]);

  return (
    <canvas
      ref={canvasRef}
      style={canvasStyle}
    />
  );
}
