
export type ModelWorkerResult = {
  id: number
  geometries: {
    id: number
    label: string
    geom: any
  }[]
}

export const modelOptions: {
  id: number
  label: string,
  description: string,
  type: "number",
}[] = [
    {
      id: 1,
      label: "Plate Thickness",
      description: "the thickness of the switchs plate",
      type: "number"
    },
    {
      id: 2,
      label: "Case Walls Thickness",
      description: "case walls thickness",
      type: "number"
    },
    {
      id: 3,
      label: "Case Top height",
      description: "how much the case will extrude above the plate",
      type: "number"
    },
    {
      id: 4,
      label: "Case bottom height",
      description: "how much the case will extrude under the plate and the plate standoff",
      type: "number"
    },
    {
      id: 5,
      label: "Case top roundness",
      description: "how round will the top of case walls be.the value can not be higher than the case wall thickness",
      type: "number"
    },
  ]
