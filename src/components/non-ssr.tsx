import { Stage, Layer, Circle } from 'react-konva';

function Canvas(props) {
  return (
    <Stage width={500} height={500} className='bg-white h-full w-full'>
      <Layer>
        <Circle x={200} y={100} radius={50} fill="green" />
      </Layer>
    </Stage>
  );
}

export default Canvas;
