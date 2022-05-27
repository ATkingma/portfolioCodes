import { Anchor, Direction } from './anchor';
import { Asset, Entity, Vec3 } from "playcanvas";
import { Attribute, AttributeType, Behavior } from "som-engine/script";
import { EntityUtils } from "som-engine/utils/entity-utils";
import { Chunk } from "./chunk";
import { intern } from './InternFunction';
import { TemplateUtils } from 'som-engine/utils/template-utils';

export class MapObserver extends Behavior {
    //private
    private _alChunks: Entity[] = [];
    private _alClosedRooms: Entity[] = [];
    private _alNonCheckedChunks: Chunk[] = [];

    private _spawnPosition:Vec3= new Vec3(9999,9999,9999);
    //attributes
    private _easy:boolean;
    private _hard:boolean;
    
    private _mapPoints:number;
    private _timeBetweenChunks:number;
    
    
    private _startChunk:Asset;
    public _bottomChunkAssets:Asset[];
    public _topChunkAssets:Asset[];
    public _leftChunkAssets:Asset[];
    public _rightChunkAssets:Asset[];

    private SetArray(){
        Direction.SetAssetList(this._bottomChunkAssets,"_bottomChunkAssets");
        Direction.SetAssetList(this._topChunkAssets,"_topChunkAssets");
        Direction.SetAssetList(this._leftChunkAssets,"_leftChunkAssets");
        Direction.SetAssetList(this._rightChunkAssets,"_rightChunkAssets");
    }

