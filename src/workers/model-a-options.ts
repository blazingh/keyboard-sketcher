
export type ModelWorkerResult = {
  id: number
  geometries: {
    id: number
    label: string
    geom: any
  }[]
}

export type ModelAOptionsTypes = {
  baseThickness: string,
  switchGruveThick: string,

  plateHeight: string,
  plateThickness: string,

  wallHeight: string,
  wallThickness: string,
  wallRadius: string,

  standoffThick: string,
  wallSwitchPadding: string,

  mcuHeigth: string
}

export const modelADefaultOptionsValues: ModelAOptionsTypes = {
  baseThickness: "3",
  switchGruveThick: "1.5",

  plateHeight: "9",
  plateThickness: "3",

  wallHeight: "12",
  wallThickness: "4",
  wallRadius: "0",

  standoffThick: "3",
  wallSwitchPadding: "2.5",

  mcuHeigth: "1.5"
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
      key: "baseThickness",
      label: "Case base thickness",
      description: "case bottom thickness (min: 2mm)",
      type: "number"
    },
    {
      id: 2,
      key: "plateThickness",
      label: "Plate Thickness",
      description: "switches plate thickness (min: 1.5mm)",
      type: "number"
    },
    {
      id: 3,
      key: "plateHeight",
      label: "Plate height",
      description: "Distance from the top of the case base to the bottom of the plate",
      type: "number"
    },
    {
      id: 4,
      key: "wallThickness",
      label: "Case Walls thickness",
      description: "case walls thickness(min: 2mm)",
      type: "number"
    },
    {
      id: 5,
      key: "wallHeight",
      label: "Case walls height",
      description: "Case walls height (min: base_thickness + plate_height + plate_thickness)",
      type: "number"
    },
    {
      id: 6,
      key: "wallRadius",
      label: "Case top roundness",
      description: "Case walls top roundness (max: wall_thickness / 2)",
      type: "number"
    },
    {
      id: 7,
      key: "wallSwitchPadding",
      label: "wall switch distance",
      description: "distance between the switches and case walls (min: 3mm)",
      type: "number"
    },
    {
      id: 8,
      key: "mcuHeigth",
      label: "mcu elevation",
      description: "distance from the bottom of the case base to the bottom of the mcu (min: 1.5mm)",
      type: "number"
    },
  ]
