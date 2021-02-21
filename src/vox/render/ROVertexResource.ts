/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IBufferBuilderT from "../../vox/render/IBufferBuilder";
import * as VtxBufDataT from "../../vox/mesh/VtxBufData";

import IBufferBuilder = IBufferBuilderT.vox.render.IBufferBuilder;
import VtxBufData = VtxBufDataT.vox.mesh.VtxBufData;

export namespace vox
{
    export namespace render
    {
        export class ROVertexRes
        {
            constructor()
            {
            }
        }
        export class ROIndicesRes
        {
            private m_vtxUid:number = 0;
            private m_buf:any = null;
            private m_ivsSize:number = 0;
            private m_ivs:Uint16Array|Uint32Array;
            constructor()
            {
            }
            getVtxUid():number
            {
                return this.m_vtxUid;
            }
            getBuf():any
            {
                return this.m_buf;
            }
            initialize(rc:IBufferBuilder, ivs:Uint16Array|Uint32Array,bufData:VtxBufData,bufDataUsage:number,vtxUid:number):void
            {
                if(this.m_buf == null)
                {
                    this.m_vtxUid = vtxUid;
                    this.m_ivs = ivs;
                    this.m_buf = rc.createBuf();
                    rc.bindEleBuf(this.m_buf);
                    
                    if(bufData == null)
                    {
                        rc.eleBufData(this.m_ivs, bufDataUsage);
                        this.m_ivsSize = this.m_ivs.length;
                    }
                    else
                    {
                        rc.eleBufDataMem(bufData.getIndexDataTotalBytes(),bufDataUsage);
                        let uintArr:any = null;
                        let offset:number = 0;
                        this.m_ivsSize = 0;
                        for(let i:number = 0, len:number = bufData.getIndexDataTotal(); i < len; ++i)
                        {
                            uintArr = bufData.getIndexDataAt(i);
                            rc.eleBufSubData(uintArr, offset);
                            offset += uintArr.byteLength;
                            this.m_ivsSize += uintArr.length;
                        }
                    }
                }
            }
        }
        export class GpuVtxObect
        {
            // wait del times
            waitDelTimes:number = 0;
			// renderer context unique id
            rcuid:number = 0;
            // texture resource unique id
            resUid:number = 0;
            
            vertex:ROVertexRes = new ROVertexRes();
            indices:ROIndicesRes = new ROIndicesRes();
            constructor()
            {
            }
            private m_attachCount:number = 0;
            __$attachThis():void
            {
                ++this.m_attachCount;
            }
            __$detachThis():void
            {
                --this.m_attachCount;
                //console.log("GpuVtxObect::__$detachThis() this.m_attachCount: "+this.m_attachCount);
                if(this.m_attachCount < 1)
                {
                    this.m_attachCount = 0;
                    //console.log("GpuVtxObect::__$detachThis() this.m_attachCount value is 0.");
                    // do something
                }
            }
            getAttachCount():number
            {
                return this.m_attachCount;
            }
        }
        // gpu vertex buffer renderer resource
        export class ROVertexResource
        {
            private m_resMap:Map<number,GpuVtxObect> = new Map();
            private m_freeMap:Map<number,GpuVtxObect> = new Map();
            // 显存的vtx buffer的总数
            private m_texResTotal:number = 0;
            private m_attachTotal:number = 0;
            private m_delay:number = 128;

			// renderer context unique id
			private m_rcuid:number = 0;
            private m_gl:any = null;

            // render vertex object unique id
            rvoUid:number = -2;
            // indices buffer object unique id
            rioUid:number = -3;
            unlocked:boolean = true;
            constructor(rcuid:number, gl:any)
            {
                this.m_rcuid = rcuid;
                this.m_gl = gl;
            }
            getRCUid():number
            {
                return this.m_rcuid;
            }
            getRC():any
            {
                return this.m_gl;
            }
            renderBegin():void
            {
                this.rvoUid = -2;
                this.rioUid = -3;
            }
            getVertexResTotal():number
            {
                return this.m_texResTotal;
            }
            addVertexRes(object:GpuVtxObect):void
            {
                if(!this.m_resMap.has(object.resUid))
                {
                    object.waitDelTimes = 0;
                    
                    // console.log("ROTextureResource add a texture buffer(resUid="+object.resUid+"),sampler: ",object.sampler,object);
                    this.m_resMap.set(object.resUid, object);
                    this.m_texResTotal++;
                }
            }
            hasVertexRes(resUid:number):boolean
            {
                return this.m_resMap.has(resUid);
            }
            getVertexRes(resUid:number):GpuVtxObect
            {
                return this.m_resMap.get(resUid);
            }
            update():void
            {
            }

        }
        
    }
}