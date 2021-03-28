/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3T from "../../vox/math/Vector3D";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as Axis3DEntityT from "../../vox/entity/Axis3DEntity";
import * as Line3DEntityT from "../../vox/entity/Line3DEntity";
import * as IPartStoreT from "../../app/robot/IPartStore";

import Vector3D = Vector3T.vox.math.Vector3D;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Line3DEntity = Line3DEntityT.vox.entity.Line3DEntity;
import IPartStore = IPartStoreT.app.robot.IPartStore;

export namespace app
{
    export namespace robot
    {
        export class LinePartStore implements IPartStore
        {
            private m_coreCenterV:Vector3D = new Vector3D(0.0,105.0,0.0);
            private m_coreWidth:number = 60.0;
            private m_bgLong:number = -60.0;
            private m_sgLong:number = -50.0;
            constructor(){}
            setParam(coreWidth:number, bgLong:number,sgLong:number):void
            {
                this.m_coreWidth = coreWidth;
                this.m_bgLong = bgLong;
                this.m_sgLong = sgLong;
            }
            setCoreCenterXYZ(px:number,py:number,pz:number):void
            {
                this.m_coreCenterV.setXYZ(px,py,pz);
            }
            setCoreCenterY(py:number):void
            {
                this.m_coreCenterV.y = py;
            }
            getCoreWidth():number
            {
                return this.m_coreWidth;
            }
            getBGLong():number
            {
                return this.m_bgLong;
            }
            getSGLong():number
            {
                return this.m_sgLong;
            }
            getCoreCenter():Vector3D
            {
                return this.m_coreCenterV;
            }
            getEngityCore():DisplayEntity
            {
                let coreEntity:Axis3DEntity = new Axis3DEntity();
                coreEntity.initializeCross(this.getCoreWidth());
                coreEntity.setPosition(this.getCoreCenter());
                return coreEntity;
            }
            getEngityBGL():DisplayEntity
            {
                let bgL:Line3DEntity = new Line3DEntity();
                bgL.setRGB3f(0.5,0.8,0.0);
                bgL.initialize(new Vector3D(),new Vector3D(0.0, this.getBGLong(), 0.0));
                return bgL;
            }
            getEngityBGR():DisplayEntity
            {
                let bgR:Line3DEntity = new Line3DEntity();
                bgR.setRGB3f(0.5,0.8,0.0);
                bgR.initialize(new Vector3D(),new Vector3D(0.0, this.getBGLong(), 0.0));
                return bgR;
            }
            getEngitySGL():DisplayEntity
            {
                let sgL:Line3DEntity = new Line3DEntity();
                sgL.setRGB3f(0.9,0.0,0.0);
                sgL.initialize(new Vector3D(),new Vector3D(0.0,this.getSGLong(),0.0));
                return sgL;
            }
            getEngitySGR():DisplayEntity
            {
                let sgR:Line3DEntity = new Line3DEntity();
                sgR.setRGB3f(0.9,0.0,0.0);
                sgR.initialize(new Vector3D(),new Vector3D(0.0,this.getSGLong(),0.0));
                return sgR;
            }
        }
    }
}