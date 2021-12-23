/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../../vox/math/Vector3D";
import Matrix4 from "../../../../vox/math/Matrix4";
import PureEntity from "../../../../vox/entity/PureEntity";

import TextureProxy from "../../../../vox/texture/TextureProxy";
import Box3DEntity from "../../../../vox/entity/Box3DEntity";
import { AssetPackage } from "./AssetPackage";
import RendererScene from "../../../../vox/scene/RendererScene";
import { CommonMaterialContext } from "../../../../materialLab/base/CommonMaterialContext";
import { IToyEntity } from "./IToyEntity";
import Line3DEntity from "../../../../vox/entity/Line3DEntity";

import { NavigationStatus } from "../../../../voxnav/tileTerrain/NavigationStatus";

import LambertLightMaterial from "../../../../vox/material/mcase/LambertLightMaterial";
import Color4 from "../../../../vox/material/Color4";
import MathConst from "../../../../vox/math/MathConst";
import Cylinder3DEntity from "../../../../vox/entity/Cylinder3DEntity";
import { PathNavigator } from "../../../../voxnav/tileTerrain/PathNavigator";
import Sphere3DEntity from "../../../../vox/entity/Sphere3DEntity";
import DisplayEntity from "../../../../vox/entity/DisplayEntity";

class BallEntity {

    private static s_srcSphere: Sphere3DEntity = null;

    private m_outPos: Vector3D = new Vector3D();

    private m_scene: RendererScene = null;
    private m_entity: DisplayEntity = null;
    private m_visible: boolean = true;
    private m_radius: number = 0.0;

    readonly navigator: PathNavigator = new PathNavigator();

    asset: AssetPackage = null;

    constructor() {
    }

    build(sc: RendererScene, materialCtx: CommonMaterialContext, size: number = 200): void {

        this.m_scene = sc;
        this.m_radius = size * 0.5;

        let tex0: TextureProxy = this.asset.textures[0];
        let material: LambertLightMaterial;
        if (BallEntity.s_srcSphere == null) {
            BallEntity.s_srcSphere = new Sphere3DEntity();

            material = materialCtx.createLambertLightMaterial();
            material.diffuseMap = tex0;
            material.fogEnabled = false;
            BallEntity.s_srcSphere.setMaterial(material);

            BallEntity.s_srcSphere.initialize(this.m_radius, 15, 15, [tex0]);
        }
        let srcEntity = BallEntity.s_srcSphere;

        let color = new Color4(Math.random() + 0.4, Math.random() + 0.4, Math.random() + 0.4, 1.0);

        let material0 = materialCtx.createLambertLightMaterial();
        material0.diffuseMap = tex0;
        material0.fogEnabled = false;
        material0.initializeByCodeBuf(true);
        material0.setColor(color);

        this.navigator.positionOffset = new Vector3D(0.0, this.m_radius ,0.0);
        let entity: DisplayEntity;
        entity = new DisplayEntity();
        entity.copyMeshFrom(srcEntity);
        entity.setMaterial(material0);
        this.m_entity = entity;
        sc.addEntity(entity);
        
    }
    getDisplayEntity(): DisplayEntity {
        return this.m_entity;
    }
    setVisible(visible: boolean): void {
        this.m_entity.setVisible(visible);
    }
    getVisible(): boolean {
        return this.m_visible;
    }
    setScale(scale: number): void {
        
        this.m_entity.setScaleXYZ(scale, scale, scale);
        this.navigator.positionOffset.y = scale * this.m_radius;
    }
    setSpeed(spd: number): void {
        this.navigator.curveMotion.setSpeed(spd);
    }
    getSpeed(): number {
        return this.navigator.curveMotion.getSpeed();
    }
    getPosition(): Vector3D {
        this.m_entity.getPosition(this.m_outPos);
        return this.m_outPos;
    }
    setPosition(pos: Vector3D): void {
        this.m_outPos.copyFrom(pos);
        this.m_outPos.addBy(this.navigator.positionOffset);
        this.m_entity.setPosition(this.m_outPos);
        this.navigator.status = NavigationStatus.Init;
    }
    setXYZ(px: number, py: number, pz: number): void {

        this.m_entity.setXYZ(px, py + this.navigator.positionOffset.y, pz);
        this.navigator.status = NavigationStatus.Init;
    }

    destroy(): void {

        if(this.m_entity != null) {
            this.m_scene.removeEntity( this.m_entity );
            
            this.m_entity.destroy();
            this.navigator.destroy();
        }
    }

    updateBounds(): void {
        this.m_entity.updateBounds();
    }
    run(): void {
        if(this.navigator.isMoving()) {
            this.m_entity.update();
        }
        this.navigator.run();
    }

}
export { BallEntity };