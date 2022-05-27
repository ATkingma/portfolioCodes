import { Asset, Color, Entity, Sound, SoundComponent, Vec3 } from "playcanvas";
import { Attribute, AttributeType, Behavior } from "som-engine/script";

export  class chunkEnvironment extends Behavior {
    public observerRotation:Vec3;
    public Observer:Asset;
    public skybox: Asset;
    public minLevels:number;
    public maxLevels:number;
    public fogDensity:number;
    public usesFog:boolean;
    public fogColor:Color;
    public backgroundMusic:Asset;
    }
chunkEnvironment.initialize("chunkEnvironment", [
    new Attribute("observerRotation", {
        type: AttributeType.vec3,
    }),
    new Attribute("Observer", {
        type: AttributeType.asset,
    }),
    new Attribute("skybox", {
        type: AttributeType.asset,
    }),
    new Attribute("minLevels",{
        type: AttributeType.number,
    }),
    new Attribute("maxLevels",{
        type: AttributeType.number,
    }),
    new Attribute("fogDensity",{
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
    })
]);
