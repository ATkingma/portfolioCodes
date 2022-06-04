import { TemplateUtils } from 'som-engine/utils/template-utils';
import { Asset } from 'playcanvas';
import { Manager } from "som-engine/manager";
import { Direction } from "./anchor";
import { Chunk } from "./chunk";
import { Intern } from "./internFunction";

export class ChunkObserver extends Manager {
  public static get instance(): ChunkObserver {
    return Manager.getInstanceByType(ChunkObserver);
  }
  public static filterForDifficulty(direction: Direction, chunk: Chunk) {
        const chunkList = [];
        let newChunk;
        let spawnTemplate;
        for (let i = 0; i < 3; i++) {
          newChunk = this.getRandomChunk(direction.assetList, chunk);
          chunkList.push(newChunk);
          
          if (chunkList[i] === chunk.myAsset) {
            if (chunkList.length <= 1) {
              throw new Error("there is only one chunk at the moment if there is only one in the list that is being used there wil be a repeating chunk");
            }
    
            chunkList.splice(i, 1);
          }
        }
        const rand = Intern.getRandomInt(chunkList.length);
        spawnTemplate = chunkList[rand];
        return spawnTemplate;
  }

  public static getRandomChunk(objects: Asset[], chunk: Chunk) {
    let newAssetList = [];

    for (let i = 0; i < objects.length - 1; i++) {
      newAssetList[i] = objects[i];
    }

    if (newAssetList.length == 0) {
      throw new Error("chunk list is empty please add chunks to " + objects);
    }

    if (chunk.myAsset) {
      for (let i = 0; i < newAssetList.length; i++) {
        if (newAssetList[i] === chunk.myAsset) {
          if (newAssetList.length <= 1) {
            throw new Error("there is only one chunk at the moment if there is only one in the list that is being used there wil be a repeating chunk");
          }
          newAssetList.splice(i, 1);
        }
      }
    }

    const temporaryChunks = [];
    let highestPrior;
    let newChunk;
    let highestCost;

    for (let i = 0; i < 3; i++) {
      const rand = Intern.getRandomInt(newAssetList.length);
      if (!this.checkIfClosingRoom(TemplateUtils.getScript(newAssetList[rand], Chunk))) {
        temporaryChunks.push(newAssetList[rand]);
      }
    }

    if (temporaryChunks.length === 0) {
      for (const i in newAssetList) {
        if (!this.checkIfClosingRoom(TemplateUtils.getScript(newAssetList[i], Chunk))) {
          temporaryChunks.push(newAssetList[i]);
          break;
        }
      }
    }

    for (const c in temporaryChunks) {
      if (highestPrior != null) {
        newChunk = TemplateUtils.getScript(temporaryChunks[c], Chunk);
        if (newChunk == chunk.parentChunk) {
          const index = temporaryChunks.indexOf(temporaryChunks[c]);
          temporaryChunks.splice(index, 1);
        }

        if (highestPrior.chunkPriority < newChunk.chunkPriority) {
          highestPrior = TemplateUtils.getScript(temporaryChunks[c], Chunk);
          highestCost = temporaryChunks[c];
        }
      } 
      else {
        highestPrior = TemplateUtils.getScript(temporaryChunks[0], Chunk);
        highestCost = temporaryChunks[0];
      }
    }
    if (chunk.parentChunk) {
      if (highestPrior == chunk) {
        let tempList = objects;
        const index = tempList.indexOf(highestCost, 0);
        tempList.splice(index, 1);
        const rand = Intern.getRandomInt(tempList.length);
        highestCost = tempList[rand];
      }
    }
    return highestCost;
  }

  public static checkIfClosingRoom(chunk: Chunk) {
        if (chunk === null) throw new Error("chunk is not provided " + chunk);
    
        return chunk.anchors.length === 1 ? true : false;
  }

  public static  getClosedRoom(objects: Asset[]) {
    let tempScriptHolder;

    for (const object of objects) {
      tempScriptHolder = TemplateUtils.getScript(object, Chunk);
      if (this.checkIfClosingRoom(tempScriptHolder)) {
        return object;
      }
    }
    throw new Error("no closed chunk in array please add an chunk with only 1 anchor, this chunk wil be the ending/closing chunk");
  }
}
ChunkObserver.initialize("chunkObserver");
