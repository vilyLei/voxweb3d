import TextureProxy from "../../../vox/texture/TextureProxy";
import Box3DEntity from "../../../vox/entity/Box3DEntity";
import RendererScene from "../../../vox/scene/RendererScene";
import FourLimbRole from "../../../app/robot/base/FourLimbRole";
import FourLimbRoleFactory from "../../../app/robot/base/FourLimbRoleFactory";
import TrackWheeRoleFactory from "../../../app/robot/base/TrackWheeRoleFactory";
import CampMoudle from "../../../app/robot/camp/CampMoudle";
import { CampType } from "../../../app/robot/camp/Camp";

import SillyRole from "../../../app/robot/base/SillyRole";
import TrackWheelRole from "../../../app/robot/base/TrackWheelRole";
import { TerrainModule } from "../../../app/robot/terrain/TerrainModule";

import { CommonMaterialContext } from "../../../materialLab/base/CommonMaterialContext";
import MaterialBase from "../../../vox/material/MaterialBase";
import {RoleMaterialBuilder} from "./RoleMaterialBuilder";

class RoleBuilder {

    constructor() { }

    private m_rscene: RendererScene = null;

    private m_materialCtx: CommonMaterialContext;
    private m_flrFactory: FourLimbRoleFactory = new FourLimbRoleFactory();
    private m_twrFactory: TrackWheeRoleFactory = new TrackWheeRoleFactory();
    readonly materialBuilder: RoleMaterialBuilder = new RoleMaterialBuilder();

    envAmbientLightEnabled: boolean = false;
    fogEnabled: boolean = false;
    campModule: CampMoudle;
    terrain: TerrainModule;

    private m_texList: TextureProxy[] = null;
    initialize(rscene: RendererScene, materialCtx: CommonMaterialContext): void {
        
        if (this.m_rscene == null) {
            this.m_rscene = rscene;
            this.m_materialCtx = materialCtx;
            this.materialBuilder.envAmbientLightEnabled = this.envAmbientLightEnabled;
            this.materialBuilder.fogEnabled = this.fogEnabled;
            this.materialBuilder.initialize( materialCtx );
            this.initTexture();
        }
    }

    private initTexture(): void {
        
        this.m_texList = [

            this.m_materialCtx.getTextureByUrl("static/assets/wood_01.jpg"),
            this.m_materialCtx.getTextureByUrl("static/assets/yanj.jpg"),
            this.m_materialCtx.getTextureByUrl("static/assets/skin_01.jpg"),
            this.m_materialCtx.getTextureByUrl("static/assets/default.jpg"),
            this.m_materialCtx.getTextureByUrl("static/assets/warter_01.jpg"),
            this.m_materialCtx.getTextureByUrl("static/assets/metal_02.jpg"),
            this.m_materialCtx.getTextureByUrl("static/assets/image_003.jpg"),
            this.m_materialCtx.getTextureByUrl("static/assets/metal_08.jpg")
        ]
        
        this.m_flrFactory.setMaterialBuilder( this.materialBuilder );
        this.m_twrFactory.setMaterialBuilder( this.materialBuilder );
        this.m_flrFactory.initialize(this.m_rscene, 0, this.campModule.redCamp, this.terrain.getTerrainData());
        this.m_twrFactory.initialize(this.m_rscene, 0, this.campModule.redCamp, this.terrain.getTerrainData(), 70.0);
    }
    /*
    private init(): void {

        let srcBox: Box3DEntity = new Box3DEntity();
        srcBox.initializeCube(100.0, [tex2]);
        let i: number = 0;
        for (; i < 0; ++i) {
            let box: Box3DEntity = new Box3DEntity();
            box.copyMeshFrom(srcBox);
            box.initializeCube(100.0, [tex2]);
            box.setScaleXYZ(0.5, 1.0, 0.5);
            //box.setXYZ(200,0.0,200);
            //box.setXYZ(Math.random() * 600.0 - 300.0,0.0,Math.random() * 600.0 - 300.0);
            box.setXYZ(Math.random() * 1000.0 - 500.0, 0.0, Math.random() * 1000.0 - 500.0);
            this.m_rscene.addEntity(box);
            let redRole: RedRole = new RedRole();
            box.getPosition(redRole.position);
            redRole.radius = 80;
            redRole.dispEntity = box;
            this.campModule.redCamp.addRole(redRole);
        }
    }
    //*/
    createLimbRoles(total: number = 20): void {
        
        let tex0 = this.m_texList[0];
        let tex1 = this.m_texList[1];
        let tex2 = this.m_texList[2];

        let limbRole: FourLimbRole;
        let campType: CampType;
        let bodySize: number = 40.0;
        for (let i: number = 0; i < total; ++i) {
            bodySize = Math.round(Math.random() * 60.0) + 30.0;
            switch (i % 3) {
                case 1:
                    campType = CampType.Red;
                    break;
                case 2:
                    campType = CampType.Green;
                    break;
                default:
                    campType = CampType.Blue;
                    break;

            }
            limbRole = this.m_flrFactory.create(tex0, tex1, tex2, campType, bodySize);
            limbRole.lifeTime = 100 + Math.round(300.0 * Math.random());
            limbRole.setXYZ(Math.random() * 1600.0 - 800.0, 0.0, Math.random() * 1600.0 - 800.0);
            limbRole.moveToXZ(Math.random() * 1600.0 - 800.0, Math.random() * 1600.0 - 800.0);

            this.campModule.redCamp.addRole(limbRole);
        }
    }
    createTrackWheelRoles(total: number = 20): void {
        
        let campType: CampType;
        let bodySize: number = 40.0;
        
        let tex2 = this.m_texList[2];
        let tex6 = this.m_texList[6];
        let tex7 = this.m_texList[7];

        for (let i: number = 0; i < total; ++i) {
            switch (i % 3) {
                case 1:
                    campType = CampType.Red;
                    break;
                case 2:
                    campType = CampType.Green;
                    break;
                default:
                    campType = CampType.Blue;
                    break;
            }
            let twRole: TrackWheelRole = this.m_twrFactory.create(tex6, tex7, tex2, campType, bodySize);
            twRole.lifeTime = 100 + Math.round(300.0 * Math.random());
            twRole.setXYZ(Math.random() * 1600.0 - 800.0, 0.0, Math.random() * 1600.0 - 800.0);
            twRole.moveToXZ(Math.random() * 1600.0 - 800.0, Math.random() * 1600.0 - 800.0);
            twRole.wake();
            this.campModule.redCamp.addRole(twRole);
        }
    }
    private m_sillyRole_lowerBox: Box3DEntity;
    private m_sillyRole_upperBox: Box3DEntity;
    
