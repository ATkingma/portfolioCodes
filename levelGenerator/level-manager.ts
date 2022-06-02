import { FOG_LINEAR, FOG_NONE, Vec3 } from "playcanvas";
import { PlayerLevelProgression } from "sc/progression/player-level-progression";
import { Attribute, AttributeType, Behavior } from "som-engine/script";
import { EntityUtils } from "som-engine/utils/entity-utils";
import { TemplateUtils } from "som-engine/utils/template-utils";
import { chunkEnvironment } from "./chunk-Environment";
import { MapObserver } from "./mapObserver";
import { SkyboxChanger } from "./Skybox-Changer";

export class LevelManager extends Behavior {
  private _skyboxChanger: SkyboxChanger;
  private _level: number;
  private _environments: chunkEnvironment[];
  public mapObserver: MapObserver;
  postConstruct() {
    super.postConstruct();
    this.startCoroutine(this.loadScene());
  }
  private *loadScene() {
    const playerLevelProgression = PlayerLevelProgression.getInstance(0);
    this._level = playerLevelProgression.selectedLevel;
    let environment;
    if (this._environments.length === 0) {
      throw new Error("no _environments are given");
    }
    
    for (let i = 0; i < this._environments.length; i++) {
      if (
        this._level >= this._environments[i].minLevels &&
        this._level <= this._environments[i].maxLevels
      ) {
        environment = this._environments[i];
      }
    }

    if (environment == null) {
      environment = this._environments[this._environments.length - 1];
    }

    this._skyboxChanger.setSkyBox(environment.skybox);
    const newObserver = TemplateUtils.instantiate(environment.Observer,this.entity,new Vec3(0, 0, 0));
    this.mapObserver = EntityUtils.getScript(newObserver, MapObserver);
    newObserver.setEulerAngles(environment.observerRotation);

    this.mapObserver.startGeneratingChunks();
    if (environment.usesFog) {
      this.app.scene.fog = FOG_LINEAR;
      this.app.scene.fogColor = environment.fogColor;
      this.app.scene.fogDensity = environment.fogDensity;
    } 
    else {
      this.app.scene.fog = FOG_NONE;
    }
  }
}
LevelManager.initialize("LevelManager", [
  new Attribute("_skyboxChanger", {
    scriptType: SkyboxChanger,
    type: AttributeType.entity,
  }),
  new Attribute("_environments", {
    scriptType: chunkEnvironment,
    isArray: true,
    type: AttributeType.asset,
  }),
]);
