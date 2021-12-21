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
import { TerrainPathStatus, TerrainPath } from "../terrain/TerrainPath";
import { TerrainData } from "../terrain/TerrainData";
import Line3DEntity from "../../../../vox/entity/Line3DEntity";

import IEntityTransform from "../../../../vox/entity/IEntityTransform";
import { CurveMotionXZModule } from "../../../../voxmotion/primitive/CurveMotionXZModule";
import { EntityStatus } from "./EntityStatus";
import { CarEntityTransform } from "./CarEntityTransform";
import { PathCalculator } from "./PathCalculator";
import LambertLightMaterial from "../../../../vox/material/mcase/LambertLightMaterial";
import Color4 from "../../../../vox/material/Color4";

class CarEntity implements IToyEntity {

    private static s_srcBox0: Box3DEntity = null;
    private static s_srcBox1: Box3DEntity = null;

    readonly curveMotion: CurveMotionXZModule = new CurveMotionXZModule();
    private m_pathCurve: Line3DEntity = null;

    private m_entityIndex: number = -1;
    private m_fs32Length: number = 15;
    private m_fs32Data: Float32Array = null;
    private m_entityList: PureEntity[] = [];
    private m_transMat4List: Matrix4[] = [];
    //private m_position: Vector3D = new Vector3D();
    //private m_outPos: Vector3D = new Vector3D();
    private m_scene: RendererScene = null;
    private m_pathPosList: Vector3D[] = [];
    private m_speed: number = 1.0;
    private m_delayTime: number = 10;
    private m_visible: boolean = true;

    readonly transform: CarEntityTransform = new CarEntityTransform();
    status: EntityStatus = EntityStatus.Init;
    asset: AssetPackage = null;
    terrainData: TerrainData = null;
    autoSerachPath: boolean = false;
    readonly path: TerrainPath = new TerrainPath();
    constructor() {
    }
    getStatus(): EntityStatus {
        return this.status > this.transform.status ? this.status : this.transform.status;
    }
    getEneityIndex(): number {
        return this.m_entityIndex;
    }
    setFS32Data(srcFS32: Float32Array, index: number): void {
        this.m_entityIndex = index;
        // this.m_fs32Data = srcFS32.subarray(index * this.m_fs32Length, (index + 1) * this.m_fs32Length);
        this.transform.setFS32Data(srcFS32, index);
    }
    build(sc: RendererScene, materialCtx: CommonMaterialContext, size: number = 200): void {

        if (this.m_entityIndex >= 0) {
            this.m_scene = sc;
            let halfSize: number = size * 0.5;
            // if (this.m_pathCurve == null) {
            //     this.m_pathCurve = new Line3DEntity();
            //     this.m_pathCurve.initialize(new Vector3D(), new Vector3D(100.0));
            //     this.m_pathCurve.setXYZ(0.0, 20.0, 0.0);
            //     this.m_scene.addEntity(this.m_pathCurve);
            // }

            let tex0: TextureProxy = this.asset.textures[0];
            let material: LambertLightMaterial;
            if (CarEntity.s_srcBox0 == null) {
                CarEntity.s_srcBox0 = new Box3DEntity();

                material = materialCtx.createLambertLightMaterial();
                material.diffuseMap = tex0;
                material.fogEnabled = false;
                CarEntity.s_srcBox0.setMaterial(material);

                CarEntity.s_srcBox0.initialize(new Vector3D(-halfSize, -halfSize * 0.5, -halfSize), new Vector3D(halfSize, halfSize * 0.5, halfSize), [tex0]);
            }
            if (CarEntity.s_srcBox1 == null) {
                CarEntity.s_srcBox1 = new Box3DEntity();

                material = materialCtx.createLambertLightMaterial();
                material.diffuseMap = tex0;
                material.fogEnabled = false;
                CarEntity.s_srcBox1.setMaterial(material);

                CarEntity.s_srcBox1.initialize(new Vector3D(-halfSize, -halfSize, -halfSize), new Vector3D(halfSize, halfSize, halfSize), [tex0]);
            }
            let srcBox0 = CarEntity.s_srcBox0;
            let srcBox1 = CarEntity.s_srcBox1;

            let color = new Color4(Math.random() + 0.4, Math.random() + 0.4, Math.random() + 0.4, 1.0);
            let materialBox0: Box3DEntity = new Box3DEntity();
            
            material = materialCtx.createLambertLightMaterial();
            material.diffuseMap = tex0;
            material.fogEnabled = false;
            materialBox0.setMaterial(material);
            materialBox0.copyMeshFrom(srcBox0);
            materialBox0.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex0]);
            material.setColor( color );
            
