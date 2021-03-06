/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import TextureProxy from "../../../vox/texture/TextureProxy";
import RendererScene from "../../../vox/scene/RendererScene";
import BoxPartStore from "../../../app/robot/BoxPartStore";
import FourLimbRole from "../../../app/robot/base/FourLimbRole";
import IRoleCamp from "../../../app/robot/IRoleCamp";
import ITerrain from "../../../app/robot/scene/ITerrain";
import {CampType} from "../../../app/robot/camp/Camp";

export default class FourLimbRoleFactory
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