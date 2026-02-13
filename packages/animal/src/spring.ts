import type { SpringParams } from "./easings";

type SpringSimulationOptions = SpringParams & {
  initialVelocity?: number;
  restDelta?: number;
  restSpeed?: number;
  maxDurationMs?: number;
  fps?: number;
};

export type SpringSimulationResult = Readonly<{
  values: number[];
  durationMs: number;
}>;

// A tiny spring simulation to generate keyframes for WAAPI.
// We simulate a 1D spring from 0 -> 1 and return sampled progress values.
export function simulateSpring({
  stiffness,
  damping,
  mass,
  initialVelocity = 0,
  restDelta = 0.001,
  restSpeed = 0.001,
  maxDurationMs = 2000,
  fps = 60,
}: SpringSimulationOptions): SpringSimulationResult {
  const dt = 1 / fps;
  const maxSteps = Math.ceil((maxDurationMs / 1000) / dt);

  let x = 0;
  let v = initialVelocity;
  const values: number[] = [x];

  // Target is always 1. Position is x, velocity is v.
  for (let step = 0; step < maxSteps; step += 1) {
    const displacement = x - 1;
    const springForce = -stiffness * displacement;
    const dampingForce = -damping * v;
    const a = (springForce + dampingForce) / mass;

    // Semi-implicit Euler (more stable than explicit Euler for springs).
    v = v + a * dt;
    x = x + v * dt;
    values.push(x);

    const isAtRest = Math.abs(v) <= restSpeed && Math.abs(1 - x) <= restDelta;
    if (isAtRest && values.length > 8) break;
  }

  const durationMs = Math.round(((values.length - 1) / fps) * 1000);
  return { values, durationMs };
}

