/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";
class RandomRange
{
    constructor(){
    
    }
    min:number = 0.0;
    max:number = 1.0;
    value:number = 0.5;
    private m_range:number = 1.0;
    initialize():void
    {
        this.m_range = this.max - this.min;
    }
    calc():void
    {
        this.value = Math.random() * this.m_range + this.min;
    }
    calcRange(min:number,max:number):number
    {
        return Math.random() * (max - min) + min;
    }
}

class CubeRandomRange
{
    min:Vector3D = new Vector3D();
    max:Vector3D = new Vector3D(100,100,100);
    value:Vector3D = new Vector3D();

    private m_spaceMat:Matrix4 = new Matrix4();
    private m_spaceRotBoo:boolean = false;
    private m_range:Vector3D = new Vector3D();
    initialize():void
    {
        this.m_range.x = this.max.x - this.min.x;
        this.m_range.y = this.max.y - this.min.y;
        this.m_range.z = this.max.z - this.min.z;
    }
    setSpaceRotation(degree_rx:number,degree_ry:number,degree_rz:number):void
    {
        if(!this.m_spaceRotBoo)
        {
            this.m_spaceMat.identity();
        }
        this.m_spaceRotBoo = true;
        //
        this.m_spaceMat.appendRotationEulerAngle(degree_rx * MathConst.MATH_PI_OVER_180, degree_ry * MathConst.MATH_PI_OVER_180, degree_rz * MathConst.MATH_PI_OVER_180);
    }
    setSpaceScale(sx:number,sy:number,sz:number):void
    {
        if(!this.m_spaceRotBoo)
        {
            this.m_spaceMat.identity();
        }
        this.m_spaceRotBoo = true;
        //
        this.m_spaceMat.appendScaleXYZ(sx, sy, sz);
    }

    calc():void
    {
        this.value.x = Math.random() * this.m_range.x + this.min.x;
        this.value.y = Math.random() * this.m_range.y + this.min.y;
        this.value.z = Math.random() * this.m_range.z + this.min.z;
        //
        if(this.m_spaceRotBoo)
        {
            this.m_spaceMat.transformVector3Self(this.value);
        }
    }
    calcRange(minV3:Vector3D,maxV3:Vector3D,outV3:Vector3D):void
    {
        outV3.x = Math.random() * (maxV3.x - minV3.x) + minV3.x;
        outV3.y = Math.random() * (maxV3.y - minV3.y) + minV3.y;
        outV3.z = Math.random() * (maxV3.z - minV3.z) + minV3.z;//
        if(this.m_spaceRotBoo)
        {
            this.m_spaceMat.transformVectorSelf(outV3);
        }
    }
    // need uneven distribution
}

class CylinderRandomRange
{
    constructor()
    {        
    }
    minRadius:number = 0.0;
    maxRadius:number = 50.0;
    minAzimuthalAngle:number = 0.0;
    maxAzimuthalAngle:number = 360.0;
    minHeight:number = -100.0;
    maxHeight:number = 100.0;
    value:Vector3D = new Vector3D();
    yToZEnabled:boolean = true;

    private m_spaceMat:Matrix4 = new Matrix4();
    private m_spaceRotBoo:boolean = false;
    private m_pr:number = 0.0;
    private m_rad:number = 0.0;
    private m_minAzimuthalRad:number = 0.0;
    private m_range:Vector3D = new Vector3D();
    //
    initialize()
    {
        this.m_range.x = this.maxRadius - this.minRadius;
        this.m_minAzimuthalRad = this.minAzimuthalAngle * MathConst.MATH_PI_OVER_180;
        this.m_range.y = this.maxAzimuthalAngle * MathConst.MATH_PI_OVER_180 - this.m_minAzimuthalRad;
        this.m_range.z = this.maxHeight - this.minHeight;
        //m_range.z = this.max.z - this.min.z;
    }
    setSpaceRotation(degree_rx:number,degree_ry:number,degree_rz:number):void
    {
        if(!this.m_spaceRotBoo)
        {
            this.m_spaceMat.identity();
        }
        this.m_spaceRotBoo = true;
        //
        this.m_spaceMat.appendRotationEulerAngle(degree_rx * MathConst.MATH_PI_OVER_180, degree_ry * MathConst.MATH_PI_OVER_180, degree_rz * MathConst.MATH_PI_OVER_180);
    }
    setSpaceScale(sx:number,sy:number,sz:number):void
    {
        if(!this.m_spaceRotBoo)
        {
            this.m_spaceMat.identity();
        }
        this.m_spaceRotBoo = true;
        //
        this.m_spaceMat.appendScaleXYZ(sx, sy, sz);
    }
    calc():void
    {
        //(ρ, φ, z)
        //x=ρ*cosφ
        //y=ρ*sinφ
        //z=z
        this.m_pr = Math.random() * this.m_range.x + this.minRadius;
        this.m_rad = Math.random() * this.m_range.y + this.m_minAzimuthalRad;
        //
        this.value.x = this.m_pr * Math.cos(this.m_rad);
        if(this.yToZEnabled)
        {
            this.value.y = Math.random() * this.m_range.z + this.minHeight;
            this.value.z = this.m_pr * Math.sin(this.m_rad);
        }else
        {
            this.value.z = Math.random() * this.m_range.z + this.minHeight;
            this.value.y = this.m_pr * Math.sin(this.m_rad);
        }
        if(this.m_spaceRotBoo)
        {
            this.m_spaceMat.transformVectorSelf(this.value);
        }
    }
    //calcRange(minV3:Vector3D,maxV3:Vector3D,outV3:Vector3D):void
    //{
    //    outV3.x = Math.random() * (maxV3.x - minV3.x) + minV3.x;
    //    outV3.y = Math.random() * (maxV3.y - minV3.y) + minV3.y;
    //    outV3.z = Math.random() * (maxV3.z - minV3.z) + minV3.z;
    //    if(this.m_spaceRotBoo)
    //    {
    //        this.m_spaceMat.transformVectorSelf(outV3);
    //    }
    //}
}


