import React, { HTMLProps } from 'react'
import { Canvas } from '@react-three/fiber'
import SceneSetup, { SceneSetupProps } from './scene-setup'
import ErrorBoundary from './error-boundary'
import { PCFSoftShadowMap } from 'three'

type DivProps = Omit<HTMLProps<HTMLDivElement>, 'color' | 'onError'>

export interface StlViewerProps extends DivProps, SceneSetupProps {
  onError?: (err: Error) => void
  canvasId?: string
}

const StlViewer: React.FC<StlViewerProps> = (
  {
    url,
    geoms,
    cameraProps,
    modelProps,
    floorProps,
    children,
    onError,
    extraHeaders,
    onFinishLoading,
    canvasId,
    shadows,
    showAxes,
    orbitControls,
    cameraInitialPosition,
    ...otherProps
  }
) => {
  const sceneProps: SceneSetupProps = {
    url,
    geoms,
    cameraProps,
    modelProps,
    floorProps,
    extraHeaders,
    onFinishLoading,
    shadows,
    showAxes,
    orbitControls,
    cameraInitialPosition
  }

  return (
    <div {...otherProps}>
      <ErrorBoundary onError={onError}>
        <React.Suspense fallback={null}>
          <Canvas
            shadows
            gl={{
              preserveDrawingBuffer: true,
              shadowMapType: PCFSoftShadowMap,
              antialias: true
            }}
            id={canvasId}
            style={{ width: '100%', height: '100%' }}
          >
            <SceneSetup {...sceneProps} />
            {children}
          </Canvas>
        </React.Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default StlViewer
