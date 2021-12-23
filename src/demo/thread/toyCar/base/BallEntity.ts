/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../../vox/math/Vector3D";
import TextureProxy from "../../../../vox/texture/TextureProxy";
import { AssetPackage } from "./AssetPackage";
import RendererScene from "../../../../vox/scene/RendererScene";
import { CommonMaterialContext } from "../../../../materialLab/base/CommonMaterialContext";

import { NavigationStatus } from "../../../../voxnav/tileTerrain/NavigationStatus";

import LambertLightMaterial from "../../../../vox/material/mcase/LambertLightMaterial";
import Color4 from "../../../../vox/material/Color4";
import MathConst from "../../../../vox/math/MathConst";
import { PathNavigator } from "../../../../voxnav/tileTerrain/PathNavigator";
import Sphere3DEntity from "../../../../vox/entity/Sphere3DEntity";
import DisplayEntity from "../../../../vox/entity/DisplayEntity";
import IEntityTransform from "../../../../vox/entity/IEntityTransform";
import DisplayEntityContainer from "../../../../vox/entity/DisplayEntityContainer";

class BallEntity {

    private static s_srcSphere: Sphere3DEntity = null;

    private m_outPos: Vector3D = new Vector3D();
    private m_container: DisplayEntityContainer = null;
    private m_scene: RendererScene = null;
    private m_entity: DisplayEntity = null;
    private m_visible: boolean = true;
    private m_radius: number = 0.0;
    private m_rotDegSpeed: number = 1.0;
    private m_rot: number = 0.0;
    private m_scale: number = 1.0;

    readonly navigator: PathNavigator = new PathNavigator();

    asset: AssetPackage = null;

    constructor() {
    }

    build(sc: RendererScene, materialCtx: CommonMaterialContext, size: number = 200): void {
        if(this.m_scene == null) {

            this.m_container = new DisplayEntityContainer();
            this.m_scene = sc;
            this.m_radius = size * 0.5;
            
            let tex0: TextureProxy = this.asset.textures[2];
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
            material0.setBlendFactor(0.8,0.8);
    
            this.navigator.positionOffset = new Vector3D(0.0, this.m_radius ,0.0);
            let entity: DisplayEntity;
            entity = new DisplayEntity();
            entity.copyMeshFrom(srcEntity);
            entity.setMaterial(material0);
            this.m_entity = entity;
            this.m_container.addEntity(entity);
            sc.addContainer(this.m_container);

            this.calcRotSpd();
        }
    }
    private calcRotSpd(): void {
        let spd: number = this.navigator.curveMotion.getSpeed();
        let f: number = spd / (2.0 * Math.PI * this.m_radius * this.m_scale);
        this.m_rotDegSpeed = 360.0 * f;
        //console.log("this.m_rotDegSpeed: ",this.m_rotDegSpeed);
    }
    getTransformEntity(): IEntityTransform {
        return this.m_container;
    }
    setVisible(visible: boolean): void {
        this.m_container.setVisible(visible);
    }
    getVisible(): boolean {
        return this.m_visible;
    }
    setScale(scale: number): void {

        this.m_scale = scale;
        this.m_container.setScaleXYZ(scale, scale, scale);
        this.navigator.positionOffset.y = scale * this.m_radius;

        this.calcRotSpd();
    }
    setSpeed(spd: number): void {
        this.navigator.curveMotion.setSpeed(spd);
        this.calcRotSpd();
    }
    getSpeed(): number {
        return this.navigator.curveMotion.getSpeed();
    }
    getScale(): number {
        return this.m_scale;
    }
    getPosition(): Vector3D {
        this.m_entity.getPosition(this.m_outPos);
        return this.m_outPos;
    }
    setPosition(pos: Vector3D): void {

        this.m_outPos.copyFrom(pos);
        this.m_outPos.addBy(this.navigator.positionOffset);
        this.m_container.setPosition(this.m_outPos);
        this.navigator.status = NavigationStatus.Init;
    }
    setXYZ(px: number, py: number, pz: number): void {

        this.m_container.setXYZ(px, py + this.navigator.positionOffset.y, pz);
        this.navigator.status = NavigationStatus.Init;
    }

    destroy(): void {

        if(this.m_container != null) {
            this.m_scene.removeContainer( this.m_container );
            
            this.m_entity.destroy();
            this.m_container.destroy();
            this.navigator.destroy();
            this.m_container = null;
            this.m_entity = null;
        }
    }

    updateBounds(): void {
        //this.m_entity.updateBounds();
    }
    run(): void {
        if(this.navigator.isMoving()) {
            //console.log("....");
            this.m_rot -= this.m_rotDegSpeed;
            this.m_entity.setRotationXYZ(0.0, 0.0, this.m_rot);
            // this.m_entity.update();
            // this.m_container.update();
        }
        //this.navigator.run();
    }

}
export { BallEntity };