/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import Color4 from "../../vox/material/Color4";
import TextureProxy from "../../vox/texture/TextureProxy";
import Box3DMesh from "../../vox/mesh/Box3DMesh";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import IPartStore from "../../app/robot/IPartStore";
import {RoleMaterialBuilder} from "./scene/RoleMaterialBuilder";
import MaterialBase from "../../vox/material/MaterialBase";

export default class BoxPartStore implements IPartStore {
    private m_coreCenterV: Vector3D = new Vector3D(0.0, 105.0, 0.0);
    private m_coreWidth: number = 60.0;
    private m_bgLong: number = -60.0;
    private m_sgLong: number = -50.0;
    private m_bgTopSize: number = 20.0;
    private m_bgBottomSize: number = 10.0;
    private m_sgTopSize: number = 10.0;
    private m_sgBottomSize: number = 15.0;
    private m_bgBox: Box3DEntity = null;
    private m_bgLBox: Box3DEntity = null;
    private m_bgRBox: Box3DEntity = null;
    private m_sgBox: Box3DEntity = null;
    private m_sgLBox: Box3DEntity = null;
    private m_sgRBox: Box3DEntity = null;

    private m_baseColor: Color4 = new Color4();
    private static s_baseBox: Box3DEntity = null;

    private static s_v0: Vector3D = new Vector3D(-10, -10, -10);
    private static s_v1: Vector3D = new Vector3D(10, 10, 10);

    private m_tex0: TextureProxy;
    private m_tex1: TextureProxy;
    private m_tex2: TextureProxy;
    
    materialBuilder: RoleMaterialBuilder;
    constructor() {
        this.m_baseColor.normalizeRandom(1.1);
    }
    
