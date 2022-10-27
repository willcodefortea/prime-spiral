import { useEffect, useRef, useState, useTransition } from "react";
import "./App.css";
import { drawSpiral } from "./drawSpiral";
import millerRabin from "./millerRabin";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [showRandom, setShowRandom] = useState(false);
  const [numIterations, setNumIterations] = useState(40);

  const width = 500;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    drawSpiral(context, width, 1, (i) => {
      if (showRandom) return i % 2 === 1 && Math.random() > 0.8;
      return millerRabin(i, numIterations);
    });
  }, [canvasRef.current, drawSpiral, showRandom, numIterations]);

  return (
    <div className="App">
      <canvas
        className="spiral"
        ref={canvasRef}
        width={width}
        height={width}
      ></canvas>

      <div>
        <label>
          Show random?{" "}
          <input
            checked={showRandom}
            type={"checkbox"}
            onChange={() => setShowRandom((v) => !v)}
          />
        </label>

        <label>
          Num iterations:{" "}
          <input
            value={numIterations}
            onChange={(e) => setNumIterations(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
}

export default App;
