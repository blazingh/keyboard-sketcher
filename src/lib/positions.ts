export function calculateCenterPosition(positions: { x: number, y: number }[], decimalPlaces: number = 2) {
  // Check if the array is empty
  if (positions.length === 0) {
    return null; // No center position if there are no points
  }

  if (positions.length === 1) {
    return positions[0]; // No center position if there are no points
  }

  let totalX = 0;
  let totalY = 0;

  // Sum up all x and y coordinates
  for (let i = 0; i < positions.length; i++) {
    totalX += positions[i].x;
    totalY += positions[i].y;
  }

  // Calculate average x and y coordinates
  const centerX = totalX / positions.length;
  const centerY = totalY / positions.length;

  // Round the coordinates to the specified number of decimal places
  const roundedCenterX = Number(centerX.toFixed(decimalPlaces));
  const roundedCenterY = Number(centerY.toFixed(decimalPlaces));

  return { x: roundedCenterX, y: roundedCenterY };
}
