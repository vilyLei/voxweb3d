/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/math/MathConst";
import * as Vector3DT from "../../vox/math/Vector3D";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as TextureBlockT from "../../vox/texture/TextureBlock";
import * as IdBoxGroupAnimatorT from "../../voxanimate/primitive/IdBoxGroupAnimator";
import * as PathTrackT from "../../voxnav/path/PathTrack";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3DT.vox.math.Vector3D;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureBlock = TextureBlockT.vox.texture.TextureBlock;
import IdBoxGroupAnimator = IdBoxGroupAnimatorT.voxanimate.primtive.IdBoxGroupAnimator;
import PathTrack = PathTrackT.voxnav.path.PathTrack;

export namespace voxanimate
{
    export namespace primtive
    {
        export class BoxGroupTrack
        {
            
            private m_stepUnit:number = 1;
            private m_unitsTotal:number = 1;
            private m_stepFactor:number = 1.0;
            private m_radius:number = 2.0;
            private m_longFactor:number = 5.0;
            private m_spaceFactor:number = 2.0;
            private m_trackScale:Vector3D = new Vector3D(0.2,0.2,0.2);
            private m_unitMinV:Vector3D = new Vector3D(-2,-2,-4);
            private m_unitMaxV:Vector3D = new Vector3D(2,2,4);
            private m_track:PathTrack = new PathTrack();
            private m_trackPosList:Vector3D[] = null;
            readonly animator:IdBoxGroupAnimator = new IdBoxGroupAnimator();
            constructor(){}
            setTrackScale(scale:number):void
            {
                this.m_trackScale.setXYZ(scale,scale,scale);
            }
            setTrackScaleXYZ(scaleX:number,scaleY:number,scaleZ:number):void
            {
                this.m_trackScale.setXYZ(scaleX,scaleY,scaleZ);
            }
            setFactor(radius:number,longFactor:number,spaceFactor:number):void
            {
                if(radius > 1)this.m_radius = radius;
                if(longFactor > 1)this.m_longFactor = longFactor;
                if(spaceFactor > 1)this.m_spaceFactor = spaceFactor;
            }
            getTrackPosList():Vector3D[]
            {
                return this.m_trackPosList;
            }
            /**
             * sub class can override this function
             */
            protected createTrackData():void
            {
                // xoz plane
                //  let trackPosList:Vector3D[] = [
                //      new Vector3D(100.0,0.0,40.0),
                //      new Vector3D(70.0,0.0,60.0),
                //      new Vector3D(-70.0,0.0,60.0),
                //      new Vector3D(-100.0,0.0,40.0),
                //      
                //      new Vector3D(-100.0,0.0,-40.0),
                //      new Vector3D(-70.0,0.0,-60.0),
                //      new Vector3D(70.0,0.0,-60.0),
                //      new Vector3D(100.0,0.0,-40.0),
                //      
                //      new Vector3D(100.0,0.0,40.0)
                //  ];
                
                // xoy plane
                let trackPosList:Vector3D[] = [
                    new Vector3D(100.0,40.0,0.0),
                    new Vector3D(70.0,60.0,0.0),
                    new Vector3D(-70.0,60.0,0.0),
                    new Vector3D(-100.0,40.0,0.0),
                    
                    new Vector3D(-100.0,-40.0,0.0),
                    new Vector3D(-70.0,-60.0,0.0),
                    new Vector3D(70.0,-60.0,0.0),
                    new Vector3D(100.0,-40.0,0.0),
                    
                    new Vector3D(100.0,40.0,0.0)
                ];
                this.m_trackPosList = trackPosList;

                // xoy plane
                let radius:number = this.m_radius;
                let longFactor:number = this.m_longFactor;
                this.m_unitMinV.setXYZ(-radius,-radius,-radius * longFactor);
                this.m_unitMaxV.copyFrom(this.m_unitMinV);
                this.m_unitMaxV.scaleBy(-1.0);
            }
            initializeFrom(srcTrack:BoxGroupTrack, texList:TextureProxy[]):void
            {
                if(srcTrack != null)
                {
                    this.animator.copyTransformFrom(srcTrack.animator);
                    this.animator.setPosData(srcTrack.animator.getPosDataTexture(),srcTrack.animator.getPosData(),srcTrack.animator.getPosTotal());
                    this.animator.copyMeshFrom(srcTrack.animator);
                    let unitMinV:Vector3D = new Vector3D();
                    unitMinV.copyFrom(srcTrack.m_unitMinV);
                    let unitMaxV:Vector3D = new Vector3D();
                    unitMaxV.copyFrom(srcTrack.m_unitMaxV);
                    this.animator.initialize(unitMinV,unitMaxV,srcTrack.m_unitsTotal,srcTrack.m_stepFactor,texList);
                }
            }
            initialize(textureBlock:TextureBlock,stepDis:number = 0.5,texList:TextureProxy[] = null):void
            {
                this.createTrackData();

                let pos:Vector3D;
                //for(let i:number = 0; i < this.m_trackPosList.length; ++i)
                for(let i:number = this.m_trackPosList.length - 1; i >= 0; --i)
                {
                    pos = this.m_trackPosList[i];
                    pos.scaleVector(this.m_trackScale);
                    this.m_track.addXYZ(pos.x, pos.y, pos.z);
                }
                this.animator.createDataTexture(textureBlock,this.m_track.getStepsTotal(stepDis));

                pos = new Vector3D(100.0,0.0,0.0);
                let pdis:number = 0.0;
                let flag:number = PathTrack.TRACK_BEGIN;
                let total:number = this.animator.getDataTextureSize();
                let i:number = 0;
                for(; i < total; ++i)
                {
                    flag = this.m_track.calcPosByDis(pos,pdis,false);
                    pdis += stepDis;
                    
                    this.animator.setPosAt(i,pos);
                    
                    if(flag == PathTrack.TRACK_END)
                    {
                        break;
                    }
                }
                
                this.m_stepUnit = Math.floor(Math.abs(this.m_unitMinV.x * 2.0) + this.m_spaceFactor);
                this.m_unitsTotal = Math.ceil(this.m_track.getPathDistance()/this.m_stepUnit);
                this.m_stepFactor = Math.round(this.m_stepUnit/stepDis);
                this.animator.initialize(this.m_unitMinV,this.m_unitMaxV,this.m_unitsTotal,this.m_stepFactor,texList);
            }
            moveDistanceOffset(distanceOffset:number):void
            {
                this.animator.moveIdDistanceOffset(distanceOffset);
            }
            moveDistance(distance:number):void
            {
                this.animator.moveIdDistance(distance);
            }
            setXYZ(px:number,py:number,pz:number):void
            {
                this.animator.setXYZ(px,py,pz);
            }
            setPosition(pv:Vector3D):void
            {             
                this.animator.setPosition(pv);
            }
            getPosition(pv:Vector3D):void
            {
                this.animator.getPosition(pv);
            }
            setRotationXYZ(rx:number,ry:number,rz:number):void
            {
                this.animator.setRotationXYZ(rx,ry,rz);
            }
            setScaleXYZ(sx:number,sy:number,sz:number):void
            {
                this.animator.setScaleXYZ(sx,sy,sz);
            }
            setScale(scale:number):void
            {
                this.animator.setScaleXYZ(scale,scale,scale);
            }
            update():void
            {
                this.animator.update();
            }
            toString():string
            {
                return "BoxGroupTrack()";
            }
        }

    }
}