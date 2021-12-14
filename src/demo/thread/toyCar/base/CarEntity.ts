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
import {IToyEntity} from "./IToyEntity";
import {TerrainPathStatus, TerrainPath} from "../terrain/TerrainPath";

class CarEntity implements IToyEntity{

    private m_entityIndex: number = 0;
    private m_fs32Length: number = 15;
    private m_fs32Data: Float32Array = null;
    private m_entityList: PureEntity[] = [];
    private m_transMat4List: Matrix4[] = [];
    private m_position: Vector3D = new Vector3D();
    
    private static s_srcBox0: Box3DEntity = null;
    private static s_srcBox1: Box3DEntity = null;

    asset: AssetPackage = null;
    readonly path: TerrainPath = new TerrainPath();
    constructor() {
    }

    // setPositionXYZ(px: number, py: number, pz: number): void {
    //     this.m_position.setXYZ(px, py, pz);
    // }
    // setPosition(pos: Vector3D): void {
    //     this.m_position.copyFrom(pos);
    // }
    getEneityIndex(): number {
        return this.m_entityIndex;
    }
    setFS32Data(srcFS32: Float32Array, index: number): void {
        this.m_entityIndex = index;
        this.m_fs32Data = srcFS32.subarray(index * this.m_fs32Length, (index + 1) * this.m_fs32Length);
    }
    build(sc: RendererScene): void {

        let tex0: TextureProxy = this.asset.textures[0];
        
        if (CarEntity.s_srcBox0 == null) {
            CarEntity.s_srcBox0 = new Box3DEntity();
            CarEntity.s_srcBox0.initialize(new Vector3D(-100.0, -50.0, -100.0), new Vector3D(100.0, 50.0, 100.0), [tex0]);
        }
        if (CarEntity.s_srcBox1 == null) {
            CarEntity.s_srcBox1 = new Box3DEntity();
            CarEntity.s_srcBox1.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex0]);
        }
        let srcBox0 = CarEntity.s_srcBox0;
        let srcBox1 = CarEntity.s_srcBox1;

        let materialBox0: Box3DEntity = new Box3DEntity();
        materialBox0.copyMeshFrom( srcBox0 );
        materialBox0.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex0]);
        let material0: any = materialBox0.getMaterial();
        material0.setRGB3f(Math.random() + 0.4, Math.random() + 0.4, Math.random() + 0.4);

        let tex1: TextureProxy = this.asset.textures[1];
        let materialBox1: Box3DEntity = new Box3DEntity();
        materialBox1.copyMeshFrom(srcBox0);
        materialBox1.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
        let material1: any = materialBox1.getMaterial();
        material1.setRGB3f(Math.random() + 0.4, Math.random() + 0.4, Math.random() + 0.4);

        let box: PureEntity;
        box = new PureEntity();
        box.copyMeshFrom(srcBox0);
        box.copyMaterialFrom(materialBox0);
        sc.addEntity(box);
        this.m_entityList.push(box);
        this.m_transMat4List.push( box.getMatrix() );
        for (let j: number = 1; j < 5; j++) {
            box = new PureEntity();
            box.copyMeshFrom(srcBox1);
            box.copyMaterialFrom(materialBox1);
            sc.addEntity(box);
            this.m_transMat4List.push( box.getMatrix() );
        }
        // for test
        //this.setPosXYZ( 200, 50, 200 );
        this.setPosXYZ( 200, 50, 200 );
        this.setRotationXYZ(0.0, Math.random() * 360.0, 0.0);
        // whole body scale, param 1, param 2
        this.setParam(0.2, 0.5, 0.5);
        // 轮子的位置偏移值
        this.setWheelOffsetXYZ(80.0, -30.0, 100.0);
        // wheel init rotation, spd, wheel body scale;
        this.setWheelRotSpeed(30.0, Math.random() * 1.0 + 1.0, 0.3);
    }
    
    setPosXYZ(px: number, py: number, pz: number): void {
        this.m_fs32Data[0] = px;
        this.m_fs32Data[1] = py;
        this.m_fs32Data[2] = pz;
    }
    setRotationXYZ(prx: number, pry: number, prz: number): void {
        this.m_fs32Data[3] = prx;
        this.m_fs32Data[4] = pry;
        this.m_fs32Data[5] = prz;
    }
    setParam(bodyScale: number, param1: number, param2: number): void {
        this.m_fs32Data[6] = bodyScale;
        this.m_fs32Data[7] = param1;
        this.m_fs32Data[8] = param2;
    }
    setWheelOffsetXYZ(px: number, py: number, pz: number): void {
        this.m_fs32Data[9] = px;
        this.m_fs32Data[10] = py;
        this.m_fs32Data[11] = pz;
    }
    // wheel init rotation, spd, wheel body scale;
    setWheelRotSpeed(pr: number, wheelRotSpd: number, bodyScale: number): void {
        this.m_fs32Data[12] = pr;
        this.m_fs32Data[13] = wheelRotSpd;
        this.m_fs32Data[14] = bodyScale;
    }
    destroy(): void {
    }
    searchedPath(vs: Uint16Array): void {
        console.log("searchedPath,vs: ", vs);
        this.path.searchedPath();
    }
    updateTrans(fs32: Float32Array): void {
        
        let index = this.m_entityIndex * 5;
        for (let i: number = 0; i < 5; ++i) {
            this.m_transMat4List[i].copyFromF32Arr(fs32, index * 16);
            ++index;
        }
    }
    run(): void {
        
    }
}
export { CarEntity };