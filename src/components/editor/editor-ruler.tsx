export function EditorRuler({
}: {
  }) {


  return (
    <></>
  )
}

function distanceBetweenPoints(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function orderByXPos(point1: any, point2: any) {
  if (point1.x < point2.x) {
    return [point1, point2];
  } else if (point1.x > point2.x) {
    return [point2, point1];
  } else {
    // If both points have the same x position, order by y position
    if (point1.y <= point2.y) {
      return [point1, point2];
    } else {
      return [point2, point1];
    }
  }
}
