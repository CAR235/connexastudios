import {
  AbsoluteFill, Img, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { loadFont as loadEncode } from "@remotion/google-fonts/EncodeSans";
import { loadFont as loadKanit } from "@remotion/google-fonts/Kanit";

const { fontFamily: ENCODE } = loadEncode("normal", { weights: ["700", "800"] });
const { fontFamily: KANIT } = loadKanit("normal", { weights: ["300", "400"] });

const LIME = "#c8f504";
const INK = "#0b0b0b";

const Grid = ({ dark = true }: { dark?: boolean }) => (
  <AbsoluteFill style={{ flexDirection: "row", justifyContent: "space-between", padding: "0 60px" }}>
    {[0, 1, 2, 3].map((i) => (
      <div key={i} style={{ width: 1, background: dark ? "rgba(255,255,255,.06)" : "rgba(11,11,11,.08)" }} />
    ))}
  </AbsoluteFill>
);

/* S1 — intro: C esplode, pattern, label */
const Intro = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: f, fps, config: { damping: 11, mass: .7 } });
  return (
    <AbsoluteFill style={{ background: INK }}>
      <Grid />
      <Img src={staticFile("mark-lime.svg")} style={{
        position: "absolute", left: "50%", top: "42%", width: 300,
        transform: `translate(-50%,-50%) scale(${pop}) rotate(${(1 - pop) * -90}deg)`,
      }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: "60%", display: "flex", gap: 60, justifyContent: "center" }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const s = spring({ frame: f - 12 - i * 3, fps, config: { damping: 14 } });
          return <Img key={i} src={staticFile("mark-lime.svg")} style={{ height: 70, opacity: s, transform: `translateY(${(1 - s) * 80}px)` }} />;
        })}
      </div>
      <div style={{
        position: "absolute", left: 0, right: 0, top: "70%", textAlign: "center",
        fontFamily: KANIT, fontSize: 24, letterSpacing: "0.34em", color: LIME, textTransform: "uppercase",
        opacity: interpolate(f, [30, 45], [0, 1], { extrapolateRight: "clamp" }),
      }}>Connexa Studios — 2026</div>
    </AbsoluteFill>
  );
};

/* S2 — statement */
const Statement = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inY = spring({ frame: f, fps, config: { damping: 15 } });
  return (
    <AbsoluteFill style={{ background: INK, justifyContent: "center", padding: "0 80px" }}>
      <Grid />
      <div style={{
        fontFamily: ENCODE, fontWeight: 800, fontSize: 132, lineHeight: 0.95,
        color: "#fff", textTransform: "uppercase", letterSpacing: "-3px",
        transform: `translateY(${(1 - inY) * 120}px) scale(${1 + f * 0.0006})`,
        opacity: inY,
      }}>
        Il nuovo sito<br />è <span style={{ color: LIME }}>vivo.</span>
      </div>
    </AbsoluteFill>
  );
};

/* S3 — il sito scorre nella cornice */
const SiteScroll = () => {
  const f = useCurrentFrame();
  const reveal = interpolate(f, [0, 22], [100, 0], { extrapolateRight: "clamp" });
  const pan = interpolate(f, [20, 160], [0, -7600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: INK }}>
      <Grid />
      <div style={{ position: "absolute", left: 60, right: 60, top: 130, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: KANIT, fontSize: 22, letterSpacing: ".34em", color: "#888", textTransform: "uppercase" }}>Nuovo sito</span>
        <span style={{ fontFamily: KANIT, fontSize: 26, letterSpacing: ".2em", color: LIME }}>CONNEXASTUDIOS.COM</span>
      </div>
      <div style={{
        position: "absolute", left: 60, right: 60, top: 210, bottom: 330,
        border: "1px solid rgba(255,255,255,.18)", overflow: "hidden", background: "#000",
        clipPath: `inset(${reveal}% 0 0 0)`,
      }}>
        <Img src={staticFile("site-full.png")} style={{ width: "100%", transform: `translateY(${pan}px)` }} />
      </div>
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 210, textAlign: "center",
        fontFamily: ENCODE, fontWeight: 800, fontSize: 62, color: "#fff", textTransform: "uppercase", letterSpacing: "-1px",
        opacity: interpolate(f, [30, 50], [0, 1], { extrapolateRight: "clamp" }),
      }}>Diamo forma alla visione</div>
    </AbsoluteFill>
  );
};

