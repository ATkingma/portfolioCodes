import { Asset, Entity } from "playcanvas";
import { Attribute, AttributeType, Behavior } from "som-engine/script";
import { Anchor } from "./anchor";

export  class Chunk extends Behavior {
    //atributes
    public chunkPriority: number;
    public difficultyPoints: number;
    public anchors:Anchor[];
    public contraptionRoot:Entity;
    public intractableRoot:Entity;
    public maxBoundPos:Entity;
    public minBoundPos:Entity;
    //public
    public parentChunk:Chunk;
    public setAnchor:Anchor;
    public spawnClosedRooms = false;
    public direction:Anchor;
    public myAsset:Asset;
}
Chunk.initialize("Chunk", [
new Attribute("chunkPriority", {
    type: AttributeType.number,
}),
new Attribute("difficultyPoints", {
    type: AttributeType.number,
}),
new Attribute("anchors", {
    scriptType: Anchor,
    type: AttributeType.entity,
    isArray: true
}),
new Attribute("contraptionRoot", {
    type: AttributeType.entity,
}),
new Attribute("intractableRoot", {
    type: AttributeType.entity,
    description:"please turn this root off this way the physics will work"
}),
new Attribute("maxBoundPos", {
    type: AttributeType.entity,
    description: "this is set as maximum boundary where no other chunk can spawn "
}),
new Attribute("minBoundPos", {
    type: AttributeType.entity,
    description: "this is set as minimum boundary where no other chunk can spawn "
}),
]);