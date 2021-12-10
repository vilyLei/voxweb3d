/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// ThreadTask example

import Vector3D from "../../../../vox/math/Vector3D";
import IThreadSendData from "../../../../thread/base/IThreadSendData";
import ThreadTask from "../../../../thread/control/ThreadTask";
import Matrix4 from "../../../../vox/math/Matrix4";
import PureEntity from "../../../../vox/entity/PureEntity";
import IRenderer from "../../../../vox/scene/IRenderer";

import TextureProxy from "../../../../vox/texture/TextureProxy";
import Box3DEntity from "../../../../vox/entity/Box3DEntity";
import ThreadSystem from "../../../../thread/ThreadSystem";
import {ToyCarSendData} from "./ToyCarSendData";
import {TransData} from "./TransData";

class ToyCarTask extends ThreadTask {
    private m_matIndex: number = 0;
    private m_tarTotal: number = 0;
    private m_currMatTotal: number = 1;
    private m_fs32Arr: Float32Array = null;
    private m_dstMFSList: Matrix4[] = null;
    private m_dstMFSTotal: number = 0;
    private m_enabled: boolean = true;

    private m_dispList: PureEntity[] = null;
    private m_dispListLen: number = 0;
    private m_dataList: TransData[] = null;
    private m_dataListLen: number = 0;
    private m_flag: number = 0;
    constructor() {
        super();
    }
    private m_srcBox0: Box3DEntity = null;
    private m_srcBox1: Box3DEntity = null;
    private m_texnsList: string[] = [
        "fruit_01.jpg"
        , "moss_05.jpg"
        , "metal_02.jpg"
        , "fruit_01.jpg"
        , "moss_05.jpg"
        , "metal_02.jpg"
    ];
    getImageTexByUrlFunc: Function = null;
    getImageTexByUrlHost: any = null;
    buildTask(total: number, sc: IRenderer): void {
        let texnsI = Math.floor(this.m_texnsList.length * 10 * Math.random() - 0.1) % this.m_texnsList.length;

        let tex0: TextureProxy = this.getImageTexByUrlFunc.call(this.getImageTexByUrlHost, "static/assets/" + this.m_texnsList[texnsI]);
        let matTask: ToyCarTask = this;
        matTask.initialize(total);

        if (this.m_srcBox0 == null) {
            this.m_srcBox0 = new Box3DEntity();
            this.m_srcBox0.initialize(new Vector3D(-100.0, -50.0, -100.0), new Vector3D(100.0, 50.0, 100.0), [tex0]);
        }
        if (this.m_srcBox1 == null) {
            this.m_srcBox1 = new Box3DEntity();
            this.m_srcBox1.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex0]);
        }
        let materialBox0: Box3DEntity = new Box3DEntity();
        materialBox0.copyMeshFrom(this.m_srcBox0);
        materialBox0.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex0]);
        let material0: any = materialBox0.getMaterial();
        material0.setRGB3f(Math.random() + 0.4, Math.random() + 0.4, Math.random() + 0.4);

        texnsI = Math.floor(this.m_texnsList.length * 10 * Math.random() - 0.1) % this.m_texnsList.length;

        let tex1: TextureProxy = this.getImageTexByUrlFunc.call(this.getImageTexByUrlHost, "static/assets/" + this.m_texnsList[texnsI]);
        let materialBox1: Box3DEntity = new Box3DEntity();
        materialBox1.copyMeshFrom(this.m_srcBox0);
        materialBox1.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
        let material1: any = materialBox1.getMaterial();
        material1.setRGB3f(Math.random() + 0.4, Math.random() + 0.4, Math.random() + 0.4);

        total = this.setCurrTotal(total);

        let i: number = 0;
        ///*
        let box: PureEntity;
        console.log("create some concurrent render entities, total: " + total);
        matTask.setIndex(0);
        let k: number = 0;
        let j: number = 0;
        for (; i < total; ++i) {
            // 每个实体有5部分构成(四个轮子一个body)
            k = i * 5;
            //matTask.setIndex( i * 15 );
            box = new PureEntity();
            box.copyMeshFrom(this.m_srcBox0);
            box.copyMaterialFrom(materialBox0);
            sc.addEntity(box, 0, true);
            matTask.setDispAt(box, k);
            for (j = 1; j < 5; j++) {
                box = new PureEntity();
                box.copyMeshFrom(this.m_srcBox1);
                box.copyMaterialFrom(materialBox1);
                sc.addEntity(box, 0, true);
                matTask.setDispAt(box, k + j);
            }

            //scale = Math.random() * 0.1 + 0.05;
            //matTask.setEntityPosXYZ(0.0,0.0,0.0);
            // 整体位置世界空间坐标
            // matTask.setEntityPosXYZ(
            //     Math.random() * 400 - 200.0
            //     , 50//Math.random() * 400 - 200.0
            //     , Math.random() * 400 - 200.0
            // );
            matTask.setEntityPosXYZ( 200, 50, 200 );
            matTask.setEntityRotationXYZ(0.0, Math.random() * 360.0, 0.0);
            // whole body scale, param 1, param 2
            matTask.setParam(0.2, 0.5, 0.5);
            // 轮子的位置偏移值
            matTask.setWheelOffsetXYZ(80.0, -30.0, 100.0);
            // wheel init rotation, spd, wheel body scale;
            matTask.setWheelRotSpeed(30.0, Math.random() * 1.0 + 1.0, 0.3);
        }
        //*/
    }
    initialize(dispTotal: number): void {
        if (this.m_tarTotal < 1 && this.m_fs32Arr == null && dispTotal > 0) {
            console.log("### ToyCarTask::initialize()...");
            this.m_tarTotal = dispTotal;
            this.m_fs32Arr = new Float32Array(dispTotal * 16 * 5);
            //  this.m_dstMFSList = new Array(matTotal);
            //  this.m_dataList = new Array(matTotal);
            ///////////////////////////////////////////////////////////////////
            this.m_dispList = new Array(dispTotal * 5);
        }
    }
    getTotal(): number {
        return this.m_tarTotal;
    }
    setMatAt(mat: Matrix4, index: number): void {
        //  let pdata:TransData = new TransData();
        //  pdata.matTask = this;
        //  pdata.initialize();
        //  this.m_dataList[index] = pdata;
        //  this.m_dstMFSList[index] = mat;
        //  this.m_dstMFSTotal++;
    }

    setDispAt(disp: PureEntity, index: number): void {
        this.m_dispList[index] = disp;
        this.m_dispListLen++;
        //console.log("this.m_dispListLen: "+this.m_dispListLen);
    }

    updateParam(): void {
        for (let i: number = 0; i < this.m_dstMFSTotal; ++i) {
            this.m_dataList[i].update();
        }
    }
    updateAndSendParam(): void {
        if (this.isSendEnabled()) {
            if (this.m_dispListLen > 0) {
                this.sendData();
            }
        }
    }
    isSendEnabled(): boolean {
        return this.m_enabled;
    }
    isDataEnabled(): boolean {
        return this.m_enabled;
    }
    setCurrTotal(currMatTotal: number): number {
        currMatTotal = currMatTotal < 1 ? 1 : currMatTotal;
        currMatTotal = currMatTotal > this.m_tarTotal ? this.m_tarTotal : currMatTotal;
        this.m_currMatTotal = currMatTotal;
        return currMatTotal;
    }
    private setIndex(index: number): void {
        this.m_matIndex = index;
    }

    setEntityPosXYZ(px: number, py: number, pz: number): void {
        this.m_fs32Arr[this.m_matIndex++] = px;
        this.m_fs32Arr[this.m_matIndex++] = py;
        this.m_fs32Arr[this.m_matIndex++] = pz;
    }
    setEntityRotationXYZ(prx: number, pry: number, prz: number): void {
        this.m_fs32Arr[this.m_matIndex++] = prx;
        this.m_fs32Arr[this.m_matIndex++] = pry;
        this.m_fs32Arr[this.m_matIndex++] = prz;
    }
    setParam(bodyScale: number, pry: number, prz: number): void {
        this.m_fs32Arr[this.m_matIndex++] = bodyScale;
        this.m_fs32Arr[this.m_matIndex++] = pry;
        this.m_fs32Arr[this.m_matIndex++] = prz;
    }
    setWheelOffsetXYZ(psx: number, psy: number, psz: number): void {
        this.m_fs32Arr[this.m_matIndex++] = psx;
        this.m_fs32Arr[this.m_matIndex++] = psy;
        this.m_fs32Arr[this.m_matIndex++] = psz;
    }
    // wheel init rotation, spd, wheel body scale;
    setWheelRotSpeed(prx: number, pry: number, prz: number): void {
        this.m_fs32Arr[this.m_matIndex++] = prx;
        this.m_fs32Arr[this.m_matIndex++] = pry;
        this.m_fs32Arr[this.m_matIndex++] = prz;
    }
    //
    sendData(): void {
        if (this.m_enabled) {
            let sd: ToyCarSendData = ToyCarSendData.Create();
            sd.taskCmd = "car_trans";
            sd.paramData = this.m_fs32Arr;
            sd.allTot = this.m_tarTotal;
            sd.matTotal = this.m_currMatTotal;
            sd.flag = this.m_flag;
            sd.calcType = 1;
            this.addData(sd);
            ThreadSystem.AddData(sd);
            this.m_enabled = false;
            this.m_flag = 1;
            //console.log("sendData success...uid: "+this.getUid());
        }
        else {
            console.log("sendData failure...");
        }
    }
    private updateTrans(fs32: Float32Array, ): void {

        for (let i: number = 0; i < this.m_dispListLen; ++i) {
            this.m_dispList[i].getMatrix().copyFromF32Arr(fs32, i * 16);
        }
    }
    // return true, task finish; return false, task continue...
    parseDone(data: any, flag: number): boolean {
        
        this.m_fs32Arr = (data.paramData);
        ToyCarSendData.RestoreByUid(data.dataIndex);

        switch(data.taskCmd) {
            case "car_trans":
                this.updateTrans( this.m_fs32Arr );
                break;
            case "aStar_nav":
                break;
            default:

                break;
        }
        this.m_enabled = true;
        return true;
    }
    getWorkerSendDataAt(i: number): IThreadSendData {
        return null;
    }
    destroy(): void {
        if (this.getUid() > 0) {
            super.destroy();
        }
    }

    getTaskClass(): number {
        return 0;
    }
}
export { ToyCarSendData, ToyCarTask };