/* S4 — cover a raffica su lime */
const COVERS = ["lar-ig.jpg", "3mf-ig.jpg", "fatter-ig.jpg", "telos-ig.jpg"];
const Covers = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const per = 33; // frame per cover
  const idx = Math.min(Math.floor(f / per), 3);
  const local = f - idx * per;
  const s = spring({ frame: local, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ background: LIME }}>
      <Grid dark={false} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: KANIT, fontSize: 24, letterSpacing: ".34em", color: "rgba(11,11,11,.6)", textTransform: "uppercase" }}>
        Progetti selezionati
      </div>
      <div style={{
        position: "absolute", left: 70, right: 70, top: "50%",
        transform: `translateY(-50%) translateY(${(1 - s) * 60}px) scale(${0.92 + s * 0.08})`,
        opacity: s, boxShadow: "0 40px 120px rgba(11,11,11,.45)",
      }}>
        <Img src={staticFile(COVERS[idx])} style={{ width: "100%", display: "block" }} />
      </div>
      <div style={{ position: "absolute", right: 80, bottom: 110, fontFamily: ENCODE, fontWeight: 800, fontSize: 120, color: INK }}>
        {String(idx + 1).padStart(2, "0")}
      </div>
    </AbsoluteFill>
  );
};

/* S5 — claim parola per parola */
const WORDS = "Il mercato non premia il migliore. Premia chi".split(" ");
const Claim = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: INK, justifyContent: "center", padding: "0 80px" }}>
      <Grid />
      <div style={{ fontFamily: ENCODE, fontWeight: 800, fontSize: 108, lineHeight: 1.02, color: "#fff", textTransform: "uppercase", letterSpacing: "-2px" }}>
        {WORDS.map((w, i) => (
          <span key={i} style={{ opacity: interpolate(f, [i * 4, i * 4 + 10], [0.14, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{w} </span>
        ))}
        <span style={{
          background: LIME, color: INK, padding: "0 .14em",
          opacity: interpolate(f, [WORDS.length * 4, WORDS.length * 4 + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>sembra</span>
        <span style={{ opacity: interpolate(f, [WORDS.length * 4 + 8, WORDS.length * 4 + 18], [0.14, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}> il migliore.</span>
      </div>
    </AbsoluteFill>
  );
};

/* S6 — outro lime */
const Outro = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lg = spring({ frame: f, fps, config: { damping: 11, mass: .7 } });
  const t1 = spring({ frame: f - 10, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ background: LIME, justifyContent: "center", alignItems: "center", gap: 44 }}>
      <Grid dark={false} />
      <Img src={staticFile("logo-black.svg")} style={{ width: 640, transform: `scale(${0.6 + lg * 0.4})`, opacity: lg }} />
      <div style={{ fontFamily: ENCODE, fontWeight: 800, fontSize: 84, color: INK, textTransform: "uppercase", letterSpacing: "-2px", opacity: t1, transform: `translateY(${(1 - t1) * 60}px)` }}>
        Restiamo connessi
      </div>
      <div style={{ fontFamily: KANIT, fontSize: 30, letterSpacing: ".3em", color: "rgba(11,11,11,.65)", textTransform: "uppercase", opacity: interpolate(f, [22, 38], [0, 1], { extrapolateRight: "clamp" }) }}>
        connexastudios.com
      </div>
      <div style={{ position: "absolute", bottom: 110, display: "flex", gap: 54 }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const s = spring({ frame: f - 20 - i * 3, fps, config: { damping: 14 } });
          return <Img key={i} src={staticFile("mark-black.svg")} style={{ height: 60, opacity: s * 0.85, transform: `translateY(${(1 - s) * 60}px)` }} />;
        })}
      </div>
    </AbsoluteFill>
  );
};

/* dissolvenza tra scene */
const Fade = ({ children, len }: { children: React.ReactNode; len: number }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8, len - 8, len], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const Launch = () => (
  <AbsoluteFill style={{ background: INK }}>
    <Sequence from={0} durationInFrames={96}><Fade len={96}><Intro /></Fade></Sequence>
    <Sequence from={96} durationInFrames={84}><Fade len={84}><Statement /></Fade></Sequence>
    <Sequence from={180} durationInFrames={180}><Fade len={180}><SiteScroll /></Fade></Sequence>
    <Sequence from={360} durationInFrames={140}><Fade len={140}><Covers /></Fade></Sequence>
    <Sequence from={500} durationInFrames={115}><Fade len={115}><Claim /></Fade></Sequence>
    <Sequence from={615} durationInFrames={135}><Fade len={135}><Outro /></Fade></Sequence>
  </AbsoluteFill>
);
