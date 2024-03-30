"use client"
import React, { useState, useEffect, useRef, useMemo } from 'react';
import hull from 'hull.js'
import cluster from 'density-clustering'

function PointPlotter() {
  const canvasRef = useRef<any>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [points1, setPoints1] = useState([
    [100, 100], [100, 240], [100, 380],
    [240, 100], [240, 240], [240, 380], [240, 520],
    [380, 100], [380, 240], [380, 380],
    [480, 240],
    [580, 240], [580, 580],
    [780, 240], [780, 580]
  ])
  const points2 = useMemo(() => {
    const newPoints: any = []
    // for each point in points1 add 4 new poinst around it +10 -10 in x and y
    points1.map((point) => {
      newPoints.push(point)
      newPoints.push([point[0] + 70, point[1] + 70])
      newPoints.push([point[0] - 70, point[1] - 70])
      newPoints.push([point[0] + 70, point[1] - 70])
      newPoints.push([point[0] - 70, point[1] + 70])

      newPoints.push([point[0] + 70, point[1] + 0])
      newPoints.push([point[0] - 70, point[1] + 0])
      newPoints.push([point[0] - 0, point[1] - 70])
      newPoints.push([point[0] - 0, point[1] + 70])
    })
    const dbscan = new cluster.DBSCAN()
    let clusters = dbscan.run(points1, 250, 50);
    clusters = clusters.map(function(cluster) {
      return cluster.map(function(i) {
        return newPoints[i]; // map index to point
      });
    });
    console.log(clusters)
    const newHull = hull(newPoints, 198)
    return newHull
  }, points1)

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size to full screen
    canvas.width = width;
    canvas.height = height;

    // Draw points from the first array
    ctx.fillStyle = 'blue'; // Set point color (adjust as needed)
    points1.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2); // Draw circles with radius 3
      ctx.fill();
    });

    // Connect points with lines from the second array
    ctx.strokeStyle = 'red'; // Set line color (adjust as needed)
    ctx.lineWidth = 2; // Set line width (adjust as needed)
    ctx.beginPath(); // Start a new path for lines
    points2.forEach(([x1, y1]: any, index: number) => {
      if (index > 0) { // Skip the first point to avoid starting without a previous point
        const [x2, y2] = points2[index - 1] as any; // Get previous point coordinates
        ctx.moveTo(x2, y2); // Move to previous point
        ctx.lineTo(x1, y1); // Draw line to current point
      }
    });
    ctx.stroke(); // Draw all lines
  }, [width, height, points1, points2]);

  // Update dimensions on window resize
  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default PointPlotter;
