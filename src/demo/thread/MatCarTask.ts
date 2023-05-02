/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// ThreadTask example

import Vector3D from "../../vox/math/Vector3D";
import {StreamType, IThreadSendData} from "../../thread/base/IThreadSendData";
import ThreadTask from "../../thread/control/ThreadTask";
import Matrix4 from "../../vox/math/Matrix4";
import PureEntity from "../../vox/entity/PureEntity";
import IRenderer from "../../vox/scene/IRenderer";

import TextureProxy from "../../vox/texture/TextureProxy";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import ThreadSystem from "../../thread/ThreadSystem";

class MatCarSendData implements IThreadSendData {
    constructor() {
        console.log("MatCarSendData::constructor().");
    }

    // flag: number = 0;
    // calcType: number = 1;
    // allTot: number = 16;
    // matTotal: number = 0;
    paramData: Float32Array = null;

    // 多线程任务分类id
    taskclass: number = -1;
    // 多线程任务实例id
    srcuid: number = -1;
    // IThreadSendData数据对象在自身队列中的序号
    dataIndex: number = -1;
    /**
     * 会发送到子线程的数据描述对象, for example: {flag : 0, type: 12, name: "First"}
     */
    descriptor: any;
    // thread task 任务命令名
    taskCmd: string;
    /**
     * 直接传递内存句柄所有权的数据流对象数组
     */
    streams: StreamType[];
    /**
     * sendStatus   值为 -1 表示没有加入数据池等待处理
     *              值为 0 表示已经加入数据池正等待处理
     *              值为 1 表示已经发送给worker
     */
    sendStatus: number = -1;
    // 按照实际需求构建自己的数据(sendData和transfers等)
    buildThis(transferEnabled: boolean): void {
        
        //console.log("transferEnabled: "+transferEnabled);
        if (transferEnabled && this.paramData != null) {
            this.streams = [this.paramData];
        }
        //this.paramData = null;
    }

    reset(): void {
        this.streams = null;
        this.sendStatus = -1;
    }

    private static s_FLAG_BUSY: number = 1;
    private static s_FLAG_FREE: number = 0;
    private static m_unitFlagList: number[] = [];
    private static m_unitListLen: number = 0;
    private static m_unitList: MatCarSendData[] = [];
    private static m_freeIdList: number[] = [];
    private static GetFreeId(): number {
        if (MatCarSendData.m_freeIdList.length > 0) {
            return MatCarSendData.m_freeIdList.pop();
        }
        return -1;
    }
    static Create(): MatCarSendData {
        let sd: MatCarSendData = null;
        let index: number = MatCarSendData.GetFreeId();
        //console.log("index: "+index);
        //console.log("MatCarSendData::Create(), MatCarSendData.m_unitList.length: "+MatCarSendData.m_unitList.length);
        if (index >= 0) {
            sd = MatCarSendData.m_unitList[index];
            sd.dataIndex = index;
            MatCarSendData.m_unitFlagList[index] = MatCarSendData.s_FLAG_BUSY;
        }
        else {
            sd = new MatCarSendData();
            MatCarSendData.m_unitList.push(sd);
            MatCarSendData.m_unitFlagList.push(MatCarSendData.s_FLAG_BUSY);
            sd.dataIndex = MatCarSendData.m_unitListLen;
            MatCarSendData.m_unitListLen++;
        }
        return sd;
    }

    static Restore(psd: MatCarSendData): void {
        if (psd != null && MatCarSendData.m_unitFlagList[psd.dataIndex] == MatCarSendData.s_FLAG_BUSY) {
            let uid: number = psd.dataIndex;
            MatCarSendData.m_freeIdList.push(uid);
            MatCarSendData.m_unitFlagList[uid] = MatCarSendData.s_FLAG_FREE;
            psd.reset();
        }
    }
    static RestoreByUid(uid: number): void {
        if (uid >= 0 && MatCarSendData.m_unitFlagList[uid] == MatCarSendData.s_FLAG_BUSY) {
            MatCarSendData.m_freeIdList.push(uid);
            MatCarSendData.m_unitFlagList[uid] = MatCarSendData.s_FLAG_FREE;
            MatCarSendData.m_unitList[uid].reset();
        }
    }
}

class TransData {
    sx: number = 0.06;
    sy: number = 0.06;
    sz: number = 0.06;
    //
    rx: number = 0;
    ry: number = 0;
    rz: number = 0;
    //
    x: number = 0;
    y: number = 0;
    z: number = 0;
    //
    spd_rx: number = 0;
    spd_ry: number = 1.0;
    spd_rz: number = 0;
    //
    matTask: MatCarTask = null;
    constructor() {
    }

    initialize(): void {
        this.x = Math.random() * 600.0 - 300.0;
        //this.y = Math.random() * 10.0;
        this.z = Math.random() * 600.0 - 300.0;

        this.ry = Math.random() * 360.0;
        this.spd_rx = Math.random() * 2.0 - 1.0;
        this.spd_ry = Math.random() * 2.0 - 1.0;
        this.spd_rz = Math.random() * 2.0 - 1.0;
    }
    update(): void {
        this.rx += this.spd_rx;
        this.ry += this.spd_ry;
        this.rz += this.spd_rz;

    }
}
class MatCarTask extends ThreadTask {
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
        let matTask: MatCarTask = this;
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
            matTask.setEntityPosXYZ(
                Math.random() * 400 - 200.0
                , 50//Math.random() * 400 - 200.0
                , Math.random() * 400 - 200.0
            );
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
            console.log("### MatCarTask::initialize()...");
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
            let sd: MatCarSendData = MatCarSendData.Create();
            sd.taskCmd = "car_trans";
            sd.paramData = this.m_fs32Arr;
            sd.descriptor = {};
            sd.descriptor.allTot = this.m_tarTotal;
            sd.descriptor.matTotal = this.m_currMatTotal;
            sd.descriptor.flag = this.m_flag;
            sd.descriptor.calcType = 1;
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

    // return true, task finish; return false, task continue...
    parseDone(data: any, flag: number): boolean {
        //console.log("MatCarTask::parseDone(), data: ",data);
        //      //console.log("parseDone(), srcuid: "+data.srcuid+","+this.getUid());
        this.m_fs32Arr = (data.streams[0]);
        //      //this.m_dstMFSList[0].copyFromF32Arr(this.m_fs32Arr,0);
        //      let list:Matrix4[] = this.m_dstMFSList;
        //      //console.log("data.matTotal: "+data.matTotal);
        //      for(let i:number=0,len:number=data.matTotal;i < len;++i)
        //      {
        //          list[i].copyFromF32Arr(this.m_fs32Arr,i * 16);
        //          //console.log("list["+i+"]: \n"+list[i].toString());
        //      }
        MatCarSendData.RestoreByUid(data.dataIndex);
        //console.log("this.m_dispListLen: "+this.m_dispListLen);
        for (let i: number = 0; i < this.m_dispListLen; ++i) {
            this.m_dispList[i].getMatrix().copyFromF32Arr(this.m_fs32Arr, i * 16);
            //this.m_dispList[i].getMatrix().copyFromF32Arr(fs32, i * 16);
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
export { MatCarSendData, MatCarTask };