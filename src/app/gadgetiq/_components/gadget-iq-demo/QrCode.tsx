// Deterministic, dependency-free stand-in for a scannable QR code.
// This demo's certificates are watermarked "SAMPLE" and are not meant to be
// scanned for real, so a real QR encoder isn't worth pulling in as a dependency.
function hashGrid(text: string, size: number): boolean[] {
  let h = 2166136261;
  for (const c of text) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  const cells: boolean[] = [];
  for (let i = 0; i < size * size; i++) {
    h ^= h << 13;
    h |= 0;
    h ^= h >>> 17;
    h ^= h << 5;
    h |= 0;
    cells.push(((h >>> 0) & 0xff) / 255 > 0.52);
  }
  return cells;
}

function isFinderZone(x: number, y: number, size: number) {
  const zones = [
    [0, 0],
    [size - 7, 0],
    [0, size - 7],
  ];
  return zones.some(([zx, zy]) => x >= zx && x < zx + 7 && y >= zy && y < zy + 7);
}

function finderAt(x: number, y: number, zx: number, zy: number) {
  const lx = x - zx, ly = y - zy;
  const onRing = lx === 0 || lx === 6 || ly === 0 || ly === 6;
  const onCore = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
  return onRing || onCore;
}

export default function QrCode({ value, size = 106, className }: { value: string; size?: number; className?: string }) {
  const cols = 21;
  const cells = hashGrid(value, cols);
  const cell = size / cols;
  const zones: [number, number][] = [
    [0, 0],
    [cols - 7, 0],
    [0, cols - 7],
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label="QR code linking to this certificate"
    >
      <rect width={size} height={size} fill="#fff" />
      {Array.from({ length: cols }, (_, y) =>
        Array.from({ length: cols }, (_, x) => {
          if (isFinderZone(x, y, cols)) return null;
          const on = cells[y * cols + x];
          if (!on) return null;
          return <rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill="#17284D" />;
        })
      )}
      {zones.map(([zx, zy]) => (
        <g key={`${zx}-${zy}`}>
          {Array.from({ length: 7 }, (_, y) =>
            Array.from({ length: 7 }, (_, x) => {
              if (!finderAt(zx + x, zy + y, zx, zy)) return null;
              return <rect key={`${x}-${y}`} x={(zx + x) * cell} y={(zy + y) * cell} width={cell} height={cell} fill="#17284D" />;
            })
          )}
        </g>
      ))}
    </svg>
  );
}