    createSillyRoles(total: number = 20): void {

        let tex3 = this.m_texList[3];
        let tex4 = this.m_texList[4];
        let tex5 = this.m_texList[5];

        let material: MaterialBase = null;

        if(this.m_sillyRole_lowerBox == null) {
            material = this.materialBuilder.createMaterial( tex3 );
            this.m_sillyRole_lowerBox = new Box3DEntity();
            this.m_sillyRole_lowerBox.setMaterial( material );
            this.m_sillyRole_lowerBox.initializeSizeXYZ(50.0, 40, 50, [tex3]);
            this.m_sillyRole_lowerBox.setXYZ(0.0, 20.0, 0.0);
            this.m_sillyRole_upperBox = new Box3DEntity();
            this.m_sillyRole_upperBox.setMaterial( material );
            this.m_sillyRole_upperBox.initializeSizeXYZ(30.0, 20, 30, [tex5]);
            this.m_sillyRole_upperBox.setXYZ(0.0, 50.0, 0.0);

        }
        let srcSillyRole: SillyRole = null;
        let lowerBox: Box3DEntity = this.m_sillyRole_lowerBox;
        let upperBox: Box3DEntity = this.m_sillyRole_upperBox;
        
        for (let i: number = 0; i < total; ++i) {

            let sillyRole: SillyRole = new SillyRole();
            if (srcSillyRole != null) {
                sillyRole.initializeFrom(srcSillyRole);
            }
            else {
                let box0: Box3DEntity = new Box3DEntity();
                
                let pmaterial = this.materialBuilder.createMaterial(tex5);
                
                (pmaterial as any).setRGB3f(Math.random() + 0.2, Math.random() + 0.2, Math.random() + 0.2);
                box0.setMaterial(pmaterial);
                box0.copyMeshFrom(lowerBox);
                box0.initializeSizeXYZ(50.0, 40, 50, [tex5]);
                box0.setXYZ(0.0, 20.0, 0.0);
                
                let box1: Box3DEntity = new Box3DEntity();
                pmaterial = this.materialBuilder.createMaterial(tex4);
                (pmaterial as any).setRGB3f(Math.random() + 0.4, Math.random() + 0.4, Math.random() + 0.4);
                box1.setMaterial(pmaterial);
                box1.copyMeshFrom(upperBox);
                box1.initializeSizeXYZ(30.0, 20, 30, [tex4]);
                box1.setXYZ(0.0, 50.0, 0.0);
                sillyRole.initialize(this.m_rscene, 0, box0, box1);
            }

            sillyRole.setXYZ(Math.random() * 1600.0 - 800.0, 0.0, Math.random() * 1600.0 - 800.0);
            sillyRole.moveToXZ(Math.random() * 1600.0 - 800.0, Math.random() * 1600.0 - 800.0);

            sillyRole.campType = CampType.Free;
            sillyRole.terrainData = this.terrain.getTerrainData();
            sillyRole.attackDis = 50;
            sillyRole.radius = 80;
            sillyRole.lifeTime = 200 + Math.round(200.0 * Math.random());
            sillyRole.wake();
            this.campModule.redCamp.addRole(sillyRole);
        }
    }

}
export { RoleBuilder };