
export type ModelWorkerResult = {
  id: number
  geometries: {
    id: number
    label: string
    geom: any
  }[]
}

export type ModelAOptionsTypes = {
  plateThick?: number,
  wallThick?: number,
  caseTopMargin?: number,
  caseBottomMargin?: number,
  caseTopRadius?: number,
}

export const modelADefaultOptionsValues: ModelAOptionsTypes = {
  plateThick: 3,
  wallThick: 4,
  caseTopMargin: 0,
  caseBottomMargin: 10,
  caseTopRadius: 0,
}

export const modelAOptionsList: {
  id: number
  label: string,
  key: keyof ModelAOptionsTypes
  description: string,
  type: "number",
}[] = [
    {
      id: 1,
      key: "plateThick",
      label: "Plate Thickness",
      description: "the thickness of the switches plate",
      type: "number"
    },
    {
      id: 2,
      key: "wallThick",
      label: "Case Walls Thickness",
      description: "case walls thickness",
      type: "number"
    },
    {
      id: 3,
      key: "caseTopMargin",
      label: "Case Top height",
      description: "how much the case will extrude above the plate",
      type: "number"
    },
    {
      id: 4,
      key: "caseBottomMargin",
      label: "Case bottom height",
      description: "how much the case will extrude under the plate and the plate standoff",
      type: "number"
    },
    {
      id: 5,
      key: "caseTopRadius",
      label: "Case top roundness",
      description: "how round will the top of case walls be.the value can not be higher than the case wall thickness",
      type: "number"
    },
  ]
