/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import TextureProxy from "../../../vox/texture/TextureProxy";
import RendererScene from "../../../vox/scene/RendererScene";
import TrackWheelRole from "../../../app/robot/base/TrackWheelRole";
import IRoleCamp from "../../../app/robot/IRoleCamp";
import ITerrain from "../../../app/robot/scene/ITerrain";
import {CampType} from "../../../app/robot/camp/Camp";
import AssetsModule from "../../../app/robot/assets/AssetsModule";
import Box3DEntity from "../../../vox/entity/Box3DEntity";
import BoxGroupTrack from "../../../voxanimate/primitive/BoxGroupTrack";
import TrackWheelWeaponBody from "../../../app/robot/base/TrackWheelWeaponBody";
import TrackWheelChassisBody from "../../../app/robot/base/TrackWheelChassisBody";

export default class TrackWheeRoleFactory
{
    private m_roleCamp:IRoleCamp = null;
    private m_terrain:ITerrain = null;
    private m_rscene:RendererScene = null;
    private m_renderProcessIndex:number = 0;

    private m_boxTrack:BoxGroupTrack = null;
    private m_srcTwUpperBox:Box3DEntity = null;
    constructor()
    {
    }
    initialize(rscene:RendererScene, renderProcessIndex:number, roleCamp:IRoleCamp, terrain:ITerrain):void
    {
        this.m_rscene = rscene;
        this.m_renderProcessIndex = renderProcessIndex;
        this.m_roleCamp = roleCamp;
        this.m_terrain = terrain;
        
        if(this.m_boxTrack == null){
            this.m_boxTrack = new BoxGroupTrack();
            this.m_boxTrack.setTrackScaleXYZ(0.5,0.4,1.0);
            this.m_boxTrack.setFactor(5,5,5);
            this.m_boxTrack.initialize(this.m_rscene.textureBlock,5.0,[AssetsModule.GetImageTexByUrl("static/assets/default.jpg")]);
            this.m_boxTrack.animator.setXYZ(0.0,20.0,0.0);

            this.m_srcTwUpperBox = new Box3DEntity();
            this.m_srcTwUpperBox.initializeSizeXYZ(60.0,30,60,[AssetsModule.GetImageTexByUrl("static/assets/default.jpg")]);
            this.m_srcTwUpperBox.setXYZ(0.0,70.0,0.0);
        }
    }
    create(tex0:TextureProxy, tex1:TextureProxy, tex2:TextureProxy, campType:CampType, bodyWidth:number):TrackWheelRole
    {
        let twRole:TrackWheelRole = new TrackWheelRole();
        
        twRole.roleCamp = this.m_roleCamp;
        twRole.terrain = this.m_terrain;
        twRole.campType = campType;
        twRole.attackDis = 50;
        twRole.radius = 80;
        twRole.lifeTime = 200;
        
        let weaponBody:TrackWheelWeaponBody = new TrackWheelWeaponBody();
        weaponBody.initWeap01(tex1);
        //weaponBody.initWeap02(tex0);
        weaponBody.initialize(this.m_rscene, twRole.getAttackModule().getContainer());

        let chassisBody:TrackWheelChassisBody = new TrackWheelChassisBody();
        //chassisBody.initWeap01(tex0);
        chassisBody.initWeap02(tex0);
        chassisBody.initialize(this.m_rscene, twRole.getMotionModule().getContainer());
        twRole.initialize(this.m_rscene, 0,this.m_boxTrack, weaponBody,chassisBody, 80.0);
        
        return twRole;
    }
}