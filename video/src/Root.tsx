import { Composition } from "remotion";
import { Launch } from "./Launch";
export const Root = () => (
  <Composition id="ConnexaLaunch" component={Launch}
    durationInFrames={750} fps={30} width={1080} height={1920} />
);
