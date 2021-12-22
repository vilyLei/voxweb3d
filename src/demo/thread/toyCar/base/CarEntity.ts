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

import { CurveMotionXZModule } from "../../../../voxmotion/primitive/CurveMotionXZModule";
import { EntityStatus } from "./EntityStatus";
import { CarEntityTransform } from "./CarEntityTransform";
import LambertLightMaterial from "../../../../vox/material/mcase/LambertLightMaterial";
import Color4 from "../../../../vox/material/Color4";
import MathConst from "../../../../vox/math/MathConst";
import Cylinder3DEntity from "../../../../vox/entity/Cylinder3DEntity";
import { PathNavigator } from "./PathNavigator";

class CarEntity implements IToyEntity {

    private static s_srcBox0: Box3DEntity = null;
    private static s_srcBox1: Box3DEntity = null;
    private static s_srcCyl1: Cylinder3DEntity = null;

    private m_outPos: Vector3D = new Vector3D();
    // private m_pathCurve: Line3DEntity = null;

    private m_entityIndex: number = -1;
    
    private m_entityList: PureEntity[] = [];
    private m_transMat4List: Matrix4[] = [];
    private m_scene: RendererScene = null;
    
    private m_visible: boolean = true;

    readonly navigator: PathNavigator = new PathNavigator();
    readonly transform: CarEntityTransform = new CarEntityTransform();
    readonly curveMotion: CurveMotionXZModule = new CurveMotionXZModule();

    asset: AssetPackage = null;
    autoSerachPath: boolean = false;
    boundsChanged: boolean = false;

    constructor() {
    }
    
    getStatus(): EntityStatus {
        return this.navigator.status > this.transform.status ? this.navigator.status : this.transform.status;
    }
    setEntityIndex(index: number): void {
        this.m_entityIndex = index;
    }
    getEntityIndex(): number {
        return this.m_entityIndex;
    }
    setFS32Data(srcFS32: Float32Array): void {        
        this.transform.setFS32Data(srcFS32, this.m_entityIndex);
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
            // if (CarEntity.s_srcBox1 == null) {
            //     CarEntity.s_srcBox1 = new Box3DEntity();

            //     material = materialCtx.createLambertLightMaterial();
            //     material.diffuseMap = tex0;
            //     material.fogEnabled = false;
            //     CarEntity.s_srcBox1.setMaterial(material);

            //     CarEntity.s_srcBox1.initialize(new Vector3D(-halfSize, -halfSize, -halfSize), new Vector3D(halfSize, halfSize, halfSize), [tex0]);
            // }
            let srcBox0 = CarEntity.s_srcBox0;
            // let srcBox1 = CarEntity.s_srcBox1;

            let color = new Color4(Math.random() + 0.4, Math.random() + 0.4, Math.random() + 0.4, 1.0);

            let material0 = materialCtx.createLambertLightMaterial();
            material0.diffuseMap = tex0;
            material0.fogEnabled = false;
            material0.initializeByCodeBuf(true);
            material0.setColor(color);

            let tex1: TextureProxy = this.asset.textures[1];
            color.setRGBA4f(Math.random() + 0.4, Math.random() + 0.4, Math.random() + 0.4, 1.0);
            let material1 = materialCtx.createLambertLightMaterial();
            material1.diffuseMap = tex1;
            material1.fogEnabled = false;
            material1.initializeByCodeBuf(true);
            material1.setColor(color);


            if (CarEntity.s_srcCyl1 == null) {
                let cyl: Cylinder3DEntity = new Cylinder3DEntity();
                CarEntity.s_srcCyl1 = cyl;
                material = materialCtx.createLambertLightMaterial();
                material.diffuseMap = tex0;
                material.fogEnabled = false;
                cyl.setMaterial(material);

                let transMat4: Matrix4 = new Matrix4();
                transMat4.appendRotationEulerAngle(MathConst.DegreeToRadian(90.0), 0.0, 0.0);
                cyl.uScale = 12.0;
                cyl.setVtxTransformMatrix(transMat4);
                cyl.initialize(150, 100, 15, [tex0], 0);
            }

            let box: PureEntity;
            box = new PureEntity();
            box.copyMeshFrom(srcBox0);
            box.setMaterial(material0);
            sc.addEntity(box);
            this.m_entityList.push(box);
            this.m_transMat4List.push(box.getMatrix());
            // 优化轮子的转动渲染: 
            // 1. 四个轮子的旋转，可以合并为多段组成的一个大mesh, 渲染的时候每次只渲染一段来实现动画效果。这样操作之后，绘制次数会减少一半左右
            // 2. 用uv动画的方式来实现旋转效果
            for (let j: number = 1; j < 5; j++) {

                // box = new PureEntity();
                // box.copyMeshFrom(srcBox1);
                // box.setMaterial(material1);
                // //box.copyMaterialFrom(materialBox1);
                // sc.addEntity(box);
                // this.m_entityList.push(box);
                // this.m_transMat4List.push(box.getMatrix());

                let cyl = new PureEntity();
                cyl.setMaterial(material1);
                cyl.copyMeshFrom(CarEntity.s_srcCyl1);
                sc.addEntity(cyl);
                this.m_entityList.push(cyl);
                this.m_transMat4List.push(cyl.getMatrix());
            }
            this.transform.initParam();

            this.setVisible(false);
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
        this.transform.getPosition( this.m_outPos );
        return this.m_outPos;
    }
    setPosition(pos: Vector3D): void {
        this.transform.setPosition(pos);
        this.navigator.status = EntityStatus.Init;
    }
    setXYZ(px: number, py: number, pz: number): void {

        this.transform.setXYZ(px, py, pz);
        this.navigator.status = EntityStatus.Init;
    }

    destroy(): void {
    }

    updateBounds(): void {
        // if(this.boundsChanged) {
        //     //for (let i: number = 0; i < this.m_transMat4List.length; ++i) {
        //     for (let i: number = 0; i < 5; ++i) {
        //         this.m_entityList[i].update();
        //     }
        //     this.boundsChanged = false;
        // }
    }
    updateTrans(fs32: Float32Array): void {

        this.setVisible(true);

        switch (this.navigator.status) {
            case EntityStatus.Init:
                if (this.navigator.status == EntityStatus.Init) {
                    this.navigator.status = EntityStatus.Stop;
                }
                break;
            default:
                break;
        }

        this.transform.updateTrans();
        this.boundsChanged = true;
        let index = this.m_entityIndex * 5;
        for (let i: number = 0; i < this.m_transMat4List.length; ++i) {
            this.m_transMat4List[i].copyFromF32Arr(fs32, index * 16);
            // 在这里 update bounds的好处是及时的让摄像机剔除掉不需要绘制的可渲染对象
            this.m_entityList[i].updateTransform();
            this.m_entityList[i].update();

            ++index;
        }
    }
    
    run(): void {
        this.navigator.run();
    }
    
    isReadySearchPath(): boolean {
        return this.navigator.path.isReadySearchPath();
    }

    searchedPath(vs: Uint16Array): void {

        this.navigator.searchedPath( vs );
        this.navigator.status = EntityStatus.Moving;
    }
}
export { CarEntity };