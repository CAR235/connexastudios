# Connexa Launch Video (Remotion)

Video di lancio come codice React. Per modificare e rirenderizzare:

```
cd video
npm install
npx remotion studio          # editor live nel browser
npm run render               # esporta out/connexa-launch-remotion.mp4
```

- Scene e tempi: `src/Launch.tsx` (1080x1920, 30fps, 750 frame = 25s)
- Asset: `public/` (cover, loghi, screenshot sito — rigenera `site-full.png` dopo modifiche grosse al sito)
- Per formato quadrato/16:9: cambia width/height in `src/Root.tsx` e adatta i font-size
