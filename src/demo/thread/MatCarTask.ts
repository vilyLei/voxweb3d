/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// ThreadTask example

import * as Vector3DT from "../../vox/geom/Vector3";
import * as IThreadSendDataT from "../../thread/base/IThreadSendData";
import * as ThreadTaskT from "../../thread/control/ThreadTask";
import * as Matrix4T from "../../vox/geom/Matrix4";
import * as PureEntityT from "../../vox/entity/PureEntity";
import * as IRendererT from "../../vox/scene/IRenderer";

import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as TextureStoreT from "../../vox/texture/TextureStore";
import * as Box3DEntityT from "../../vox/entity/Box3DEntity";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import IThreadSendData = IThreadSendDataT.thread.base.IThreadSendData;
import ThreadTask = ThreadTaskT.thread.control.ThreadTask;
import Matrix4 = Matrix4T.vox.geom.Matrix4;
import PureEntity = PureEntityT.vox.entity.PureEntity;
import IRenderer = IRendererT.vox.scene.IRenderer;

import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureStore = TextureStoreT.vox.texture.TextureStore;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;

export namespace demo
{
    export namespace thread
    {
        export class MatCarSendData implements IThreadSendData
        {
            constructor()
            {
                console.log("MatCarSendData::constructor().");
            }

            flag:number = 0;
            calcType:number = 1;
            allTot:number = 16;
            matTotal:number = 0;
            paramData:Float32Array = null;

            // 多线程任务分类id
            taskclass:number = -1;
            // 多线程任务实例id
            srcuid:number = -1;
            // IThreadSendData数据对象在自身队列中的序号
            dataIndex:number = -1;
            // 发送给thread处理的数据对象
            sendData:any = null;
            // thread task 任务命令名
            taskCmd:string;
            //
            transfers:any[] = null;
            // sendStatus 值为 -1 表示没有加入数据池等待处理
            //            值为 0 表示已经加入数据池正等待处理
            //            值为 1 表示已经发送给worker
            sendStatus:number = -1;
            // 按照实际需求构建自己的数据(sendData和transfers等)
            buildThis(transferEnabled:boolean):void
            {
                if(this.sendData != null)
                {
                    this.sendData.taskclass = this.taskclass;
                    this.sendData.srcuid = this.srcuid;
                    this.sendData.dataIndex = this.dataIndex;
                    this.sendData.flag = this.flag;
                    this.sendData.calcType = this.calcType;
                    this.sendData.allTot = this.allTot;
                    this.sendData.matTotal = this.matTotal;
                    this.sendData.paramData = this.paramData;
                }
                else
                {
                    this.sendData = {
                        taskCmd:this.taskCmd
                        ,taskclass:this.taskclass
                        ,srcuid:this.srcuid
                        ,dataIndex:this.dataIndex
                        ,flag:this.flag
                        ,calcType:this.calcType
                        ,allTot:this.allTot
                        ,matTotal:this.matTotal
                        ,paramData:this.paramData
                    }
                }
                //console.log("transferEnabled: "+transferEnabled);
                if(transferEnabled && this.paramData != null)
                {
                    this.transfers = [this.paramData.buffer];
                }
                //this.paramData = null;
            }
            
            reset():void
            {
                this.transfers = null;
                if(this.sendData != null)
                {
                    this.sendData.paramData = null
                }
                this.matTotal = 0;
                this.sendStatus = -1;
            }
            
