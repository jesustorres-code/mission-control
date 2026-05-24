type Props = {
  size?: number;
  color?: string;
  className?: string;
};

// 8x8 pixel octopus mark — drawn as a tiny SVG grid
export default function PixelOctopus({ size = 24, color = '#6b21a8', className = '' }: Props) {
  const px = 1;
  // 1 = filled, 0 = empty
  const grid = [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 1, 1, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 1],
    [0, 1, 0, 0, 0, 0, 1, 0],
  ];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 8 8"
      className={`pixelated ${className}`}
      aria-label="octopus"
    >
      {grid.map((row, y) =>
        row.map((cell, x) =>
          cell ? <rect key={`${x}-${y}`} x={x} y={y} width={px} height={px} fill={color} /> : null
        )
      )}
    </svg>
  );
}
