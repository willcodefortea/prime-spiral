import { useEffect, useRef, useState } from "react";
import { useTransitionEffect } from "use-transition-effect";
import "./App.css";
import { drawSpiral } from "./drawSpiral";
import millerRabin from "./millerRabin";

const usePrimeSpiral = (
  canvasWidth: number,
  tileSize: number,
  showRandom: boolean,
  numIterations: number,
  falsePrimesOnly: boolean,
  highlightFalsePrimes: boolean
) => {
  const [_, startTransitionEffect] = useTransitionEffect();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [biggestPrime, setBiggestPrime] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    startTransitionEffect(function* () {
      yield* drawSpiral(
        context,
        canvasWidth,
        tileSize,
        (i) => {
          if (showRandom) return i % 2 === 1 && Math.random() > 0.8;
          return millerRabin(i, numIterations);
        },
        (i: number) => {
          if (showRandom) return "#fff";
          // change the colour if we think we want to draw a prime, but it is in
          // fact, not.
          setBiggestPrime(i);

          if (!highlightFalsePrimes) return "#fff";

          if (falsePrimesOnly)
            return millerRabin(i, 40) ? "rgba(0, 0, 0, 0)" : "#fff";
          return millerRabin(i, 40) ? "#fff" : "#f00";
        }
      );
    });
  }, [
    canvasRef.current,
    drawSpiral,
    showRandom,
    numIterations,
    canvasWidth,
    tileSize,
    falsePrimesOnly,
    highlightFalsePrimes,
  ]);

  const canvas = (
    <canvas
      className="spiral"
      ref={canvasRef}
      width={canvasWidth}
      height={canvasWidth}
    ></canvas>
  );

  return { biggestPrime, canvas };
};

function App() {
  const [showRandom, setShowRandom] = useState(false);
  const [falsePrimesOnly, setFalsePrimesOnly] = useState(false);
  const [highlightFalsePrimes, setHighlightFalsePrimes] = useState(true);
  const [numIterations, setNumIterations] = useState(1);
  const [canvasWidth, setCanvasWidth] = useState(300);
  const [tileSize, setTileSize] = useState(4);
  const { biggestPrime, canvas } = usePrimeSpiral(
    canvasWidth,
    tileSize,
    showRandom,
    numIterations,
    falsePrimesOnly,
    highlightFalsePrimes
  );

  return (
    <div className="App">
      <h1>Prime Spiral - with Miller–Rabin</h1>
      <summary className="info">
        Below is a{" "}
        <a href="https://en.wikipedia.org/wiki/Ulam_spiral">prime spiral</a>{" "}
        output, where primality is tested using a{" "}
        <a href="https://en.wikipedia.org/wiki/Miller%E2%80%93Rabin_primality_test">
          Miller–Rabin
        </a>{" "}
        algorithm. If you reduce the number of iterations, incorrectly
        identified primes will be highlighted. (A good limit for this is 40,
        beyond which it's more likely a cosmic ray hits the CPU and gives a bad
        result than the algorithm being incorrect.)
        <br />
        Biggest prime seen: {biggestPrime}
      </summary>
      <div>
        <label>
          Num iterations:{" "}
          <input
            value={numIterations}
            type="number"
            onChange={(e) => setNumIterations(parseInt(e.target.value) || 1)}
          />
        </label>
      </div>

      {canvas}

      <div>
        <span className="info">
          Tweaking the controls below will cause the canvas to zoom in and out,
          revealing more of the spiral. Have a play!
        </span>
        <label>
          Show random?{" "}
          <input
            checked={showRandom}
            type={"checkbox"}
            onChange={() => setShowRandom((v) => !v)}
          />
        </label>

        <label>
          Tile size{" "}
          <input
            type="number"
            value={tileSize}
            onChange={(e) => setTileSize(parseFloat(e.target.value))}
          />
        </label>

        <label>
          Canvas size{" "}
          <input
            type={"number"}
            value={canvasWidth}
            onChange={(e) => setCanvasWidth(parseInt(e.target.value))}
          ></input>
        </label>

        <label>
          Show only false primes?{" "}
          <input
            checked={falsePrimesOnly}
            type={"checkbox"}
            onChange={() => setFalsePrimesOnly((v) => !v)}
          />
        </label>

        <label>
          Highlight false primes (turn off for speed)?{" "}
          <input
            checked={highlightFalsePrimes}
            type={"checkbox"}
            onChange={() => setHighlightFalsePrimes((v) => !v)}
          />
        </label>
      </div>
    </div>
  );
}

export default App;
