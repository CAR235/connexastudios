import {
  AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig, Easing,
} from "remotion";
import { loadFont as loadEncode } from "@remotion/google-fonts/EncodeSans";
import { loadFont as loadKanit } from "@remotion/google-fonts/Kanit";

const { fontFamily: ENCODE } = loadEncode("normal", { weights: ["700", "800"] });
const { fontFamily: KANIT } = loadKanit("normal", { weights: ["300", "400"] });

const LIME = "#c8f504";
const INK = "#0b0b0b";
// molla "Apple": nessun overshoot, decelerazione lunga e morbida
const APPLE = { damping: 200, mass: 1, stiffness: 80 };

/* testo che entra da sfocato, sale e si assesta — il gesto Apple */
const BlurIn = ({ children, delay = 0, style = {} }: any) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: APPLE });
  return (
    <div style={{
      opacity: s,
      transform: `translateY(${(1 - s) * 60}px) scale(${0.96 + s * 0.04})`,
      filter: `blur(${(1 - s) * 18}px)`,
      ...style,
    }}>{children}</div>
  );
};

/* S1 — solo la C, respiro, label. Minimale. */
const Intro = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: APPLE });
  const breathe = 1 + Math.sin(f / 22) * 0.012;
  return (
    <AbsoluteFill style={{ background: INK, justifyContent: "center", alignItems: "center" }}>
      <Img src={staticFile("mark-lime.svg")} style={{
        width: 280, opacity: s,
        transform: `scale(${(0.7 + s * 0.3) * breathe})`,
        filter: `blur(${(1 - s) * 24}px)`,
      }} />
      <BlurIn delay={18} style={{ position: "absolute", bottom: 220, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: KANIT, fontSize: 24, letterSpacing: "0.4em", color: "rgba(255,255,255,.55)", textTransform: "uppercase" }}>
          Connexa Studios
        </span>
      </BlurIn>
    </AbsoluteFill>
  );
};

/* S2 — statement, riga per riga da sfocato */
const Statement = () => {
  const f = useCurrentFrame();
  const drift = 1 + f * 0.0005; // lenta avanzata della camera
  return (
    <AbsoluteFill style={{ background: INK, justifyContent: "center", padding: "0 90px", transform: `scale(${drift})` }}>
      <BlurIn>
        <div style={{ fontFamily: ENCODE, fontWeight: 800, fontSize: 128, lineHeight: 0.98, color: "#fff", textTransform: "uppercase", letterSpacing: "-3px" }}>
          Il nuovo sito
        </div>
      </BlurIn>
      <BlurIn delay={10}>
        <div style={{ fontFamily: ENCODE, fontWeight: 800, fontSize: 128, lineHeight: 0.98, textTransform: "uppercase", letterSpacing: "-3px", color: LIME }}>
          è vivo.
        </div>
      </BlurIn>
      <BlurIn delay={24} style={{ marginTop: 46 }}>
        <span style={{ fontFamily: KANIT, fontSize: 26, letterSpacing: ".3em", color: "rgba(255,255,255,.5)", textTransform: "uppercase" }}>
          connexastudios.com
        </span>
      </BlurIn>
    </AbsoluteFill>
  );
};

/* S3 — il SITO VERO che scorre, dentro una cornice device che si avvicina */
const SiteScroll = () => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame: f, fps, config: APPLE });
  // la camera si avvicina lentamente al device (Apple dolly-in)
  const zoom = interpolate(f, [0, 260], [0.9, 1.06], { easing: Easing.bezier(.25, .1, .25, 1), extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: INK, justifyContent: "center", alignItems: "center" }}>
      <BlurIn style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: KANIT, fontSize: 24, letterSpacing: ".34em", color: "rgba(255,255,255,.5)", textTransform: "uppercase" }}>
          Il sito — dal vivo
        </span>
      </BlurIn>
      <div style={{
        width: 820, height: 1460, borderRadius: 44, overflow: "hidden",
        border: "1px solid rgba(255,255,255,.22)",
        boxShadow: "0 60px 160px rgba(0,0,0,.6)",
        opacity: enter,
        transform: `scale(${zoom * (0.94 + enter * 0.06)}) translateY(${(1 - enter) * 90}px)`,
        filter: `blur(${(1 - enter) * 16}px)`,
      }}>
        <OffthreadVideo src={staticFile("site-scroll.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </AbsoluteFill>
  );
};