    setParam(coreWidth: number, bgLong: number, sgLong: number): void {
        this.m_coreWidth = coreWidth;
        this.m_bgLong = bgLong;
        this.m_sgLong = sgLong;
    }
    setCoreCenterXYZ(px: number, py: number, pz: number): void {
        this.m_coreCenterV.setXYZ(px, py, pz);
    }
    setCoreCenterY(py: number): void {
        this.m_coreCenterV.y = py;
    }
    setBgSize(topSize: number, bottomSize: number): void {
        this.m_bgTopSize = topSize;
        this.m_bgBottomSize = bottomSize;
    }
    setSgSize(topSize: number, bottomSize: number): void {
        this.m_sgTopSize = topSize;
        this.m_sgBottomSize = bottomSize;
    }
    initilizeCopyFrom(store: BoxPartStore): void {
        if (store != null) {
            this.m_tex0 = store.m_tex0;
            this.m_tex1 = store.m_tex1;
            this.m_tex2 = store.m_tex2;
            this.m_bgBox = store.m_bgBox;
            this.m_sgBox = store.m_sgBox;
            this.m_coreWidth = store.m_coreWidth;
            this.m_bgLong = store.m_bgLong;
            this.m_sgLong = store.m_sgLong;
            this.m_coreCenterV.copyFrom(store.m_coreCenterV);
        }
    }
    initilize(tex0: TextureProxy, tex1: TextureProxy, tex2: TextureProxy): void {
        if (this.m_bgBox == null) {
            this.m_tex0 = tex0;
            this.m_tex1 = tex1;
            this.m_tex2 = tex2;

            let boxBase: Box3DEntity;
            let material: MaterialBase;
            if (BoxPartStore.s_baseBox == null) {
                material = this.materialBuilder.createMaterial( this.m_tex1 );
                boxBase = this.m_bgBox = new Box3DEntity();
                this.m_bgBox.setMaterial( material );
                boxBase.initialize(BoxPartStore.s_v0, BoxPartStore.s_v1, [this.m_tex1]);
                BoxPartStore.s_baseBox = boxBase;
            }
            boxBase = BoxPartStore.s_baseBox;


            let bgMesh: Box3DMesh = new Box3DMesh();
            bgMesh.setBufSortFormat(boxBase.getMaterial().getBufSortFormat());
            bgMesh.initializeWithYFace(
                new Vector3D(-this.m_bgBottomSize, this.getBGLong(), -this.m_bgBottomSize),
                new Vector3D(this.m_bgBottomSize, this.getBGLong(), this.m_bgBottomSize),
                new Vector3D(-this.m_bgTopSize, 0.0, -this.m_bgTopSize),
                new Vector3D(this.m_bgTopSize, 0.0, this.m_bgTopSize)
            );


            let sgMesh: Box3DMesh = new Box3DMesh();
            sgMesh.setBufSortFormat(boxBase.getMaterial().getBufSortFormat());
            sgMesh.initializeWithYFace(
                new Vector3D(-this.m_sgBottomSize, this.getBGLong(), -this.m_sgBottomSize),
                new Vector3D(this.m_sgBottomSize, this.getBGLong(), this.m_sgBottomSize),
                new Vector3D(-this.m_sgTopSize, 0.0, -this.m_sgTopSize),
                new Vector3D(this.m_sgTopSize, 0.0, this.m_sgTopSize)
                //  new Vector3D(-15.0,this.getSGLong(),-15.0), new Vector3D(15.0,this.getSGLong(),15.0),
                //  new Vector3D(-10.0,0.0,-10.0), new Vector3D(10.0,0.0,10.0)
            );

            this.m_bgBox = new Box3DEntity();
            material = this.materialBuilder.createMaterial( this.m_tex1 );
            this.m_bgBox.setMaterial( material );
            this.m_bgBox.setMesh(bgMesh);
            this.m_bgBox.initialize(new Vector3D(-15.0, this.getBGLong(), -15.0), new Vector3D(15.0, 0.0, 15.0), [this.m_tex1]);
            this.updateBoxUV(this.m_bgBox);

            this.m_sgBox = new Box3DEntity();
            material = this.materialBuilder.createMaterial( this.m_tex1 );
            this.m_sgBox.setMaterial( material );
            this.m_sgBox.setMesh(sgMesh);
            this.m_sgBox.initialize(new Vector3D(-10.0, this.getSGLong(), -10.0), new Vector3D(10.0, 0.0, 10.0), [this.m_tex1]);
            this.updateBoxUV(this.m_sgBox);
        }
    }
    getCoreWidth(): number {
        return this.m_coreWidth;
    }
    getBGLong(): number {
        return this.m_bgLong;
    }
    getSGLong(): number {
        return this.m_sgLong;
    }
    getCoreCenter(): Vector3D {
        return this.m_coreCenterV;
    }
    getEngityCore(): DisplayEntity {
        let coreEntity: Axis3DEntity = new Axis3DEntity();
        //coreEntity.initializeCross(this.getCoreWidth());
        coreEntity.initializeCorssSizeXYZ(20, this.getCoreWidth(), this.getCoreWidth());
        //coreEntity.initialize(this.getCoreWidth());
        coreEntity.setPosition(this.getCoreCenter());
        return coreEntity;
    }
    getEngityBGL(): DisplayEntity {
        if (this.m_bgLBox == null) {
            this.m_bgLBox = new Box3DEntity();            
            let material = this.materialBuilder.createMaterial( this.m_tex1 );
            this.m_bgLBox.setMaterial( material );
            this.m_bgLBox.copyMeshFrom(this.m_bgBox);
            this.m_bgLBox.initialize(BoxPartStore.s_v0, BoxPartStore.s_v1, [this.m_tex1]);
            (this.m_bgLBox.getMaterial() as any).setRGB3f(this.m_baseColor.r, this.m_baseColor.g, this.m_baseColor.b);
        }
        return this.m_bgLBox;
    }
    getEngityBGR(): DisplayEntity {
        if (this.m_bgRBox == null) {
            this.m_bgRBox = new Box3DEntity();
            let material = this.materialBuilder.createMaterial( this.m_tex1 );
            this.m_bgRBox.setMaterial( material );
            this.m_bgRBox.copyMeshFrom(this.m_bgBox);
            this.m_bgRBox.initialize(BoxPartStore.s_v0, BoxPartStore.s_v1, [this.m_tex1]);
            (this.m_bgRBox.getMaterial() as any).setRGB3f(this.m_baseColor.r, this.m_baseColor.g, this.m_baseColor.b);
        }
        return this.m_bgRBox;
    }
    getEngitySGL(): DisplayEntity {
        if (this.m_sgLBox == null) {
            this.m_sgLBox = new Box3DEntity();
            let material = this.materialBuilder.createMaterial( this.m_tex1 );
            this.m_sgLBox.setMaterial( material );
            this.m_sgLBox.copyMeshFrom(this.m_sgBox);
            this.m_sgLBox.initialize(BoxPartStore.s_v0, BoxPartStore.s_v1, [this.m_tex1]);
            (this.m_sgLBox.getMaterial() as any).setRGB3f(this.m_baseColor.r, this.m_baseColor.g, this.m_baseColor.b);
        }
        return this.m_sgLBox;
    }
    getEngitySGR(): DisplayEntity {
        if (this.m_sgRBox == null) {
            this.m_sgRBox = new Box3DEntity();
            let material = this.materialBuilder.createMaterial( this.m_tex1 );
            this.m_sgRBox.setMaterial( material );
            this.m_sgRBox.copyMeshFrom(this.m_sgBox);
            this.m_sgRBox.initialize(BoxPartStore.s_v0, BoxPartStore.s_v1, [this.m_tex1]);
            (this.m_sgRBox.getMaterial() as any).setRGB3f(this.m_baseColor.r, this.m_baseColor.g, this.m_baseColor.b);
        }
        return this.m_sgRBox;
    }
    private updateBoxUV(box: Box3DEntity): void {
        box.scaleUVFaceAt(0, 0.5, 0.5, 0.5, 0.5);
        box.scaleUVFaceAt(1, 0.0, 0.0, 0.5, 0.5);
        box.scaleUVFaceAt(2, 0.5, 0.0, 0.5, 0.5);
        box.scaleUVFaceAt(3, 0.0, 0.5, 0.5, 0.5);
        box.scaleUVFaceAt(4, 0.5, 0.0, 0.5, 0.5);
        box.scaleUVFaceAt(5, 0.0, 0.5, 0.5, 0.5);
        box.reinitializeMesh();
    }
    destroy(): void {
        this.materialBuilder = null;
    }
}