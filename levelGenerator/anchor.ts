import { Attribute } from 'som-engine/script';
import { Behavior } from 'som-engine/script';
import { Asset } from 'playcanvas';
export enum AnchorDirections {
    empty = 0,
    up = 1,
    down = 2,
    right = 3,
    left = 4
}
type NewType = Asset;

export class Direction {
    public readonly name: AnchorDirections;
    public readonly opposite: AnchorDirections;
    public assetList: NewType[]
    public readonly arrayName:string;

    // Default directions
    public static readonly empty = new Direction(AnchorDirections.empty,AnchorDirections.empty,null);
    public static readonly up = new Direction(AnchorDirections.up,AnchorDirections.down,"_bottomChunkAssets");
    public static readonly down = new Direction(AnchorDirections.down,AnchorDirections.up,"_topChunkAssets");
    public static readonly right = new Direction(AnchorDirections.right,AnchorDirections.left,"_leftChunkAssets");
    public static readonly left = new Direction(AnchorDirections.left,AnchorDirections.right,"_rightChunkAssets");
    
    public static readonly all = [
        Direction.empty,
        Direction.up,
        Direction.down,
        Direction.right,
        Direction.left,
    ];
    
    public constructor(name: AnchorDirections,opposite:AnchorDirections,assetListName:string) {
        this.name = name;
        this.opposite=opposite;
        this.arrayName=assetListName;
    }
    static SetAssetList(list:Asset[],listName:string) {
        const directions = Direction.all;
        for(let i = 0; i < directions.length; i++) {
            if(listName === directions[i].arrayName){
                directions[i].assetList=list;
            }
        }
    }
    static GetDirection(name:AnchorDirections){
        const directions = Direction.all;
        for(let i = 0; i < directions.length; i++) {
            if(name===directions[i].name){
                return directions[i];
            }
        }
    }
    static GetOpposite(anchors:Anchor[],name:AnchorDirections){
        for(let i = 0; i < anchors.length; i++) {
            if(name===anchors[i].direction){
                return anchors[i];
            }
        }
    }
}   
export class Anchor extends Behavior {
        public direction: AnchorDirections;
        public hasParent=false;
}
Anchor.initialize("Anchor", [
    new Attribute("direction", {
        enum: AnchorDirections,
        default: AnchorDirections.empty
    }),
]);