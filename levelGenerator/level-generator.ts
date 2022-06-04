import { Anchor, Direction } from "./anchor";
import { Asset, Entity, Vec3 } from "playcanvas";
import { Attribute, AttributeType, Behavior } from "som-engine/script";
import { EntityUtils } from "som-engine/utils/entity-utils";
import { Chunk } from "./chunk";
import { Intern } from "./internFunction";
import { TemplateUtils } from "som-engine/utils/template-utils";
import { ChunkObserver } from "./chunk-observer";

export class  LevelGenerator extends Behavior {
  //private
  private _alChunks: Entity[] = [];
  private _alClosedRooms: Entity[] = [];
  private _alNonCheckedChunks: Chunk[] = [];

  private _spawnPosition: Vec3 = new Vec3(9999, 9999, 9999);
  //attributes
  private _mapPoints: number;
  private _timeBetweenChunks: number;

  private _startChunk: Asset;
  public _bottomChunkAssets: Asset[];
  public _topChunkAssets: Asset[];
  public _leftChunkAssets: Asset[];
  public _rightChunkAssets: Asset[];

  private setArray() {
    Direction.setAssetList(this._bottomChunkAssets, "_bottomChunkAssets");
    Direction.setAssetList(this._topChunkAssets, "_topChunkAssets");
    Direction.setAssetList(this._leftChunkAssets, "_leftChunkAssets");
    Direction.setAssetList(this._rightChunkAssets, "_rightChunkAssets");
  }

  public startGeneratingChunks() {
    if (this._startChunk == null) {
      throw new Error("map could not be generated starting chunk is missing");
    }

    this.setArray();

    const startingChunkEntity = TemplateUtils.instantiate(this._startChunk,null,new Vec3(0, 0, 0));
    const startChunk = EntityUtils.getScript(startingChunkEntity, Chunk);
    this._alNonCheckedChunks.push(startChunk);
    this._alChunks.push(startingChunkEntity);

    this.checkAnchors(startChunk);
  }

  private checkAnchors(chunk: Chunk) {
    if (chunk.anchors.length <= 0) {
      throw new Error("no anchors assigned to " + chunk.entity.name);
    }

    for (let i = 0; i < chunk.anchors.length; i++) {
      if (chunk.anchors[i].hasParent === false) {
        this.spawnRandomChunk(chunk.anchors[i], chunk);
        chunk.anchors[i].hasParent = true;
      }
    }

    this.startCoolDown();
  }

  private async startCoolDown() {
    await Intern.delay(this._timeBetweenChunks * 1000);

    this._alNonCheckedChunks.splice(0, 1);

    if (this._alNonCheckedChunks[0] != null) {
      this.checkAnchors(this._alNonCheckedChunks[0]);
    } else {
      console.log("chunk spawning is done");
    }
  }

