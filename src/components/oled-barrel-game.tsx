import { useEffect, useRef } from "react";
import { useOledGame } from "@/lib/oled-game";

const W = 192;
const H = 64;
const GROUND = 56;
const PW = 7;
const PH = 10;
const STEP = 1 / 60;

type Barrel = { x: number; y: number; r: number; rot: number; counted: boolean };

export function OledBarrelGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const active = useOledGame((s) => s.active);
  const runId = useOledGame((s) => s.runId);
  const over = useOledGame((s) => s.over);
  const start = useOledGame((s) => s.start);
  const setOver = useOledGame((s) => s.setOver);
  const pressJump = useOledGame((s) => s.pressJump);
  const releaseJump = useOledGame((s) => s.releaseJump);
  const setRun = useOledGame((s) => s.setRun);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const g = ctx;

    const store = useOledGame.getState;
    let px = 28;
    let py = GROUND - PH;
    let vx = 0;
    let vy = 0;
    let coyote = 0;
    let jumpBuf = 0;
    let lastJump = 0;
    let cam = 0;
    let spawn = 0.7;
    let score = 0;
    let dead = false;
    let shake = 0;
    let barrels: Barrel[] = [];
    let acc = 0;
    let last = performance.now();
    let raf = 0;

    function grounded() {
      return py >= GROUND - PH - 0.01;
    }

    function jump() {
      vy = -118;
      coyote = 0;
      jumpBuf = 0;
    }

    function reset() {
      px = 28;
      py = GROUND - PH;
      vx = 0;
      vy = 0;
      coyote = 0;
      jumpBuf = 0;
      lastJump = 0;
      cam = 0;
      spawn = 0.7;
      score = 0;
      dead = false;
      shake = 0;
      barrels = [];
    }

    function die() {
      if (dead) return;
      dead = true;
      shake = 0.28;
      vx = 0;
      setOver(true);
    }

    function step(dt: number) {
      const s = store();
      if (!s.active) return;
      if (s.over && !dead) die();

      if (s.jumpSeq !== lastJump) {
        lastJump = s.jumpSeq;
        jumpBuf = 0.14;
      }

      if (dead) {
        shake = Math.max(0, shake - dt);
        return;
      }

      if (grounded()) coyote = 0.1;
      else coyote = Math.max(0, coyote - dt);
      jumpBuf = Math.max(0, jumpBuf - dt);

      if (jumpBuf > 0 && coyote > 0) jump();

      if (!s.jumpHeld && vy < -30) vy *= 0.55;

      vx = s.run ? 58 : vx * Math.exp(-10 * dt);
      if (Math.abs(vx) < 2 && !s.run) vx = 0;

      const grav = vy < 0 ? 260 : 520;
      vy = Math.min(160, vy + grav * dt);

      px += vx * dt;
      py += vy * dt;
      if (py > GROUND - PH) {
        py = GROUND - PH;
        vy = 0;
      }
      if (px < cam + 8) px = cam + 8;

      const look = s.run ? 36 : 22;
      const want = px - look;
      cam += (want - cam) * Math.min(1, 8 * dt);
      if (cam < 0) cam = 0;

      spawn -= dt;
      const gap = Math.max(0.72, 1.25 - score * 0.03);
      if (spawn <= 0) {
        spawn = gap + Math.random() * 0.28;
        barrels.push({
          x: cam + W + 10,
          y: GROUND - 5,
          r: 5,
          rot: 0,
          counted: false,
        });
      }

      const bvx = -(42 + Math.min(28, score * 1.4));
      for (const b of barrels) {
        b.x += bvx * dt;
        b.rot += 7 * dt;
        if (!b.counted && b.x + b.r < px) {
          b.counted = true;
          score += 1;
        }
      }
      barrels = barrels.filter((b) => b.x > cam - 20);

      const left = px;
      const right = px + PW;
      const top = py;
      const bot = py + PH;
      for (const b of barrels) {
        const cx = Math.max(left, Math.min(b.x, right));
        const cy = Math.max(top, Math.min(b.y, bot));
        const dx = b.x - cx;
        const dy = b.y - cy;
        if (dx * dx + dy * dy < b.r * b.r * 0.82) {
          die();
          break;
        }
      }
    }

    function draw() {
      g.imageSmoothingEnabled = false;
      g.fillStyle = "#07060a";
      g.fillRect(0, 0, W, H);

      const ox = dead ? (Math.random() - 0.5) * shake * 24 : 0;
      g.save();
      g.translate(Math.round(-cam + ox), 0);

      g.fillStyle = "#1a2210";
      for (let x = Math.floor(cam / 16) * 16; x < cam + W + 16; x += 16) {
        g.fillRect(x, GROUND, 12, 1);
      }
      g.fillStyle = "#d6de3a";
      g.fillRect(cam, GROUND, W, 1);

      for (const b of barrels) {
        drawBarrel(g, b);
      }
      drawRunner(g, px, py, vx, vy);

      g.restore();

      g.fillStyle = "#d6de3a";
      g.font = "7px 'Chakra Petch', monospace";
      g.fillText(String(score).padStart(3, "0"), 4, 9);

      if (dead) {
        g.fillStyle = "rgba(0,0,0,0.45)";
        g.fillRect(0, 0, W, H);
        g.fillStyle = "#d6de3a";
        g.font = "12px 'Chakra Petch', monospace";
        g.textAlign = "center";
        g.fillText("GAME OVER", W / 2, 28);
        g.font = "7px 'Chakra Petch', monospace";
        g.fillText("PRESS LUMINATE", W / 2, 42);
        g.textAlign = "left";
      }
    }

    function frame(now: number) {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      acc += dt;
      while (acc >= STEP) {
        step(STEP);
        acc -= STEP;
      }
      draw();
      raf = requestAnimationFrame(frame);
    }

    reset();
    raf = requestAnimationFrame(frame);

    const probe = {
      getYaw: () => 0,
      getSpeed: () => vx,
      setKeys: (codes: string[]) => {
        const run =
          codes.includes("KeyD") ||
          codes.includes("ArrowRight") ||
          codes.includes("Period");
        setRun(run);
        if (
          codes.includes("KeyA") ||
          codes.includes("ArrowLeft") ||
          codes.includes("Comma") ||
          codes.includes("Space")
        ) {
          pressJump();
        } else {
          releaseJump();
        }
      },
    };
    window.__controlsTest = probe;

    return () => {
      cancelAnimationFrame(raf);
      if (window.__controlsTest === probe) delete window.__controlsTest;
    };
  }, [active, runId, pressJump, releaseJump, setOver, setRun]);

  useEffect(() => {
    if (!active) return;
    function down(e: KeyboardEvent) {
      if (e.repeat) return;
      if (e.code === "ArrowRight" || e.code === "Period" || e.code === "KeyD") {
        e.preventDefault();
        setRun(true);
      }
      if (
        e.code === "ArrowLeft" ||
        e.code === "Comma" ||
        e.code === "KeyA" ||
        e.code === "Space"
      ) {
        e.preventDefault();
        pressJump();
      }
      if (e.code === "Enter" && useOledGame.getState().over) {
        e.preventDefault();
        start();
      }
    }
    function up(e: KeyboardEvent) {
      if (e.code === "ArrowRight" || e.code === "Period" || e.code === "KeyD") {
        setRun(false);
      }
      if (
        e.code === "ArrowLeft" ||
        e.code === "Comma" ||
        e.code === "KeyA" ||
        e.code === "Space"
      ) {
        releaseJump();
      }
    }
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [active, pressJump, releaseJump, setRun, start]);

  return (
    <canvas
      ref={canvasRef}
      className="oled-game"
      width={W}
      height={H}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (over) return;
        pressJump();
      }}
      onPointerUp={() => releaseJump()}
      aria-label="Barrel jumper. Left key jumps, right key runs."
    />
  );
}

