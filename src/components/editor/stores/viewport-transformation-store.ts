import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { produce } from 'immer'

const editorWidth = 1500
const editorHeight = 1000

export type TransformMatrix = {
  x: number, // x translation
  y: number, // y translation
  s: number // scale 
}

type State = {
  viewportSize: { w: number, h: number }

  /* viewport transformation for panning and zooming */
  transformMatrix: TransformMatrix
}

type Action = {
  initViewport: (viewport: State["viewportSize"]) => void
  setTransformMatrix: (transformation: TransformMatrix) => void
  TransformMatrixStyle: () => string
}

export type ViewportTransformationStoreType = State & Action
export const useViewportTransformationStore = create<ViewportTransformationStoreType>()(
  persist((set, get) => ({
    initViewport: (viewport) => {
      set(produce((state: State) => {
        state.viewportSize = viewport
        if (state.transformMatrix.x === 0 && state.transformMatrix.y === 0)
          state.transformMatrix = {
            s: 1,
            x: viewport.w / 2,
            y: viewport.h / 2
          }
      }))
    },
    transformMatrix: { x: 0, y: 0, s: 1 },
    viewportSize: { w: 0, h: 0 },
    TransformMatrixStyle: () => {
      const { x, y, s } = get().transformMatrix
      return `matrix(${s}, ${0}, ${0}, ${s}, ${x}, ${y})`
    },
    setTransformMatrix(transformation) {
      set(produce((state: State) => {
        const { w, h } = state.viewportSize
        const { x, y, s } = state.transformMatrix
        const { x: nx, y: ny, s: ns } = transformation
        state.transformMatrix.x =
          Math.min(Math.max(x + nx, -editorWidth * s + w / 2), editorWidth * s + w / 2)
        state.transformMatrix.y =
          Math.min(Math.max(y + ny, -editorHeight * s + h / 2), editorHeight * s + h / 2)
        state.transformMatrix.s =
          Math.min(Math.max(s + ns, 0.22), 2.2)
      }))
    },
  }),
    {
      name: 'viewport-transformation',
      skipHydration: true,
      version: 1,
      partialize: (state) => ({ transformMatrix: state.transformMatrix }),
    }
  )
)
