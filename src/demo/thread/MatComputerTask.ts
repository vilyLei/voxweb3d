/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// ThreadTask example

import * as IThreadSendDataT from "../../thread/base/IThreadSendData";
import * as ThreadTaskT from "../../thread/control/ThreadTask";
import * as Matrix4T from "../../vox/geom/Matrix4";

import IThreadSendData = IThreadSendDataT.thread.base.IThreadSendData;
import ThreadTask = ThreadTaskT.thread.control.ThreadTask;
import Matrix4 = Matrix4T.vox.geom.Matrix4;

export namespace demo
{
    export namespace thread
    {
        export class MatCalcSendData implements IThreadSendData
        {
            constructor()
            {
            }

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
                        ,allTot:this.allTot
                        ,matTotal:this.matTotal
                        ,paramData:this.paramData
                    }
                }
                //console.log("transferEnabled: "+transferEnabled);
                if(transferEnabled)
                {
                    if(this.paramData != null)
                    {
                        //console.log("MatCalcSendData::buildSendData(), this.paramData.byteLength: "+this.paramData.byteLength);
                        this.transfers = [this.paramData.buffer];
                    }
                }
                this.paramData = null;
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
            private static m_unitList:MatCalcSendData[] = [];
            private static m_freeIdList:number[] = [];
            private static GetFreeId():number
            {
                if(MatCalcSendData.m_freeIdList.length > 0)
                {
                    return MatCalcSendData.m_freeIdList.pop();
                }
                return -1;
            }
            static Create():MatCalcSendData
            {
                let sd:MatCalcSendData = null;
                let index:number = MatCalcSendData.GetFreeId();
                //console.log("MatCalcSendData::Create(), MatCalcSendData.m_unitList.length: "+MatCalcSendData.m_unitList.length);
                if(index >= 0)
                {
                    sd = MatCalcSendData.m_unitList[index];
                    sd.dataIndex = index;
                    MatCalcSendData.m_unitFlagList[index] = MatCalcSendData.__S_FLAG_BUSY;
                }
                else
                {
                    sd = new MatCalcSendData();
                    MatCalcSendData.m_unitList.push( sd );
                    MatCalcSendData.m_unitIndexPptFlagList.push(MatCalcSendData.__S_FLAG_FREE);
                    MatCalcSendData.m_unitFlagList.push(MatCalcSendData.__S_FLAG_BUSY);
                    sd.dataIndex = MatCalcSendData.m_unitListLen;
                    MatCalcSendData.m_unitListLen++;
                }
                return sd;
            }
            
            static Restore(psd:MatCalcSendData):void
            {
                if(psd != null && MatCalcSendData.m_unitFlagList[psd.dataIndex] == MatCalcSendData.__S_FLAG_BUSY)
                {
                    let uid:number = psd.dataIndex;
                    MatCalcSendData.m_freeIdList.push(uid);
                    MatCalcSendData.m_unitFlagList[uid] = MatCalcSendData.__S_FLAG_FREE;
                    psd.reset();
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
            matTask:MatComputerTask = null;
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

                this.matTask.setScaleXYZ(this.sx,this.sy,this.sz);
                this.matTask.setRotationXYZ(this.rx,this.ry,this.rz);
                this.matTask.setPositionXYZ(this.x,this.y,this.z);
            }
        }
        export class MatComputerTask extends ThreadTask
        {
            private m_matIndex:number = 0;
            private m_matTotal:number = 0;
            private m_currMatTotal:number = 1;
            private m_fs32Arr:Float32Array = null;
            private m_dstMFSList:Matrix4[] = null;
            private m_dstMFSTotal:number = 0;

            
            private m_dataList:TransData[] = null;
            private m_dataListLen:number = 0;
            constructor()
            {
                super();
            }
            initialize(matTotal:number):void
            {
                if(this.m_fs32Arr == null && matTotal > 0)
                {
                    this.m_matTotal = matTotal;
                    this.m_fs32Arr = new Float32Array(matTotal * 16);
                    this.m_dstMFSList = new Array(matTotal);
                    this.m_dataList = new Array(matTotal);
                }
            }
            getTotal():number
            {
                return this.m_matTotal;
            }
            setMatAt(mat:Matrix4,index:number):void
            {
                let pdata:TransData = new TransData();
                pdata.matTask = this;
                pdata.initialize();
                this.m_dataList[index] = pdata;
                this.m_dstMFSList[index] = mat;
                this.m_dstMFSTotal++;
            }
            updateParam():void
            {
                for(let i:number = 0; i < this.m_dstMFSTotal; ++i)
                {
                    this.m_dataList[i].update();
                }
            }
            isSendEnabled():boolean
            {
                return this.m_fs32Arr != null;
            }
            isDataEnabled():boolean
            {
                return this.m_fs32Arr != null;
            }
            setCurrTotal(currMatTotal:number):number
            {
                currMatTotal = currMatTotal < 1? 1: currMatTotal;
                currMatTotal = currMatTotal > this.m_matTotal?this.m_matTotal:currMatTotal;
                this.m_currMatTotal = currMatTotal;
                return currMatTotal;
            }
            setIndex(index:number):void
            {
                this.m_matIndex = index * 9;
            }
            setScaleXYZ(psx:number,psy:number,psz:number):void
            {
                this.m_fs32Arr[this.m_matIndex++] = psx;
                this.m_fs32Arr[this.m_matIndex++] = psy;
                this.m_fs32Arr[this.m_matIndex++] = psz;
            }
            setRotationXYZ(prx:number,pry:number,prz:number):void
            {
                this.m_fs32Arr[this.m_matIndex++] = prx;
                this.m_fs32Arr[this.m_matIndex++] = pry;
                this.m_fs32Arr[this.m_matIndex++] = prz;
            }
            setPositionXYZ(px:number,py:number,pz:number):void
            {
                this.m_fs32Arr[this.m_matIndex++] = px;
                this.m_fs32Arr[this.m_matIndex++] = py;
                this.m_fs32Arr[this.m_matIndex++] = pz;
            }
            sendData():void
            {
                if(this.m_fs32Arr != null)
                {
                    let sd:MatCalcSendData = MatCalcSendData.Create();
                    sd.taskCmd = "MAT_COMPUTE";
                    sd.paramData = this.m_fs32Arr;
                    sd.allTot = this.m_matTotal;
                    sd.matTotal = this.m_currMatTotal;
                    this.addData(sd);
                    this.m_fs32Arr = null;
                }
            }
            
            // return true, task finish; return false, task continue...
            parseDone(data:any,flag:number):boolean
            {
                //console.log("MatComputerTask::parseDone(), data: ",data);
                this.m_fs32Arr = data.paramData;
                //this.m_dstMFSList[0].copyFromF32Arr(this.m_fs32Arr,0);
                let list:Matrix4[] = this.m_dstMFSList;
                //console.log("data.matTotal: "+data.matTotal);
                for(let i:number=0,len:number=data.matTotal;i < len;++i)
                {
                    list[i].copyFromF32Arr(this.m_fs32Arr,i * 16);
                    //console.log("list["+i+"]: \n"+list[i].toString());
                }
                //console.log("this.m_dstMFSList[0]: \n"+this.m_dstMFSList[0].toString());
                //this.m_dstMFSList[index]
                //data.paramData = null;
                MatCalcSendData.Restore(data.dataIndex);
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