function drawBarrel(ctx: CanvasRenderingContext2D, b: Barrel) {
  ctx.save();
  ctx.translate(Math.round(b.x), Math.round(b.y));
  ctx.rotate(b.rot);
  ctx.fillStyle = "#c45a18";
  ctx.beginPath();
  ctx.arc(0, 0, b.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#f0c040";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, b.r - 0.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-b.r + 1, 0);
  ctx.lineTo(b.r - 1, 0);
  ctx.stroke();
  ctx.restore();
}

function drawRunner(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  vx: number,
  vy: number,
) {
  const gx = Math.round(x);
  const gy = Math.round(y);
  const bob = vx > 8 && vy === 0 ? (Math.floor(performance.now() / 90) % 2) : 0;
  ctx.fillStyle = "#6b3cff";
  ctx.fillRect(gx + 1, gy + 2 + bob, 5, 6);
  ctx.fillStyle = "#f4f0ff";
  ctx.fillRect(gx + 2, gy + 4 + bob, 3, 3);
  ctx.fillStyle = "#1a1420";
  ctx.fillRect(gx + 4, gy + 3 + bob, 2, 2);
  ctx.fillStyle = "#f4a020";
  ctx.fillRect(gx + 5, gy + 5 + bob, 2, 1);
  ctx.fillRect(gx + 1, gy + 8 + bob, 2, 2);
  ctx.fillRect(gx + 4, gy + 8 + bob, 2, 2);
  ctx.fillStyle = "#d6de3a";
  ctx.fillRect(gx + 2, gy + bob, 3, 2);
}

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      setKeys?: (codes: string[]) => void;
    };
  }
}
