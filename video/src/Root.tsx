import { Composition } from "remotion";
import { Launch } from "./Launch";
import { Story } from "./Story";
export const Root = () => (
  <>
    <Composition id="ConnexaLaunch" component={Launch}
      durationInFrames={870} fps={30} width={1080} height={1920} />
    <Composition id="ConnexaStory" component={Story}
      durationInFrames={330} fps={30} width={1080} height={1920} />
  </>
);
