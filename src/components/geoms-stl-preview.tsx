import { CSG2Geom } from "@/lib/geometries";
import { ModelWorkerResult } from "@/workers/model-a-options";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { BackSide, DirectionalLight, MeshStandardMaterial, PCFSoftShadowMap } from "three";
import { Switch } from "./ui/switch";

export function GeomsStlPreview({ geoms }: { geoms: ModelWorkerResult["geometries"] }) {

  const [hiddenGeoms, setHiddenGeoms] = useState<any[]>([])

  const light = new DirectionalLight('white', 1);
  light.position.set(0, 0, 0);

  const mat = new MeshStandardMaterial({ side: BackSide })

  return (
    <div className="w-full h-full relative">
      <div className="absolute w-full h-full">
        <Canvas
          shadows
          gl={{
            preserveDrawingBuffer: true,
            shadowMapType: PCFSoftShadowMap,
            antialias: true
          }}
          onCreated={({ camera, scene }) => {
            camera.add(light);
            scene.add(camera);
          }}>
          <OrbitControls />
          <ambientLight intensity={0.3} color={'white'} />

          {geoms.map((csg: ModelWorkerResult["geometries"][number]) => !hiddenGeoms.includes(csg.id) && (
            <mesh key={csg.id} geometry={CSG2Geom(csg.geom)} position={[0, 0, 0]} material={mat} scale={0.1} />
          ))}

        </Canvas>
      </div>
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        {geoms.map((csg: ModelWorkerResult["geometries"][number]) => (
          <div key={csg.id} className="flex gap-2">
            <Switch
              checked={!hiddenGeoms.includes(csg.id)}
              onCheckedChange={() =>
                setHiddenGeoms(p =>
                  p.includes(csg.id)
                    ? p.filter(el => el !== csg.id)
                    : [...p, csg.id]
                )}
            />
            <label>{csg.label}</label>
          </div>
        ))}
      </div>

    </div>
  )
}
