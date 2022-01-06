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
import { TerrainData } from "../../../terrain/tile/TerrainData";
import { CampType } from "../../../app/robot/camp/Camp";
import AssetsModule from "../../../app/robot/assets/AssetsModule";
import Box3DEntity from "../../../vox/entity/Box3DEntity";
import BoxGroupTrack from "../../../voxanimate/primitive/BoxGroupTrack";
import TrackWheelWeaponBody from "../../../app/robot/base/TrackWheelWeaponBody";
import TrackWheelChassisBody from "../../../app/robot/base/TrackWheelChassisBody";
import Vector3D from "../../../vox/math/Vector3D";
import {RoleMaterialBuilder} from "../scene/RoleMaterialBuilder";
import Color4 from "../../../vox/material/Color4";

export default class TrackWheeRoleFactory {
    private m_roleCamp: IRoleCamp = null;
    private m_terrainData: TerrainData = null;
    private m_rscene: RendererScene = null;
    private m_renderProcessIndex: number = 0;

    private m_boxTrack: BoxGroupTrack = null;
    private m_materialBuilder: RoleMaterialBuilder = null;
    constructor() {
    }

    setMaterialBuilder(materialBuilder: RoleMaterialBuilder): void {
        this.m_materialBuilder = materialBuilder;
    }
    initialize(rscene: RendererScene, renderProcessIndex: number, roleCamp: IRoleCamp, terrainData: TerrainData, dis: number = 50.0): void {
        
        this.m_rscene = rscene;
        this.m_renderProcessIndex = renderProcessIndex;
        this.m_roleCamp = roleCamp;
        this.m_terrainData = terrainData;

        if (this.m_boxTrack == null) {
            this.m_boxTrack = new BoxGroupTrack();
            this.m_boxTrack.animator.diffuseMapEnabled = true;
            this.m_boxTrack.animator.normalEnabled = true;

            this.m_boxTrack.setTrackScaleXYZ(0.5, 0.4, 1.0);
            this.m_boxTrack.setFactor(5, 5, 5);
            this.m_boxTrack.animator.setGroupPositions([new Vector3D(0.0, 0.0, -0.5 * dis), new Vector3D(0.0, 0.0, 0.5 * dis)]);
            this.m_boxTrack.initialize(this.m_rscene.textureBlock, 5.0, [AssetsModule.GetImageTexByUrl("static/assets/default.jpg")], 0.98);
            this.m_boxTrack.animator.setXYZ(0.0, 20.0, 0.0);
        }
    }
    create(tex0: TextureProxy, tex1: TextureProxy, tex2: TextureProxy, campType: CampType, bodyWidth: number): TrackWheelRole {

        let twRole: TrackWheelRole = new TrackWheelRole();
        twRole.materialBuilder = this.m_materialBuilder;

        twRole.roleCamp = this.m_roleCamp;
        twRole.terrainData = this.m_terrainData;
        twRole.campType = campType;
        twRole.attackDis = 50;
        twRole.radius = 80;
        twRole.lifeTime = 200;
        
        let color: Color4 =  new Color4();
        //color.setRGB3f(Math.random() * 0.7 + 0.4, Math.random() * 0.7 + 0.4, Math.random() * 0.7 + 0.4);
        color.normalizeRandom(2.0);

        let weaponBody: TrackWheelWeaponBody = new TrackWheelWeaponBody();
        weaponBody.color = color;
        weaponBody.materialBuilder = this.m_materialBuilder;
        weaponBody.initWeap01(tex1);
        //weaponBody.initWeap02(tex0);
        weaponBody.initialize(this.m_rscene, twRole.getAttackModule().getContainer());

        let chassisBody: TrackWheelChassisBody = new TrackWheelChassisBody();
        chassisBody.color = color;
        chassisBody.materialBuilder = this.m_materialBuilder;
        //chassisBody.initWeap01(tex0);
        chassisBody.initWeap02(tex0);
        chassisBody.initialize(this.m_rscene, twRole.getMotionModule().getContainer());
        twRole.initialize(this.m_rscene, 0, this.m_boxTrack, weaponBody, chassisBody, 80.0);

        return twRole;
    }
}