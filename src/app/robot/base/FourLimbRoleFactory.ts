/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../../vox/math/MathConst";
import * as Vector3T from "../../../vox/math/Vector3D";
import * as TextureProxyT from "../../../vox/texture/TextureProxy";
import * as RendererSceneT from "../../../vox/scene/RendererScene";
import * as BoxPartStoreT from "../../../app/robot/BoxPartStore";
import * as FourLimbRoleT from "../../../app/robot/base/FourLimbRole";
import * as IRoleCampT from "../../../app/robot/IRoleCamp";
import * as ITerrainT from "../../../app/robot/scene/ITerrain";
import * as CampT from "../../../app/robot/camp/Camp";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import RendererScene = RendererSceneT.vox.scene.RendererScene;

import BoxPartStore = BoxPartStoreT.app.robot.BoxPartStore;
import FourLimbRole = FourLimbRoleT.app.robot.base.FourLimbRole;
import IRoleCamp = IRoleCampT.app.robot.IRoleCamp;
import ITerrain = ITerrainT.app.robot.scene.ITerrain;
import CampType = CampT.app.robot.camp.CampType;

export namespace app
{
    export namespace robot
    {
        export namespace base
        {
            export class FourLimbRoleFactory
            {
                private m_roleCamp:IRoleCamp = null;
                private m_terrain:ITerrain = null;
                private m_rscene:RendererScene = null;
                private m_renderProcessIndex:number = 0;
                constructor(){}
                initialize(rscene:RendererScene, renderProcessIndex:number, roleCamp:IRoleCamp, terrain:ITerrain):void
                {
                    this.m_rscene = rscene;
                    this.m_renderProcessIndex = renderProcessIndex;
                    this.m_roleCamp = roleCamp;
                    this.m_terrain = terrain;
                }
                create(tex0:TextureProxy, tex1:TextureProxy, tex2:TextureProxy, campType:CampType, bodyWidth:number):FourLimbRole
                {
                    let boxPart0:BoxPartStore = new BoxPartStore();
                    boxPart0.setSgSize(10,15);
                    boxPart0.initilize(tex0,tex2,tex1);
    
                    let boxPart1:BoxPartStore = new BoxPartStore();
                    boxPart1.setParam(100.0,-40.0,-30.0);
                    boxPart1.setBgSize(10, 8);
                    boxPart1.setSgSize(7,  5);
                    boxPart1.initilize(tex0,tex2,tex1);
                    
                    let limbRole:FourLimbRole = new FourLimbRole();
                    limbRole.roleCamp = this.m_roleCamp;
                    limbRole.terrain = this.m_terrain;
                    limbRole.radius = (bodyWidth * 2.0) + 15.0;
                    limbRole.campType = campType;                    
                    limbRole.initialize(this.m_rscene, this.m_renderProcessIndex, boxPart0, boxPart1, bodyWidth);

                    return limbRole;
                }
            }
        }
    }
}