  private spawnRandomChunk(anchor: Anchor, chunk: Chunk) {
    const direction = Direction.getDirectionByName(anchor.direction);

    if (this._mapPoints <= 0) {
      chunk.spawnClosedRooms = true;
    }

    let spawnObj;

    if (!chunk.spawnClosedRooms) {
      spawnObj = ChunkObserver.filterForDifficulty(direction, chunk);
    } 
    else {
      spawnObj = ChunkObserver.getClosedRoom(direction.assetList);
    }

    const newChunk = TemplateUtils.instantiate(spawnObj,this.entity,this._spawnPosition);
    const chunkScript = EntityUtils.getScript(newChunk, Chunk);
    const chunkAnchorPos = anchor.entity.getPosition();
    const otherAnchor = Anchor.getAnchorFromList(chunkScript.anchors,direction.opposite);
    const anchorPosition = otherAnchor.entity.getPosition();

    otherAnchor.hasParent = true;
    chunkScript.setAnchor = anchor;
    chunkScript.myAsset = spawnObj;
    const anchorScript = anchor;

    //get new position
    anchorScript.hasParent = true;

    const a = chunkAnchorPos;
    const b = newChunk.getPosition();
    const c = anchorPosition;

    const newPosition = Intern.calculatePosition(a, b, c);

    // set new position and checks if an point is already taken
    if (this.checkForSpace(newPosition)) {
      newChunk.setPosition(newPosition);

      chunkScript.parentChunk = chunk;
      this._mapPoints -= chunk.difficultyPoints;
      this._alChunks.push(newChunk);

      if (chunk.spawnClosedRooms) {
        this._alClosedRooms.push(newChunk);
      }

      this._alNonCheckedChunks.push(chunkScript);

      if (chunkScript.intractableRoot !== null) {
        if (chunkScript.intractableRoot.enabled) {
          throw new Error("intractableRoot is active please turn this entity off in the template otherwise it wil not work and entity's wil be location");
        }
        chunkScript.intractableRoot.enabled = true;
      }
    } 
    else {
      this.turnInClosedRoom(chunk);
      return;
    }
  }
  private turnInClosedRoom(chunk: Chunk) {
    const direction = Direction.getDirectionByName(chunk.parentChunk.setAnchor.direction);
    const newChunk = ChunkObserver.getClosedRoom(direction.assetList);

    const spawnedChunk = TemplateUtils.instantiate(newChunk,this.entity,this._spawnPosition);
    const chunkScript = EntityUtils.getScript(spawnedChunk, Chunk);
    const chunkAnchorPos = chunk.parentChunk.setAnchor.entity.getPosition();
    const otherAnchor = Anchor.getAnchorFromList(chunkScript.anchors,direction.opposite);
    const anchorPosition = otherAnchor.entity.getPosition();

    chunkScript.setAnchor = chunk.parentChunk.setAnchor;
    const a = chunkAnchorPos;
    const b = spawnedChunk.getPosition();
    const c = anchorPosition;

    const newPosition = Intern.calculatePosition(a, b, c);

    spawnedChunk.setPosition(newPosition);

    chunkScript.parentChunk = chunk;
    this._alChunks.push(spawnedChunk);
    this._alClosedRooms.push(spawnedChunk);
  }


  private checkAlBounds(position: Vec3, index: number) {
    const minPos = EntityUtils.getScript(this._alChunks[index],Chunk).minBoundPos.getPosition();
    const maxPos = EntityUtils.getScript(this._alChunks[index],Chunk).maxBoundPos.getPosition();

    if (position.x < minPos.x && position.x > maxPos.x) {
      return true;
    }
    if (position.y < minPos.y && position.y > maxPos.y) {
      return true;
    }
    return false;
  }

  private checkForSpace(position: Vec3) {
    let amountOfHits = 0;

    for (let i = 0; i < this._alChunks.length; i++) {
      if (amountOfHits >= 1) {
        return false;
      }
      if (this.checkAlBounds(position, i)) {
        amountOfHits++;
      }
    }

    if (amountOfHits > 0) {
      return false;
    }
    return true;
  }
  //#endregion

  //#region extra map functions
  public removeContraptions() {
    for (const chunk in this._alChunks) {
      const chunkScript = EntityUtils.getScript(this._alChunks[chunk], Chunk);

      if (chunkScript) {
        if (chunkScript.contraptionRoot) {
          chunkScript.contraptionRoot.enabled = false;
        }
      }
    }
  }
}
//#endregion

LevelGenerator.initialize("levelGenerator", [
  new Attribute("_mapPoints", {
    type: AttributeType.number,
    default: 35,
  }),
  new Attribute("_timeBetweenChunks", {
    type: AttributeType.number,
    default: 0.001,
  }),
  new Attribute("_startChunk", {
    type: AttributeType.asset,
  }),
  new Attribute("_bottomChunkAssets", {
    type: AttributeType.asset,
    isArray: true,
  }),
  new Attribute("_topChunkAssets", {
    type: AttributeType.asset,
    isArray: true,
  }),
  new Attribute("_leftChunkAssets", {
    type: AttributeType.asset,
    isArray: true,
  }),
  new Attribute("_rightChunkAssets", {
    type: AttributeType.asset,
    isArray: true,
  }),
]);