class SphereRandomRange
{
    constructor()
    {
    }
    minRadius:number = 0.0;
    maxRadius:number = 50.0;
    minAzimuthalAngle:number = 0.0;
    maxAzimuthalAngle:number = 360.0;
    minPolarAngle:number = 0.0;
    maxPolarAngle:number = 180.0;

    yToZEnabled:boolean = true;

    private m_spaceMat:Matrix4 = new Matrix4();
    private m_spaceRotBoo:boolean = false;
    private m_pr:number = 0.0;
    private m_arad:number = 0.0;
    private m_prad:number = 0.0;
    private m_minAzimuthalRad:number = 0.0
    private m_minPolarRad:number = 0.0;
    //
    value:Vector3D = new Vector3D();
    private m_range:Vector3D = new Vector3D();
    //
    initialize():void
    {
        this.m_range.x = this.maxRadius - this.minRadius;
    
        this.m_minAzimuthalRad = this.minAzimuthalAngle * MathConst.MATH_PI_OVER_180;
        this.m_minPolarRad = this.minPolarAngle * MathConst.MATH_PI_OVER_180;
    
        this.m_range.y = this.maxAzimuthalAngle * MathConst.MATH_PI_OVER_180 - this.m_minAzimuthalRad;
    
        this.m_range.z = this.maxPolarAngle * MathConst.MATH_PI_OVER_180 - this.m_minPolarRad;
        //
    }
    setSpaceRotation(degree_rx:number,degree_ry:number,degree_rz:number):void
    {
        if(!this.m_spaceRotBoo)
        {
            this.m_spaceMat.identity();
        }
        this.m_spaceRotBoo = true;
        //
        this.m_spaceMat.appendRotationEulerAngle(degree_rx * MathConst.MATH_PI_OVER_180, degree_ry * MathConst.MATH_PI_OVER_180, degree_rz * MathConst.MATH_PI_OVER_180);
    }
    setSpaceScale(sx:number,sy:number,sz:number):void
    {
        if(!this.m_spaceRotBoo)
        {
            this.m_spaceMat.identity();
        }
        this.m_spaceRotBoo = true;
        //
        this.m_spaceMat.appendScaleXYZ(sx, sy, sz);
    }
    calc():void
    {
        //(r, θ, φ)
        //x=rsinθcosφ
        //y=rsinθsinφ
        //z=rcosθ
    
        this.m_pr = Math.random() * this.m_range.x + this.minRadius;
        this.m_arad = Math.random() * this.m_range.y + this.m_minAzimuthalRad;
        this.m_prad = Math.random() * this.m_range.z + this.m_minPolarRad;
        //
        let sinv = this.m_pr * Math.sin(this.m_prad);
        //
        this.value.x = sinv * Math.cos(this.m_arad);
        if(this.yToZEnabled)
        {
            this.value.z = sinv * Math.sin(this.m_arad);
            this.value.y = this.m_pr * Math.cos(this.m_prad);
        }else{
            this.value.y = sinv * Math.sin(this.m_arad);
            this.value.z = this.m_pr * Math.cos(this.m_prad);
        }
    
        if(this.m_spaceRotBoo)
        {
            this.m_spaceMat.transformVectorSelf(this.value);
        }
    }
}
class CurveRandomRange
{
    constructor()
    {
    }
}
export {RandomRange, CubeRandomRange, CylinderRandomRange, SphereRandomRange, CurveRandomRange};