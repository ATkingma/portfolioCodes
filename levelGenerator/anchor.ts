import { Attribute } from "som-engine/script";
import { Behavior } from "som-engine/script";
import { Asset } from "playcanvas";
export enum AnchorDirections {
  empty = 0,
  up = 1,
  down = 2,
  right = 3,
  left = 4,
}
type NewType = Asset;

export class Direction {
  //readonly
  public readonly name: AnchorDirections;
  public readonly opposite: AnchorDirections;
  public readonly arrayName: string;
  //public
  public assetList: NewType[];

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

  public constructor(name:AnchorDirections,opposite:AnchorDirections,assetListName:string) {
    this.name = name;
    this.opposite = opposite;
    this.arrayName = assetListName;
  }

  static setAssetList(list: Asset[], listName: string) {
    const directions = Direction.all;
    for (let i = 0; i < directions.length; i++) {
      if (listName === directions[i].arrayName) {
        directions[i].assetList = list;
      }
    }
  }

  static getDirectionByName(name: AnchorDirections) {
    const directions = Direction.all;
    for (let i = 0; i < directions.length; i++) {
      if (name === directions[i].name) {
        return directions[i];
      }
    }
  }
}

export class Anchor extends Behavior {
  //attributes
  public direction: AnchorDirections;
  //public
  public hasParent = false;

  static getAnchorFromList(anchors: Anchor[], name: AnchorDirections) {
    for (let i = 0; i < anchors.length; i++) {
      if (name === anchors[i].direction) {
        return anchors[i];
      }
    }
  }
}

Anchor.initialize("Anchor", [
  new Attribute("direction", {
    enum: AnchorDirections,
    default: AnchorDirections.empty,
  }),
]);
