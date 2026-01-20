"use client";

import { useState } from "react";

const Toss = () => {
  const [angle, setAngle] = useState<number>(0);

  const flipCoin = () => {
    // Randomly choose between +180 (Tails) or +360 (Heads) to simulate a flip
    if (Math.random() > 0.5) setAngle((prev) => prev + 180);
    else setAngle((prev) => prev + 360);
  };

  return (
  
      
      <main className="dashboard-app-container">
        <h1>Toss</h1>
        <section>
          <article
            className="tosscoin"
            onClick={flipCoin}
            style={{
              transform: `rotateY(${angle}deg)`,
            }}
          >
            <div></div> {/* Heads Image (handled by CSS) */}
            <div></div> {/* Tails Image (handled by CSS) */}
          </article>
        </section>
      </main>
   
  );
};

export default Toss;