            private static __S_FLAG_BUSY:number = 1;
            private static __S_FLAG_FREE:number = 0;
            private static m_unitFlagList:number[] = [];
            private static m_unitIndexPptFlagList:number[] = [];
            private static m_unitListLen:number = 0;
            private static m_unitList:MatCarSendData[] = [];
            private static m_freeIdList:number[] = [];
            private static GetFreeId():number
            {
                if(MatCarSendData.m_freeIdList.length > 0)
                {
                    return MatCarSendData.m_freeIdList.pop();
                }
                return -1;
            }
            static Create():MatCarSendData
            {
                let sd:MatCarSendData = null;
                let index:number = MatCarSendData.GetFreeId();
                //console.log("index: "+index);
                //console.log("MatCarSendData::Create(), MatCarSendData.m_unitList.length: "+MatCarSendData.m_unitList.length);
                if(index >= 0)
                {
                    sd = MatCarSendData.m_unitList[index];
                    sd.dataIndex = index;
                    MatCarSendData.m_unitFlagList[index] = MatCarSendData.__S_FLAG_BUSY;
                }
                else
                {
                    sd = new MatCarSendData();
                    MatCarSendData.m_unitList.push( sd );
                    MatCarSendData.m_unitIndexPptFlagList.push(MatCarSendData.__S_FLAG_FREE);
                    MatCarSendData.m_unitFlagList.push(MatCarSendData.__S_FLAG_BUSY);
                    sd.dataIndex = MatCarSendData.m_unitListLen;
                    MatCarSendData.m_unitListLen++;
                }
                return sd;
            }
            
            static Restore(psd:MatCarSendData):void
            {
                if(psd != null && MatCarSendData.m_unitFlagList[psd.dataIndex] == MatCarSendData.__S_FLAG_BUSY)
                {
                    let uid:number = psd.dataIndex;
                    MatCarSendData.m_freeIdList.push(uid);
                    MatCarSendData.m_unitFlagList[uid] = MatCarSendData.__S_FLAG_FREE;
                    psd.reset();
                }
            }
            static RestoreByUid(uid:number):void
            {
                if(uid >= 0 && MatCarSendData.m_unitFlagList[uid] == MatCarSendData.__S_FLAG_BUSY)
                {
                    MatCarSendData.m_freeIdList.push(uid);
                    MatCarSendData.m_unitFlagList[uid] = MatCarSendData.__S_FLAG_FREE;
                    MatCarSendData.m_unitList[uid].reset();
                }
            }
        }
        
        class TransData
        {
            sx:number = 0.06;
            sy:number = 0.06;
            sz:number = 0.06;
            //
            rx:number = 0;
            ry:number = 0;
            rz:number = 0;
            //
            x:number = 0;
            y:number = 0;
            z:number = 0;
            //
            spd_rx:number = 0;
            spd_ry:number = 1.0;
            spd_rz:number = 0;
            //
            matTask:MatCarTask = null;
            constructor()
            {
            }

            initialize():void
            {
                this.x = Math.random() * 600.0 - 300.0;
                //this.y = Math.random() * 10.0;
                this.z = Math.random() * 600.0 - 300.0;

                this.ry = Math.random() * 360.0;
                this.spd_rx = Math.random() * 2.0 - 1.0;
                this.spd_ry = Math.random() * 2.0 - 1.0;
                this.spd_rz = Math.random() * 2.0 - 1.0;            
            }
            update():void
            {
                this.rx += this.spd_rx;
                this.ry += this.spd_ry;
                this.rz += this.spd_rz;

            }
        }
        export class MatCarTask extends ThreadTask
        {
            private m_matIndex:number = 0;
            private m_tarTotal:number = 0;
            private m_currMatTotal:number = 1;
            private m_fs32Arr:Float32Array = null;
            private m_dstMFSList:Matrix4[] = null;
            private m_dstMFSTotal:number = 0;
            private m_enabled:boolean = true;
            
