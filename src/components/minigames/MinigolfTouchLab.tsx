"use client";

import { useState } from "react";
import { MinigolfGame } from "../minigames/MinigolfGame";

/**
 * Isolated physical-device QA for the REAL reusable minigolf component.
 * Never reads or writes child saves, claim ledgers or backend state.
 */
export function MinigolfTouchLab() {
  const [attempt, setAttempt] = useState(0);
  const [finished, setFinished] = useState(false);
  return (
    <main style={{position:"fixed",inset:0,background:"#142b2c",color:"#fff",fontFamily:"system-ui"}}>
      {finished ? (
        <section role="status" style={{display:"flex",height:"100%",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,textAlign:"center",padding:20}}>
          <h1 style={{fontSize:24,margin:0}}>Banan klar! ⛳</h1>
          <p style={{margin:0}}>Testet lyckades. Inga uppdrag eller speldata har ändrats.</p>
          <button type="button" style={{fontSize:18,minHeight:44,padding:"8px 20px",borderRadius:12}} onClick={() => {setAttempt(n=>n+1);setFinished(false)}}>Spela igen</button>
        </section>
      ) : (
        <MinigolfGame key={attempt} onComplete={async () => setFinished(true)} />
      )}
    </main>
  );
}
