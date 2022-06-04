import { Asset, Color, Vec3 } from "playcanvas";
import { Attribute, AttributeType, Behavior } from "som-engine/script";

export class ChunkEnvironment extends Behavior {
  //attributes
  public generatorRotation: Vec3;
  public levelGenerator: Asset;
  public skybox: Asset;
  public minLevels: number;
  public maxLevels: number;
  public fogDensity: number;
  public usesFog: boolean;
  public fogColor: Color;
  public backgroundMusic: Asset;
}
ChunkEnvironment.initialize("ChunkEnvironment", [
  new Attribute("generatorRotation", {
    type: AttributeType.vec3,
  }),
  new Attribute("levelGenerator", {
    type: AttributeType.asset,
  }),
  new Attribute("skybox", {
    type: AttributeType.asset,
  }),
  new Attribute("minLevels", {
    type: AttributeType.number,
  }),
  new Attribute("maxLevels", {
    type: AttributeType.number,
  }),
  new Attribute("fogDensity", {
    type: AttributeType.number,
  }),
  new Attribute("usesFog", {
    type: AttributeType.boolean,
  }),
  new Attribute("fogColor", {
    type: AttributeType.color,
  }),
  new Attribute("backgroundMusic", {
    type: AttributeType.asset,
  }),
]);
