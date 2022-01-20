/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
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

class MatTransSendData implements IThreadSendData {
    constructor() {
        console.log("MatTransSendData::constructor().");
    }

    paramData: Float32Array = null;

    /**
     * 会发送到子线程的数据描述对象, for example: {flag : 0, type: 12, name: "First"}
     */
    descriptor: any;
    // 多线程任务分类id
    taskclass: number = -1;
    // 多线程任务实例id
    srcuid: number = -1;
    // IThreadSendData数据对象在自身队列中的序号
    dataIndex: number = -1;
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
    private static m_unitList: MatTransSendData[] = [];
    private static m_freeIdList: number[] = [];
    private static GetFreeId(): number {
        if (MatTransSendData.m_freeIdList.length > 0) {
            return MatTransSendData.m_freeIdList.pop();
        }
        return -1;
    }
    static Create(): MatTransSendData {
        let sd: MatTransSendData = null;
        let index: number = MatTransSendData.GetFreeId();
        //console.log("index: "+index);
        //console.log("MatTransSendData::Create(), MatTransSendData.m_unitList.length: "+MatTransSendData.m_unitList.length);
        if (index >= 0) {
            sd = MatTransSendData.m_unitList[index];
            sd.dataIndex = index;
            MatTransSendData.m_unitFlagList[index] = MatTransSendData.s_FLAG_BUSY;
        }
        else {
            sd = new MatTransSendData();
            MatTransSendData.m_unitList.push(sd);
            MatTransSendData.m_unitFlagList.push(MatTransSendData.s_FLAG_BUSY);
            sd.dataIndex = MatTransSendData.m_unitListLen;
            MatTransSendData.m_unitListLen++;
        }
        return sd;
    }

    static Restore(psd: MatTransSendData): void {
        if (psd != null && MatTransSendData.m_unitFlagList[psd.dataIndex] == MatTransSendData.s_FLAG_BUSY) {
            let uid: number = psd.dataIndex;
            MatTransSendData.m_freeIdList.push(uid);
            MatTransSendData.m_unitFlagList[uid] = MatTransSendData.s_FLAG_FREE;
            psd.reset();
        }
    }
    static RestoreByUid(uid: number): void {
        if (uid >= 0 && MatTransSendData.m_unitFlagList[uid] == MatTransSendData.s_FLAG_BUSY) {
            MatTransSendData.m_freeIdList.push(uid);
            MatTransSendData.m_unitFlagList[uid] = MatTransSendData.s_FLAG_FREE;
            MatTransSendData.m_unitList[uid].reset();
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
    matTask: MatTransTask = null;
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
class MatTransTask extends ThreadTask {
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
    private m_srcBox: Box3DEntity = null;
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

        let tex1: TextureProxy = this.getImageTexByUrlFunc.call(this.getImageTexByUrlHost, "static/assets/" + this.m_texnsList[texnsI]);
        let matTask: MatTransTask = this;
        matTask.initialize(total);

        let materialBox: Box3DEntity = new Box3DEntity();
        materialBox.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
        let material: any = materialBox.getMaterial();
        material.setRGB3f(Math.random() + 0.4, Math.random() + 0.4, Math.random() + 0.4);
        //metal_08.jpg
        if (this.m_srcBox == null) {
            this.m_srcBox = new Box3DEntity();
            this.m_srcBox.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
        }
        total = this.setCurrTotal(total);

        let i: number = 0;
        ///*
        let box: PureEntity;
        console.log("create some concurrent render entities, total: " + total);
        matTask.setIndex(0);
        let px: number = 0;
        let scale: number = 0.1;
        for (; i < total; ++i) {
            box = new PureEntity();
            box.copyMeshFrom(this.m_srcBox);
            box.copyMaterialFrom(materialBox);

            sc.addEntity(box, 0, true);
            matTask.setDispAt(box, i * 2);

            box = new PureEntity();
            box.copyMeshFrom(this.m_srcBox);
            box.copyMaterialFrom(materialBox);
            //matTask.setMatAt(box.getMatrix(),i * 2 + 1);
            sc.addEntity(box, 0, true);
            matTask.setDispAt(box, i * 2 + 1);
            scale = Math.random() * 0.1 + 0.05;
            matTask.setScaleXYZ(scale, scale, scale);
            matTask.setRotationXYZ(0.0, Math.random() * 360.0, 0.0);
            //matTask.setPositionXYZ(px + i * 50.0,i * 0.5,i * 0.2);
            matTask.setPositionXYZ(
                Math.random() * 400 - 200.0
                , Math.random() * 400 - 200.0
                , Math.random() * 400 - 200.0
            );
        }
        //*/
    }
    initialize(dispTotal: number): void {
        if (this.m_tarTotal < 1 && this.m_fs32Arr == null && dispTotal > 0) {
            console.log("### MatTransTask::initialize()...");
            this.m_tarTotal = dispTotal;
            this.m_fs32Arr = new Float32Array(dispTotal * 16 * 2);
            this.m_dispList = new Array(dispTotal * 2);
        }
    }
    getTotal(): number {
        return this.m_tarTotal;
    }
    setMatAt(mat: Matrix4, index: number): void {
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
        return this.m_enabled;//this.m_fs32Arr != null;
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
    setIndex(index: number): void {
        this.m_matIndex = index * 9;
    }

    setScaleXYZ(psx: number, psy: number, psz: number): void {
        this.m_fs32Arr[this.m_matIndex++] = psx;
        this.m_fs32Arr[this.m_matIndex++] = psy;
        this.m_fs32Arr[this.m_matIndex++] = psz;
    }
    setRotationXYZ(prx: number, pry: number, prz: number): void {
        this.m_fs32Arr[this.m_matIndex++] = prx;
        this.m_fs32Arr[this.m_matIndex++] = pry;
        this.m_fs32Arr[this.m_matIndex++] = prz;
    }
    setPositionXYZ(px: number, py: number, pz: number): void {
        this.m_fs32Arr[this.m_matIndex++] = px;
        this.m_fs32Arr[this.m_matIndex++] = py;
        this.m_fs32Arr[this.m_matIndex++] = pz;
    }
    sendData(): void {
        if (this.m_enabled) {
            let sd: MatTransSendData = MatTransSendData.Create();
            sd.taskCmd = "MAT_TRANS";
            sd.paramData = this.m_fs32Arr;
            sd.descriptor = {};
            sd.descriptor.allTot = this.m_tarTotal;
            sd.descriptor.matTotal = this.m_currMatTotal;
            sd.descriptor.flag = this.m_flag;
            sd.descriptor.calcType = 0;
            this.addData(sd);
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
        
        this.m_fs32Arr = (data.streams[0]);
        MatTransSendData.RestoreByUid(data.dataIndex);
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
export { MatTransSendData, MatTransTask }