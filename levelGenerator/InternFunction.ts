import {Manager} from "som-engine/manager";
import { math, Vec3 } from "playcanvas";
import pc = require("playcanvas");

export class intern extends Manager {
    public static get instance(): intern {
        return Manager.getInstanceByType(intern);
    }
    public static delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
    public static distance = function(a:Vec3,b:Vec3) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dz = b.z - a.z;
        return (dx * dx + dy * dy + dz * dz);
    }
    public static distanceSq = function(a:Vec3,b:Vec3) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dz = b.z - a.z;
        return (dx * dx + dy * dy + dz * dz);
    }
    public static getRandomInt(max:number) {
        return Math.floor(Math.random() * max);
      }
    public static getRandomNumber(max:number) {
        return (Math.random() * max);
    }
    public static getRandomFloat(min:number,max:number){
        return Math.random() * (max - min) + min;
    }
    public static calculatePosition(a:Vec3,b:Vec3,c: Vec3){
        const bcx = b.x-c.x;
        const bcy = b.y-c.y;
        const bcz = b.z-c.z;
    
        const abcx = a.x+bcx;
        const abcy = a.y+bcy;
        const abcz = a.z+bcz;
        return new Vec3(abcx,abcy,abcz)
    }
    public static LerpVectors(a:Vec3,b:Vec3,speed:number){
        const abx =math.lerp(a.x,b.x,speed);
        const aby =math.lerp(a.y,b.y,speed);
        const abz =math.lerp(a.z,b.z,speed);
        return new Vec3(abx,aby,abz);
    }
    public static LookRotation = function(forward:Vec3, up:Vec3)
    {
        forward = forward.normalize();
 
        //var vector = forward.normalize();
        //var vector2 = up.CrossProduct(vector).Normalize();
        //var vector3 = vector.CrossProduct(vector2);
        var vector = forward.normalize();
        var vector2 = (new pc.Vec3()).cross(up, vector).normalize();
        var vector3 = (new pc.Vec3()).cross(vector, vector2);
        var m00 = vector2.x;
        var m01 = vector2.y;
        var m02 = vector2.z;
        var m10 = vector3.x;
        var m11 = vector3.y;
        var m12 = vector3.z;
        var m20 = vector.x;
        var m21 = vector.y;
        var m22 = vector.z;
 
        var num8 = (m00 + m11) + m22;
        var quaternion = new pc.Quat;
        if (num8 > 0.0)
        {
            var num = Math.sqrt(num8 + 1.0);
            quaternion.w = num * 0.5;
            num = 0.5 / num;
            quaternion.x = (m12 - m21) * num;
            quaternion.y = (m20 - m02) * num;
            quaternion.z = (m01 - m10) * num;
            return quaternion;
        }
        if ((m00 >= m11) && (m00 >= m22))
        {
            var num7 = Math.sqrt(((1.0 + m00) - m11) - m22);
            var num4 = 0.5 / num7;
            quaternion.x = 0.5 * num7;
            quaternion.y = (m01 + m10) * num4;
            quaternion.z = (m02 + m20) * num4;
            quaternion.w = (m12 - m21) * num4;
            return quaternion;
        }
        if (m11 > m22)
        {
            var num6 = Math.sqrt(((1.0 + m11) - m00) - m22);
            var num3 = 0.5 / num6;
            quaternion.x = (m10 + m01) * num3;
            quaternion.y = 0.5 * num6;
            quaternion.z = (m21 + m12) * num3;
            quaternion.w = (m20 - m02) * num3;
            return quaternion;
        }
        var num5 = Math.sqrt(((1.0 + m22) - m00) - m11);
        var num2 = 0.5 / num5;
        quaternion.x = (m20 + m02) * num2;
        quaternion.y = (m21 + m12) * num2;
        quaternion.z = 0.5 * num5;
        quaternion.w = (m01 - m10) * num2;
        return quaternion;
    }
    public static lerp(valueA:number,valueB:number,value:number)
    {
        return valueA + value * (valueB - valueA);
    }
    public static NextPositionCalculator(valueA:number,valueB:number,speed:number)
    {
        return valueA +(valueB - valueA)*speed;
    }
    public static SubtractVector3(a:Vec3,b:Vec3){
        const abx = b.x - a.x;
        const aby = b.y - a.y;
        const abz = b.z - a.z;
        return new Vec3(abx,aby,abz)
    }
    static AddVector3(a:Vec3,b:Vec3) {
        const abx = b.x + a.x;
        const aby = b.y + a.y;
        const abz = b.z + a.z;
        return new Vec3(abx, aby, abz);
    }
}
intern.initialize("intern");