            let tex1: TextureProxy = this.asset.textures[1];
            let materialBox1: Box3DEntity = new Box3DEntity();
            color.setRGBA4f(Math.random() + 0.4, Math.random() + 0.4, Math.random() + 0.4, 1.0);
            material = materialCtx.createLambertLightMaterial();
            material.diffuseMap = tex1;
            material.fogEnabled = false;
            materialBox1.setMaterial(material);
            materialBox1.copyMeshFrom(srcBox0);
            materialBox1.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
            material.setColor(color);

            let box: PureEntity;
            box = new PureEntity();
            box.copyMeshFrom(srcBox0);
            box.copyMaterialFrom(materialBox0);
            sc.addEntity(box);
            this.m_entityList.push(box);
            this.m_transMat4List.push(box.getMatrix());

            for (let j: number = 1; j < 5; j++) {
                box = new PureEntity();
                box.copyMeshFrom(srcBox1);
                box.copyMaterialFrom(materialBox1);
                sc.addEntity(box);
                this.m_entityList.push(box);
                this.m_transMat4List.push(box.getMatrix());
            }
            this.transform.initParam();

            this.setVisible(false);
            this.m_delayTime = Math.round(Math.random() * 100) + 30;
        }
    }
    setVisible(visible: boolean): void {
        if (this.m_visible !== visible) {
            this.m_visible = visible;
            for (let i: number = 0; i < this.m_entityList.length; ++i) {
                this.m_entityList[i].setVisible(visible);
            }
        }
    }
    getVisible(): boolean {
        return this.m_visible;
    }
    setSpeed(spd: number): void {
        this.curveMotion.setSpeed(spd);
    }
    getSpeed(): number {
        return this.curveMotion.getSpeed();
    }
    getPosition(): Vector3D {
        return this.transform.getPosition();
    }
    setPosition(pos: Vector3D): void {
        this.transform.setPosition(pos);
        this.status = EntityStatus.Init;
    }
    setXYZ(px: number, py: number, pz: number): void {

        this.transform.setXYZ(px, py, pz);
        this.status = EntityStatus.Init;
    }

    destroy(): void {
    }

    isReadySearchPath(): boolean {
        return this.path.isReadySearchPath();
    }

    searchedPath(vs: Uint16Array): void {

        //console.log("searchedPath,vs: ", vs);

        let posList: Vector3D[] = PathCalculator.GetPathPosList(vs, this.path, this.terrainData);

        // console.log("posList: ", posList);
        // if (this.m_pathCurve != null) {
        //     this.m_pathCurve.initializePolygon(posList);
        //     this.m_pathCurve.reinitializeMesh();
        //     this.m_pathCurve.updateMeshToGpu();
        //     this.m_pathCurve.updateBounds();
        // }

        let motion = this.curveMotion.motion;
        motion.setTarget(this.transform);
        motion.setVelocityFactor(0.04, 0.04);
        motion.setCurrentPosition(this.getPosition());
        this.curveMotion.setPathPosList(posList);

        this.path.searchedPath();
        this.path.movingPath();

        this.m_delayTime = Math.round(Math.random() * 100) + 30;
        this.status = EntityStatus.Moving;
    }
    updateTrans(fs32: Float32Array): void {

        this.setVisible(true);

        switch (this.status) {
            case EntityStatus.Init:
                if (this.status == EntityStatus.Init) {
                    this.status = EntityStatus.Stop;
                }
                break;
            default:
                break;
        }
        this.transform.updateTrans();

        let index = this.m_entityIndex * 5;
        for (let i: number = 0; i < this.m_transMat4List.length; ++i) {
            this.m_transMat4List[i].copyFromF32Arr(fs32, index * 16);
            this.m_entityList[i].updateTransform();
            this.m_entityList[i].update();

            ++index;
        }
    }
    run(): void {
        if (this.path.isMoving()) {
            if (this.curveMotion.isStopped()) {
                this.path.stopPath();
                this.status = EntityStatus.Stop;
            }
            else {
                this.curveMotion.run();
            }
        }
        else {
            if (this.m_delayTime > 0) {
                this.m_delayTime--;
                if (this.m_delayTime == 0) {
                    this.testRandomSerachPath();
                }
            }
        }
    }
    private testRandomSerachPath(): void {
        if (this.autoSerachPath) {
            let beginRC: number[] = this.terrainData.getRCByPosition(this.getPosition());
            let endRC: number[] = this.terrainData.getRandomFreeRC();

            this.path.setSearchPathParam(beginRC[0], beginRC[1], endRC[0], endRC[1]);
            if (beginRC[0] != endRC[0] || beginRC[1] != endRC[1]) {
                this.path.searchPath();
            }
            else {
                this.stopAndWait();
            }
        }
    }
    stopAndWait(): void {
        this.m_delayTime = Math.round(Math.random() * 100) + 30;
        this.path.stopPath();
    }
}
export { CarEntity };