/* S4 — cover con parallasse: la cover sale lenta, il contatore più veloce */
const COVERS = ["lar-ig.jpg", "3mf-ig.jpg", "fatter-ig.jpg", "telos-ig.jpg"];
const Covers = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const per = 42;
  const idx = Math.min(Math.floor(f / per), 3);
  const local = f - idx * per;
  const s = spring({ frame: local, fps, config: APPLE });
  const out = interpolate(local, [per - 8, per], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kenburns = 1 + local * 0.0012;
  return (
    <AbsoluteFill style={{ background: INK }}>
      <BlurIn style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: KANIT, fontSize: 24, letterSpacing: ".34em", color: "rgba(255,255,255,.5)", textTransform: "uppercase" }}>
          Progetti selezionati
        </span>
      </BlurIn>
      <div style={{
        position: "absolute", left: 90, right: 90, top: "50%",
        opacity: Math.min(s, idx === 3 ? 1 : out),
        transform: `translateY(-50%) translateY(${(1 - s) * 80}px) scale(${kenburns})`,
        filter: `blur(${(1 - s) * 14}px)`,
        boxShadow: "0 50px 140px rgba(0,0,0,.55)",
      }}>
        <Img src={staticFile(COVERS[idx])} style={{ width: "100%", display: "block", borderRadius: 8 }} />
      </div>
      <div style={{
        position: "absolute", right: 90, bottom: 150,
        fontFamily: ENCODE, fontWeight: 800, fontSize: 96, color: LIME,
        opacity: s, transform: `translateY(${(1 - s) * 140}px)`, // parallasse: corre più del resto
      }}>
        {String(idx + 1).padStart(2, "0")}<span style={{ color: "rgba(255,255,255,.3)" }}> / 04</span>
      </div>
    </AbsoluteFill>
  );
};

/* S5 — claim, parole che si accendono con blur */
const LINE1 = "Il mercato non premia".split(" ");
const LINE2 = "il migliore.".split(" ");
const Claim = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const word = (i: number, txt: string, lime = false) => {
    const s = spring({ frame: f - i * 5, fps, config: APPLE });
    return (
      <span key={txt + i} style={{
        display: "inline-block", marginRight: "0.28em",
        opacity: s, transform: `translateY(${(1 - s) * 40}px)`, filter: `blur(${(1 - s) * 12}px)`,
        color: lime ? LIME : "#fff",
      }}>{txt}</span>
    );
  };
  let i = 0;
  return (
    <AbsoluteFill style={{ background: INK, justifyContent: "center", padding: "0 90px" }}>
      <div style={{ fontFamily: ENCODE, fontWeight: 800, fontSize: 106, lineHeight: 1.04, textTransform: "uppercase", letterSpacing: "-2px" }}>
        <div>{LINE1.map((w) => word(i++, w))}</div>
        <div>{LINE2.map((w) => word(i++, w))}</div>
        <div style={{ marginTop: 30 }}>
          {word(i++, "Premia")} {word(i++, "chi")} {word(i++, "sembra", true)}
        </div>
        <div>{word(i++, "il")} {word(i++, "migliore.")}</div>
      </div>
    </AbsoluteFill>
  );
};

/* S6 — outro: lime pieno, logo, chiusura quieta */
const Outro = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wipe = spring({ frame: f, fps, config: APPLE });
  return (
    <AbsoluteFill style={{ background: INK }}>
      <AbsoluteFill style={{
        background: LIME, justifyContent: "center", alignItems: "center", gap: 48,
        clipPath: `circle(${wipe * 120}% at 50% 50%)`,
      }}>
        <BlurIn delay={6}>
          <Img src={staticFile("logo-black.svg")} style={{ width: 620 }} />
        </BlurIn>
        <BlurIn delay={16}>
          <div style={{ fontFamily: ENCODE, fontWeight: 800, fontSize: 78, color: INK, textTransform: "uppercase", letterSpacing: "-2px" }}>
            Restiamo connessi
          </div>
        </BlurIn>
        <BlurIn delay={26}>
          <div style={{ fontFamily: KANIT, fontSize: 28, letterSpacing: ".32em", color: "rgba(11,11,11,.6)", textTransform: "uppercase" }}>
            connexastudios.com
          </div>
        </BlurIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* dissolvenza + micro-zoom tra le scene (cross-dissolve alla Apple) */
const Scene = ({ children, len }: { children: React.ReactNode; len: number }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 10, len - 10, len], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = interpolate(f, [len - 12, len], [1, 1.03], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${z})` }}>{children}</AbsoluteFill>;
};

export const Launch = () => (
  <AbsoluteFill style={{ background: INK }}>
    <Sequence from={0} durationInFrames={85}><Scene len={85}><Intro /></Scene></Sequence>
    <Sequence from={85} durationInFrames={95}><Scene len={95}><Statement /></Scene></Sequence>
    <Sequence from={180} durationInFrames={270}><Scene len={270}><SiteScroll /></Scene></Sequence>
    <Sequence from={450} durationInFrames={170}><Scene len={170}><Covers /></Scene></Sequence>
    <Sequence from={620} durationInFrames={115}><Scene len={115}><Claim /></Scene></Sequence>
    <Sequence from={735} durationInFrames={135}><Scene len={135}><Outro /></Scene></Sequence>
  </AbsoluteFill>
);
