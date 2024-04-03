import { Node } from "reactflow";

export const initialNodes: Node[] = [
  { id: "1", type: 'mcu', position: { x: 190, y: 85 }, data: { label: 'mcu', rotation: '0', width: 210, height: 520 }, zIndex: 0 },
  { id: "2", type: 'switch', position: { x: 0, y: 0 }, data: { label: 'Switch', rotation: '0', width: 140, height: 140 }, zIndex: 10 },
  { id: "3", type: 'switch', position: { x: 190, y: 0 }, data: { label: 'Switch', rotation: '0', width: 140, height: 140 }, zIndex: 10 },
  { id: "4", type: 'switch', position: { x: 380, y: 0 }, data: { label: 'Switch', rotation: '0', width: 140, height: 140 }, zIndex: 10 },
  { id: "5", type: 'switch', position: { x: 0, y: 190 }, data: { label: 'Switch', rotation: '0', width: 140, height: 140 }, zIndex: 10 },
  { id: "6", type: 'switch', position: { x: 190, y: 190 }, data: { label: 'Switch', rotation: '0', width: 140, height: 140 }, zIndex: 10 },
  { id: "7", type: 'switch', position: { x: 380, y: 190 }, data: { label: 'Switch', rotation: '0', width: 140, height: 140 }, zIndex: 10 },
  { id: "8", type: 'switch', position: { x: 0, y: 380 }, data: { label: 'Switch', rotation: '0', width: 140, height: 140 }, zIndex: 10 },
  { id: "9", type: 'switch', position: { x: 190, y: 380 }, data: { label: 'Switch', rotation: '0', width: 140, height: 140 }, zIndex: 10 },
  { id: "10", type: 'switch', position: { x: 380, y: 380 }, data: { label: 'Switch', rotation: '0', width: 140, height: 140 }, zIndex: 10 },
];