    public StartGeneratingChunks() {
        if(this._startChunk==null){
            throw new Error("map could not be generated starting chunk is missing");
        }
        this.SetArray();
        const startingChunkEntity = TemplateUtils.instantiate(this._startChunk,null,new Vec3(0,0,0));
        const startChunk = EntityUtils.getScript(startingChunkEntity, Chunk);
        this._alNonCheckedChunks.push(startChunk);
        this._alChunks.push(startingChunkEntity);
        this.CheckAnchors(startChunk);
    }
    CheckAnchors(chunk:Chunk) {
        if (chunk.anchors.length <= 0) {
            throw new Error("no anchors assigned to " + chunk.entity.name);
        }
        for (let i = 0; i < chunk.anchors.length; i++) {
            if (chunk.anchors[i].hasParent === false) {
                this.SpawnRandomChunk(chunk.anchors[i], chunk);
                chunk.anchors[i].hasParent = true;
            }
        }
        this.StartCoolDown();
    }
    private async StartCoolDown() {
            await intern.delay(this._timeBetweenChunks*1000);
            this._alNonCheckedChunks.splice(0, 1);
            if (this._alNonCheckedChunks[0] != null) {
                this.CheckAnchors(this._alNonCheckedChunks[0]);
            }
            else {
                console.log("chunk spawning is done");
            }
        }
    
    
    private SpawnRandomChunk(anchor:Anchor,chunk:Chunk){
        const direction = Direction.GetDirection(anchor.direction);
        if(this._mapPoints<=0){
            chunk.spawnClosedRooms=true;
        }
        let spawnObj;

        if(!chunk.spawnClosedRooms)
        {
            spawnObj  = this.FilterForDifficulty(direction,chunk);
        }
        else{
            spawnObj = this.GetClosedRoom(direction.assetList);
        }
        const newChunk = TemplateUtils.instantiate(spawnObj,this.entity,this._spawnPosition);
        const chunkScript = EntityUtils.getScript(newChunk, Chunk);
        const chunkAnchorPos=anchor.entity.getPosition();
        const otherAnchor = Direction.GetOpposite(chunkScript.anchors,direction.opposite)
        const anchorPosition= otherAnchor.entity.getPosition();
        otherAnchor.hasParent=true;
        chunkScript.setAnchor=anchor;
        chunkScript.myAsset=spawnObj;
        const anchorScript= anchor;       

            //get new position
            anchorScript.hasParent=true;
            const a = chunkAnchorPos;
            const b = newChunk.getPosition();
            const c = anchorPosition;
            const newPosition =  intern.calculatePosition(a,b,c);
            // set new position and checks if an point is already taken
            if(this.CheckForSpace(newPosition)){
                newChunk.setPosition(newPosition);    
                chunkScript.parentChunk=chunk;
                this._mapPoints-=chunk.difficultyPoints; 
                this._alChunks.push(newChunk);
                if(chunk.spawnClosedRooms){
                    this._alClosedRooms.push(newChunk);
                }
                this._alNonCheckedChunks.push(chunkScript);

                if(chunkScript.intractableRoot!==null){
                    if(chunkScript.intractableRoot.enabled){
                        throw new Error("intractableRoot is active please turn this entity off in the template otherwise it wil not work and entity's wil be set at the wrong spawning location");
                    }
                    chunkScript.intractableRoot.enabled=true;
                }
            }
            else{        
                this.TurnInClosedRoom(chunk);
                return;
            }
    }
//#region  chunk functions
    private FilterForDifficulty(direction:Direction, chunk:Chunk ){
        const chunkList=[];
        let newChunk;
        let tempChunk
        let spawnChunk;
        let spawnTemplate
        for(let i=0; i<3;i++){
            newChunk= this.GetRandomChunk(direction.assetList,chunk);
            chunkList.push(newChunk);
            if(chunkList[i]===chunk.myAsset){
                if(chunkList.length<=1){
                    console.log(chunk);
                    console.log(direction);
                    console.log(newChunk);
                    throw new Error("there is only one chunk at the moment if there is only one in the list that is being used there wil be a repeating chunk");
                }
                chunkList.splice(i,1);
            }
        }
        if(this._hard||this._easy)
        {
            // eslint-disable-next-line no-restricted-syntax
            for(const c in chunkList){
                if(spawnChunk!=null){
                    tempChunk=TemplateUtils.getScript(chunkList[c], Chunk);
                    if(tempChunk==chunk.parentChunk){
                        const index = chunkList.indexOf(chunkList[c]);
                        chunkList.splice(index,1);
                    }
                    if(this._easy){
                            if(spawnChunk.difficultyPoints>tempChunk.difficultyPoints){
                                spawnChunk = TemplateUtils.getScript(chunkList[c], Chunk);
                                spawnTemplate=chunkList[c];
                            }
                        }
                        else {
                            spawnChunk=TemplateUtils.getScript(chunkList[0], Chunk);
                            spawnTemplate=chunkList[0];
                        }
                    }
                    else{
                        if(spawnChunk.difficultyPoints<tempChunk.difficultyPoints){
                            
                            spawnChunk = TemplateUtils.getScript(chunkList[c], Chunk);
                            spawnTemplate=chunkList[c];
                        }
                        else {
                            spawnChunk=TemplateUtils.getScript(chunkList[0], Chunk);
                            spawnTemplate=chunkList[0];
                        }
                    } 
            }
        }
        else{
            const rand =  intern.getRandomInt(chunkList.length);
            spawnTemplate=chunkList[rand];
        }
        return spawnTemplate;
    }
    private GetRandomChunk(objects:Asset[], chunk:Chunk ){
        let newAssetList = [];
        for (let i = 0;i < objects.length-1;i++) {
            newAssetList[i] = objects[i];
          }
        if(newAssetList.length==0){
            throw new Error("chunk list is empty please add chunks to "+objects);
        }
        if(chunk.myAsset){
            for(let i=0; i<newAssetList.length; i++){
                if(newAssetList[i]===chunk.myAsset){
                    if(newAssetList.length<=1){
                        throw new Error("there is only one chunk at the moment if there is only one in the list that is being used there wil be a repeating chunk");
                    }
                    newAssetList.splice(i,1);
                }
            }
        }
        const temporaryChunks=[];
        let highestPrior;
        let newChunk;
        let highestCost;
        //get 3 random chunks
      for(let i=0; i<3;i++){
            const rand= intern.getRandomInt(newAssetList.length);
            if(!this.CheckIfClosingRoom(TemplateUtils.getScript(newAssetList[rand], Chunk))){
                temporaryChunks.push(newAssetList[rand]);
            }
        }
        if(temporaryChunks.length===0){
            // eslint-disable-next-line no-restricted-syntax
            for(const i in newAssetList){
                if(!this.CheckIfClosingRoom(TemplateUtils.getScript(newAssetList[i], Chunk))){
                    temporaryChunks.push(newAssetList[i])
                    break;
                }
        }
        }
    // eslint-disable-next-line no-restricted-syntax
    for(const c in temporaryChunks){
        if(highestPrior!=null){
            newChunk=TemplateUtils.getScript(temporaryChunks[c], Chunk);
            if(newChunk==chunk.parentChunk){
                const index = temporaryChunks.indexOf(temporaryChunks[c]);
                temporaryChunks.splice(index,1);
            }
            if(highestPrior.chunkPriority<newChunk.chunkPriority){
                highestPrior = TemplateUtils.getScript(temporaryChunks[c], Chunk);
                highestCost=temporaryChunks[c];
            }
        }
        else {
            highestPrior=TemplateUtils.getScript(temporaryChunks[0], Chunk);
            highestCost=temporaryChunks[0];
        }
    }
    if(chunk.parentChunk){
        if (highestPrior == chunk) {
            let tempList = objects;
            const index = tempList.indexOf(highestCost, 0);
            tempList.splice(index, 1);
            const rand = intern.getRandomInt(tempList.length);
            highestCost = tempList[rand];
        }
    }
    return(highestCost);
    }
    private TurnInClosedRoom(chunk:Chunk){
        const direction = Direction.GetDirection(chunk.parentChunk.setAnchor.direction);

        const newChunk=this.GetClosedRoom(direction.assetList)
        const spawnedChunk = TemplateUtils.instantiate(newChunk,this.entity,this._spawnPosition);
        const chunkScript = EntityUtils.getScript(spawnedChunk, Chunk);
        const chunkAnchorPos=chunk.parentChunk.setAnchor.entity.getPosition();
        const otherAnchor = Direction.GetOpposite(chunkScript.anchors,direction.opposite)
        const anchorPosition= otherAnchor.entity.getPosition();

        chunkScript.setAnchor=chunk.parentChunk.setAnchor;
        const a = chunkAnchorPos;
        const b = spawnedChunk.getPosition();
        const c = anchorPosition;
        const newPosition =  intern.calculatePosition(a,b,c);

        spawnedChunk.setPosition(newPosition);
        chunkScript.parentChunk=chunk;
        this._alChunks.push(spawnedChunk);
        this._alClosedRooms.push(spawnedChunk);
    }
    private GetClosedRoom(objects:Asset[]){
        let tempScriptHolder;
        for(const object of objects){
            tempScriptHolder =TemplateUtils.getScript(object, Chunk)
            if(this.CheckIfClosingRoom(tempScriptHolder)){
                return object;
            }
        }
        throw new Error("no closed chunk in array please add an chunk with only 1 anchor, this chunk wil be the ending/closing chunk");
    }
    private CheckIfClosingRoom(chunk: Chunk){
        if(chunk===null)
        throw new Error("chunk is not provided "+chunk);

        return chunk.anchors.length===1? true: false;
    }
    private CheckAlBounds(position:Vec3,index:number){
        const minPos =  EntityUtils.getScript(this._alChunks[index], Chunk).minBoundPos.getPosition();
        const maxPos =  EntityUtils.getScript(this._alChunks[index], Chunk).maxBoundPos.getPosition();


        if (position.x <minPos.x&& position.x > maxPos.x) { return true; }
        if (position.y < minPos.y && position.y > maxPos.y) { return true; }
        return false; 
    }
    private CheckForSpace(position:Vec3){
        let amountOfHits=0;
        for(let i=0; i<this._alChunks.length; i++){
            if(amountOfHits>=1){
                return false;
            }
            if(this.CheckAlBounds(position,i)){
                amountOfHits++;
            }
        }
        if(amountOfHits>0){
            return false;
        }
        return true;
    }
//#endregion
//#region extra map functions
    public RemoveContraptions(){
        // eslint-disable-next-line no-restricted-syntax
        for(const chunk in this._alChunks){
        const chunkScript= EntityUtils.getScript( this._alChunks[chunk], Chunk);
            if(chunkScript){
            if(chunkScript.contraptionRoot){
                chunkScript.contraptionRoot.enabled=false;
            }
            }
        }
    }

//#endregion
}
MapObserver.initialize("MapObserver", [
    new Attribute("_easy", {
        type: AttributeType.boolean,
        }),
    new Attribute("_hard", {
        type: AttributeType.boolean,
        }),
    new Attribute("_mapPoints", {
    type: AttributeType.number,
    default: 35
    }),
    new Attribute("_timeBetweenChunks", {
        type: AttributeType.number,
        default: 0.001
    }),
    new Attribute("_startChunk", {
        type: AttributeType.asset,
    }),
    new Attribute("_bottomChunkAssets", {
        type: AttributeType.asset,
        isArray:true
    }),
    new Attribute("_topChunkAssets", {
        type: AttributeType.asset,
        isArray:true
    }),
    new Attribute("_leftChunkAssets", {
        type: AttributeType.asset,
        isArray:true
    }),
    new Attribute("_rightChunkAssets", {
        type: AttributeType.asset,
        isArray:true
    }),
]);