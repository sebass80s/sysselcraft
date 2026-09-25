"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { bottleMessageDialogue, solArrivalDialogue, solTourDialogue, type SolTourStop } from "../../game/solStory";

type Phase = "shop" | "water" | "letter" | "bottle" | "arrival" | SolTourStop | "done";
const tourOrder: SolTourStop[] = ["bakery","shop","linus","decision"];
const tourImages: Record<SolTourStop,string> = {
  bakery:"/assets/village/story-moments/sol-tour-bakery.png",
  shop:"/assets/village/story-moments/sol-tour-shop.png",
  linus:"/assets/village/story-moments/sol-tour-linus.png",
  decision:"/assets/village/story-moments/sol-stays.png",
};

export default function SolStoryTestPage() {
  const [phase,setPhase]=useState<Phase>("shop");
  const [index,setIndex]=useState(0);
  const lines=useMemo(()=> phase==="bottle" ? bottleMessageDialogue : phase==="arrival" ? solArrivalDialogue : tourOrder.includes(phase as SolTourStop) ? solTourDialogue[phase as SolTourStop] : [],[phase]);
  const next=()=>{
    if(index+1<lines.length){setIndex(index+1);return;}
    setIndex(0);
    if(phase==="bottle") setPhase("arrival");
    else if(phase==="arrival") setPhase("bakery");
    else if(tourOrder.includes(phase as SolTourStop)){const n=tourOrder.indexOf(phase as SolTourStop)+1;setPhase(n<tourOrder.length?tourOrder[n]:"done");}
  };
  const image=phase==="bottle"?"/assets/village/story-moments/bottle-message.png":phase==="arrival"?"/assets/village/story-moments/sol-arrival.png":tourOrder.includes(phase as SolTourStop)?tourImages[phase as SolTourStop]:null;
  const line=lines[index];
  return <main style={{minHeight:"100vh",background:"#171d22",color:"white",display:"grid",placeItems:"center",padding:24,fontFamily:"system-ui"}}>
    <section style={{width:"min(100%,900px)",textAlign:"center"}}>
      <p style={{opacity:.7}}>SOL STORY · SAFE TEST · sparar ingenting</p>
      {phase==="shop" && <><h1>Miras lanthandel</h1><div style={{fontSize:72}}>🍾</div><h2>Flaskpost</h2><p>Skriv ett meddelande till någon där ute. Vem vet vem som hittar det?</p><button onClick={()=>setPhase("water")}>🪙 25 · TESTKÖP</button></>}
      {phase==="water" && <><h1>Gå ner till vattnet</h1><button style={{fontSize:72}} onClick={()=>setPhase("letter")}>🍾</button><p>Tryck på flaskposten.</p></>}
      {phase==="letter" && <><div style={{position:"relative",width:"100%",aspectRatio:"16/9"}}><Image src="/assets/village/story-moments/bottle-letter.png" alt="Brevet i flaskposten" fill style={{objectFit:"contain"}} priority /></div><h2>Brevet är klart.</h2><button onClick={()=>setPhase("bottle")}>Gå till vattnet</button></>}
      {image && <div style={{position:"relative",width:"100%",aspectRatio:"16/9"}}><Image src={image} alt="" fill style={{objectFit:"contain"}} priority /></div>}
      {line && <div style={{background:"rgba(0,0,0,.75)",padding:18,borderRadius:16,marginTop:12}}><strong>{line.speaker==="Barnet"?"Barnet":line.speaker==="Hunden"?"Hunden":line.speaker}</strong><p>{line.text.replace("{dogName}","kompis")}</p><button onClick={next}>{index===lines.length-1?"Fortsätt":"Nästa"}</button></div>}
      {phase==="done" && <><h1>☀️ Sol väljer att stanna</h1><p>Testkedjan är klar. Ingen save eller backend har ändrats.</p><button onClick={()=>{setIndex(0);setPhase("shop")}}>Kör igen</button></>}
    </section>
  </main>;
}
