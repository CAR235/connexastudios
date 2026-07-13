import {
  AbsoluteFill, Img, OffthreadVideo, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig, Easing,
} from "remotion";
import { loadFont as loadEncode } from "@remotion/google-fonts/EncodeSans";
import { loadFont as loadKanit } from "@remotion/google-fonts/Kanit";

const { fontFamily: ENCODE } = loadEncode("normal", { weights: ["700", "800"] });
const { fontFamily: KANIT } = loadKanit("normal", { weights: ["300", "400"] });
const LIME = "#c8f504";
const INK = "#0b0b0b";
const APPLE = { damping: 200, mass: 1, stiffness: 80 };

const BlurIn = ({ children, delay = 0, style = {} }: any) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: APPLE });
  return (
    <div style={{
      opacity: s,
      transform: `translateY(${(1 - s) * 50}px)`,
      filter: `blur(${(1 - s) * 16}px)`,
      ...style,
    }}>{children}</div>
  );
};

/* iPhone con orbita 3D: rotateY animato + luce che scorre sulla scocca */
const Phone3D = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: f - 30, fps, config: APPLE });
  // orbita: parte ruotato, si raddrizza lentamente, poi oscilla appena
  const rotY = interpolate(f, [30, 140, 300], [-26, 4, -6], { easing: Easing.bezier(.33, 0, .2, 1), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rotX = interpolate(f, [30, 140], [6, 2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // la luce sulla scocca segue la rotazione (fake 3D lighting)
  const lightX = interpolate(rotY, [-26, 8], [30, 68]);
  const W = 470, H = 962;
  return (
    <div style={{ perspective: 2200, transformStyle: "preserve-3d" }}>
      <div style={{
        position: "relative", width: W, height: H,
        opacity: enter,
        transform: `rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${0.9 + enter * 0.1})`,
        transformStyle: "preserve-3d",
      }}>
        {/* spessore laterale (bordo che appare quando ruota) */}
        <div style={{
          position: "absolute", top: 8, bottom: 8, left: -7, width: 14,
          background: "linear-gradient(90deg,#0e0e0f,#3a3a3c,#151517)",
          borderRadius: 8, transform: "rotateY(70deg)", transformOrigin: "right center",
        }} />
        <div style={{
          position: "absolute", top: 8, bottom: 8, right: -7, width: 14,
          background: "linear-gradient(90deg,#151517,#3a3a3c,#0e0e0f)",
          borderRadius: 8, transform: "rotateY(-70deg)", transformOrigin: "left center",
        }} />
        {/* scocca */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 66,
          background: `linear-gradient(${100 + rotY}deg, #48484c ${lightX - 28}%, #1c1c1e ${lightX}%, #2c2c2e ${lightX + 30}%)`,
          boxShadow: "0 90px 220px rgba(0,0,0,.75), inset 0 2px 3px rgba(255,255,255,.28), inset 0 -2px 3px rgba(0,0,0,.65)",
        }} />
        {/* schermo */}
        <div style={{ position: "absolute", inset: 15, borderRadius: 54, overflow: "hidden", background: "#000" }}>
          <OffthreadVideo src={staticFile("site-scroll.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {/* riflesso che scorre con la rotazione */}
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(${115 + rotY * 1.5}deg, rgba(255,255,255,${0.10 + Math.abs(rotY) * 0.004}) 0%, transparent ${30 + rotY}%)`,
          }} />
        </div>
        {/* dynamic island */}
        <div style={{ position: "absolute", top: 26, left: "50%", transform: "translateX(-50%)", width: 150, height: 42, borderRadius: 30, background: "#000" }} />
        {/* tasti */}
        <div style={{ position: "absolute", left: -5, top: 190, width: 5, height: 46, background: "#2a2a2a", borderRadius: "4px 0 0 4px" }} />
        <div style={{ position: "absolute", left: -5, top: 262, width: 5, height: 78, background: "#2a2a2a", borderRadius: "4px 0 0 4px" }} />
        <div style={{ position: "absolute", left: -5, top: 354, width: 5, height: 78, background: "#2a2a2a", borderRadius: "4px 0 0 4px" }} />
        <div style={{ position: "absolute", right: -5, top: 276, width: 5, height: 112, background: "#2a2a2a", borderRadius: "0 4px 4px 0" }} />
      </div>
    </div>
  );
};

export const Story = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const markIn = spring({ frame: f, fps, config: APPLE });
  // pulse della freccia link
  const pulse = 1 + Math.sin(f / 9) * 0.06;
  return (
    <AbsoluteFill style={{ background: INK, alignItems: "center" }}>
      {/* gridlines */}
      <AbsoluteFill style={{ flexDirection: "row", justifyContent: "space-between", padding: "0 70px" }}>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ width: 1, background: "rgba(255,255,255,.05)" }} />)}
      </AbsoluteFill>

      {/* header: C + annuncio (sotto la zona UI di IG) */}
      <Img src={staticFile("mark-lime.svg")} style={{
        position: "absolute", top: 190, width: 96,
        opacity: markIn, transform: `scale(${0.6 + markIn * 0.4})`, filter: `blur(${(1 - markIn) * 14}px)`,
      }} />
      <BlurIn delay={10} style={{ position: "absolute", top: 320, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: ENCODE, fontWeight: 800, fontSize: 84, lineHeight: 0.98, color: "#fff", textTransform: "uppercase", letterSpacing: "-2px" }}>
          Il nuovo sito<br /><span style={{ color: LIME }}>è online.</span>
        </div>
      </BlurIn>

      {/* iPhone 3D al centro */}
      <div style={{ position: "absolute", top: 560 }}>
        <Phone3D />
      </div>

      {/* footer: url + invito al link (spazio libero sotto per lo sticker) */}
      <BlurIn delay={50} style={{ position: "absolute", bottom: 296, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: KANIT, fontSize: 30, letterSpacing: ".3em", color: "rgba(255,255,255,.6)", textTransform: "uppercase" }}>
          connexastudios.com
        </div>
      </BlurIn>
      <BlurIn delay={65} style={{ position: "absolute", bottom: 172, left: 0, right: 0, textAlign: "center" }}>
        <div style={{
          display: "inline-block", fontFamily: ENCODE, fontWeight: 800, fontSize: 34,
          background: LIME, color: INK, padding: "16px 38px", borderRadius: 999,
          textTransform: "uppercase", letterSpacing: ".04em",
          transform: `scale(${pulse})`,
        }}>
          Link qui ↓
        </div>
      </BlurIn>
    </AbsoluteFill>
  );
};