            private m_dispList:PureEntity[] = null;
            private m_dispListLen:number = 0;
            private m_dataList:TransData[] = null;
            private m_dataListLen:number = 0;
            private m_flag:number = 0;
            constructor()
            {
                super();
            }
            private m_srcBox0:Box3DEntity = null;
            private m_srcBox1:Box3DEntity = null;
            private m_texnsList:string[] = [
                "fruit_01.jpg"
                ,"moss_05.jpg"
                ,"metal_02.jpg"
                ,"fruit_01.jpg"
                ,"moss_05.jpg"
                ,"metal_02.jpg"
            ];
            getImageTexByUrlFunc:Function = null;
            getImageTexByUrlHost:any = null;
            buildTask(total:number,sc:IRenderer):void
            {
                let texnsI = Math.floor(this.m_texnsList.length * 10 * Math.random() - 0.1) % this.m_texnsList.length;
                
                let tex0:TextureProxy = this.getImageTexByUrlFunc.call(this.getImageTexByUrlHost,"static/assets/"+this.m_texnsList[texnsI]);
                let matTask:MatCarTask = this;
                matTask.initialize(total);
                
                if(this.m_srcBox0 == null)
                {
                    this.m_srcBox0 = new Box3DEntity();
                    this.m_srcBox0.initialize(new Vector3D(-100.0,-50.0,-100.0),new Vector3D(100.0,50.0,100.0),[tex0]);
                }
                if(this.m_srcBox1 == null)
                {
                    this.m_srcBox1 = new Box3DEntity();
                    this.m_srcBox1.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex0]);
                }
                let materialBox0:Box3DEntity = new Box3DEntity();
                materialBox0.copyMeshFrom(this.m_srcBox0);
                materialBox0.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex0]);
                let material0:any = materialBox0.getMaterial();
                material0.setRGB3f(Math.random() + 0.4,Math.random() + 0.4,Math.random() + 0.4);

                texnsI = Math.floor(this.m_texnsList.length * 10 * Math.random() - 0.1) % this.m_texnsList.length;
                
                let tex1:TextureProxy = this.getImageTexByUrlFunc.call(this.getImageTexByUrlHost,"static/assets/"+this.m_texnsList[texnsI]);
                let materialBox1:Box3DEntity = new Box3DEntity();
                materialBox1.copyMeshFrom(this.m_srcBox0);
                materialBox1.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                let material1:any = materialBox1.getMaterial();
                material1.setRGB3f(Math.random() + 0.4,Math.random() + 0.4,Math.random() + 0.4);

                total = this.setCurrTotal(total);
                
                let i:number = 0;
                ///*
                let box:PureEntity;
                console.log("create some concurrent render entities, total: "+total);
                matTask.setIndex(0);
                let k:number = 0;
                let j:number = 0;
                for(; i < total; ++i)
                {
                    k = i * 5;
                    //matTask.setIndex( i * 15 );
                    box = new PureEntity();
                    box.copyMeshFrom(this.m_srcBox0);
                    box.copyMaterialFrom(materialBox0);
                    sc.addEntity(box,0,true);
                    matTask.setDispAt(box, k);
                    for(j = 1; j < 5; j++)
                    {
                        box = new PureEntity();
                        box.copyMeshFrom(this.m_srcBox1);
                        box.copyMaterialFrom(materialBox1);
                        sc.addEntity(box,0,true);
                        matTask.setDispAt(box, k + j);
                    }

                    //scale = Math.random() * 0.1 + 0.05;
                    //matTask.setPositionXYZ(0.0,0.0,0.0);
                    matTask.setPositionXYZ(
                        Math.random() * 400 - 200.0
                        ,0//Math.random() * 400 - 200.0
                        ,Math.random() * 400 - 200.0
                        );
                    matTask.setRotationXYZ(0.0, Math.random() * 360.0, 0.0);
                    matTask.setParam(0.5,0.5,0.5);
                    matTask.setOffsetXYZ(80.0,-30.0,100.0);
                    matTask.setSpdParam(Math.random() * 360.0, Math.random() * 0.5 + 0.1,0.3);
                }
                //*/
            }
            initialize(dispTotal:number):void
            {
                if(this.m_tarTotal < 1 && this.m_fs32Arr == null && dispTotal > 0)
                {
                    console.log("### MatCarTask::initialize()...");
                    this.m_tarTotal = dispTotal;
                    this.m_fs32Arr = new Float32Array(dispTotal * 16 * 5);
                    //  this.m_dstMFSList = new Array(matTotal);
                    //  this.m_dataList = new Array(matTotal);
                    ///////////////////////////////////////////////////////////////////
                    this.m_dispList = new Array(dispTotal * 5);
                }
            }
            getTotal():number
            {
                return this.m_tarTotal;
            }
            setMatAt(mat:Matrix4,index:number):void
            {
                //  let pdata:TransData = new TransData();
                //  pdata.matTask = this;
                //  pdata.initialize();
                //  this.m_dataList[index] = pdata;
                //  this.m_dstMFSList[index] = mat;
                //  this.m_dstMFSTotal++;
            }
            
            setDispAt(disp:PureEntity,index:number):void
            {
                this.m_dispList[index] = disp;
                this.m_dispListLen++;
                //console.log("this.m_dispListLen: "+this.m_dispListLen);
            }

            updateParam():void
            {
                for(let i:number = 0; i < this.m_dstMFSTotal; ++i)
                {
                    this.m_dataList[i].update();
                }
            }
            updateAndSendParam():void
            {
                if(this.isSendEnabled())
                {
                    if(this.m_dispListLen > 0)
                    {
                        this.sendData();
                    }
                }
            }
            isSendEnabled():boolean
            {
                return this.m_enabled;//this.m_fs32Arr != null;
            }
            isDataEnabled():boolean
            {
                return this.m_enabled;
            }
            setCurrTotal(currMatTotal:number):number
            {
                currMatTotal = currMatTotal < 1? 1: currMatTotal;
                currMatTotal = currMatTotal > this.m_tarTotal?this.m_tarTotal:currMatTotal;
                this.m_currMatTotal = currMatTotal;
                return currMatTotal;
            }
            private setIndex(index:number):void
            {
                this.m_matIndex = index;
            }
            
            setPositionXYZ(px:number,py:number,pz:number):void
            {
                this.m_fs32Arr[this.m_matIndex++] = px;
                this.m_fs32Arr[this.m_matIndex++] = py;
                this.m_fs32Arr[this.m_matIndex++] = pz;
            }
            setRotationXYZ(prx:number,pry:number,prz:number):void
            {
                this.m_fs32Arr[this.m_matIndex++] = prx;
                this.m_fs32Arr[this.m_matIndex++] = pry;
                this.m_fs32Arr[this.m_matIndex++] = prz;
            }
            setParam(prx:number,pry:number,prz:number):void
            {
                this.m_fs32Arr[this.m_matIndex++] = prx;
                this.m_fs32Arr[this.m_matIndex++] = pry;
                this.m_fs32Arr[this.m_matIndex++] = prz;
            }
            setOffsetXYZ(psx:number,psy:number,psz:number):void
            {
                this.m_fs32Arr[this.m_matIndex++] = psx;
                this.m_fs32Arr[this.m_matIndex++] = psy;
                this.m_fs32Arr[this.m_matIndex++] = psz;
            }
            setSpdParam(prx:number,pry:number,prz:number):void
            {
                this.m_fs32Arr[this.m_matIndex++] = prx;
                this.m_fs32Arr[this.m_matIndex++] = pry;
                this.m_fs32Arr[this.m_matIndex++] = prz;
            }
            //
            sendData():void
            {
                if(this.m_enabled)
                {
                    let sd:MatCarSendData = MatCarSendData.Create();
                    sd.taskCmd = "MAT_car";
                    sd.paramData = this.m_fs32Arr;
                    sd.allTot = this.m_tarTotal;
                    sd.matTotal = this.m_currMatTotal;
                    sd.flag = this.m_flag;
                    sd.calcType = 1;
                    this.addData(sd);
                    this.m_enabled = false;
                    this.m_flag = 1;
                    //console.log("sendData success...uid: "+this.getUid());
                }
                else
                {
                    console.log("sendData failure...");
                }
            }
            
            // return true, task finish; return false, task continue...
            parseDone(data:any,flag:number):boolean
            {
                //console.log("MatCarTask::parseDone(), data: ",data);
                //      //console.log("parseDone(), srcuid: "+data.srcuid+","+this.getUid());
                this.m_fs32Arr = (data.paramData);
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
                for(let i:number = 0; i < this.m_dispListLen; ++i)
                {
                    this.m_dispList[i].getMatrix().copyFromF32Arr(this.m_fs32Arr,i * 16);
                    //this.m_dispList[i].getMatrix().copyFromF32Arr(fs32, i * 16);
                }
                this.m_enabled = true;
                return true;
            }
            getWorkerSendDataAt(i:number):IThreadSendData
            {
                return null;
            }
            destroy():void
            {
                if(this.getUid() > 0)
                {
                    super.destroy();
                }
            }
            
            getTaskClass():number
            {
                return 0;
            }
        }
    }
}