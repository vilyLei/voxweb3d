/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IRenderTexResourceT from "../../vox/render/IRenderTexResource";

import IRenderTexResource = IRenderTexResourceT.vox.render.IRenderTexResource;
export namespace vox
{
    export namespace render
    {
        class GpuTexObect
        {
            // wait del times
            waitDelTimes:number = 0;
			// renderer context unique id
            rcuid:number = 0;
            // texture resource unique id
            resUid:number = 0;
            // texture resolution size
            width:number = 0;
            height:number = 0;
            // for 3d texture
            depth:number = 0;
            sampler:number = 0;
            // gpu texture buffer
            texBuf:any = null;
            
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
                //console.log("GpuTexObect::__$detachThis() this.m_attachCount: "+this.m_attachCount);
                if(this.m_attachCount < 1)
                {
                    this.m_attachCount = 0;
                    //console.log("GpuTexObect::__$detachThis() this.m_attachCount value is 0.");
                    // do something
                }
            }
            /**
             * bind the renderer runtime resource  to the current renderer context
             * @param gl system gpu context
             */
            bindToGpu(gl:any):void
            {
                gl.bindTexture(this.sampler, this.texBuf);
            }
            getAttachCount():number
            {
                return this.m_attachCount;
            }
        }
        // gpu texture buffer renderer resource
        export class ROTextureResource implements IRenderTexResource
        {
            private m_resMap:Map<number,GpuTexObect> = new Map();
            private m_freeMap:Map<number,GpuTexObect> = new Map();
            // 显存的纹理buffer的总数
            private m_texResTotal:number = 0;
            private m_attachTotal:number = 0;
            private m_delay:number = 128;
            
			// renderer context unique id
			private m_rcuid:number = 0;
            private m_gl:any = null;
            texMid:number = -1;
            unlocked:boolean = true;
            //readonly updater:ROTexDataUpdater = null;
            constructor(rcuid:number, gl:any)
            {
                this.m_rcuid = rcuid;
                this.m_gl = gl;

                //  let selfT:any = this;
                //  selfT.updater = new ROTexDataUpdater(rcuid, gl, this.m_resMap);
            }
            createBuf():any
            {
                return this.m_gl.createTexture();
            }
            createResByParams3(resUid:number,param0:number,param1:number,param2:number):boolean
            {
                if(!this.m_resMap.has(resUid))
                {
                    let obj:GpuTexObect = new GpuTexObect();
                    obj.rcuid = this.getRCUid();
                    obj.resUid = resUid;
                    obj.width = param0;
                    obj.height = param1;
                    obj.sampler = param2;
                    obj.texBuf = this.createBuf();
                    this.addTextureRes(obj);
                    return true;
                }
                return false;
            }
            /**
             * @returns return renderer context unique id
             */
            getRCUid():number
            {
                return this.m_rcuid;
            }
            /**
             * @returns return system gpu context
             */
            getRC():any
            {
                return this.m_gl;
            }
            /**
             * check whether the renderer runtime resource(by renderer runtime resource unique id) exists in the current renderer context
             * @param resUid renderer runtime resource unique id
             * @returns has or has not resource by unique id
             */
            hasResUid(resUid:number):boolean
            {
                return this.m_resMap.has(resUid);
            }
            renderBegin():void
            {
                this.texMid = -1;
            }
            /**
             * @returns get renderer runtime texture rexource total number
             */
            getTextureResTotal():number
            {
                return this.m_texResTotal;
            }
            private addTextureRes(object:GpuTexObect):void
            {
                if(!this.m_resMap.has(object.resUid))
                {
                    object.waitDelTimes = 0;
                    
                    //console.log("ROTextureResource add a texture buffer(resUid="+object.resUid+"),sampler: ",object.sampler,object);
                    this.m_resMap.set(object.resUid, object);
                    this.m_texResTotal++;
                }
            }
            /**
             * get system gpu context resource buf
             * @param resUid renderer runtime resource unique id
             * @returns system gpu context resource buf
             */
            getGpuBuffer(resUid:number):any
            {
                if(this.m_resMap.has(resUid))
                {
                    return this.m_resMap.get(resUid).texBuf;
                }
                return null;
            }
            /**
             * bind the renderer runtime resource(by renderer runtime resource unique id) to the current renderer context
             * @param resUid renderer runtime resource unique id
             */
            bindToGpu(resUid:number):void
            {
                if(this.m_resMap.has(resUid))
                {
                    this.m_resMap.get(resUid).bindToGpu(this.m_gl);
                }
            }
            /**
             * @returns get renderer runtime texture rexource reference total number
             */
            getAttachTotal():number
            {
                return this.m_attachTotal;
            }
            __$attachRes(resUid:number):void
            {
                if(this.m_resMap.has(resUid))
                {
                    this.m_attachTotal++;
                    let object:GpuTexObect = this.m_resMap.get(resUid);
                    if(object.getAttachCount() < 1)
                    {
                        if(this.m_freeMap.has(resUid))
                        {
                            this.m_freeMap.delete(resUid);
                        }
                    }
                    object.waitDelTimes = 0;
                    object.__$attachThis();
                }
            }
            __$detachRes(resUid:number):void
            {
                if(this.m_resMap.has(resUid))
                {
                    if(this.m_resMap.has(resUid))
                    {
                        let object:GpuTexObect = this.m_resMap.get(resUid);
                        if(object.getAttachCount() > 0)
                        {
                            this.m_attachTotal--;
                            object.__$detachThis();
                            if(object.getAttachCount() < 1)
                            {
                                // 将其加入待清理的map
                                this.m_freeMap.set(resUid, object);
                            }
                        }
                    }
                }
            }
            update():void
            {
                this.m_delay --;
                if(this.m_delay < 1)
                {
                    this.m_delay = 128;
                    for(const [key,value] of this.m_freeMap)
                    {
                        value.waitDelTimes++;
                        if(value.waitDelTimes > 5)
                        {
                            console.log("ROTextureResource remove a texture buffer(resUid="+value.resUid+")");
                            this.m_resMap.delete(value.resUid);
                            this.m_freeMap.delete(value.resUid);
                            
                            this.m_gl.deleteTexture(value.texBuf);
                            value.texBuf = null;
                            this.m_texResTotal--;
                        }
                    }
                }
            }

        }
        
    }
}