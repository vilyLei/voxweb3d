/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export namespace vox
{
    export namespace render
    {
        export class GpuTexObect
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
            getAttachCount():number
            {
                return this.m_attachCount;
            }
            constructor()
            {
                
            }
        }
        // tgpu exture buffer renderer resource
        export class ROTextureResource
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
                this.texMid = -1;
            }
            getTextureResTotal():number
            {
                return this.m_texResTotal;
            }
            addTextureRes(object:GpuTexObect):void
            {
                if(!this.m_resMap.has(object.resUid))
                {
                    object.waitDelTimes = 0;
                    
                    // console.log("ROTextureResource add a texture buffer(resUid="+object.resUid+"),sampler: ",object.sampler,object);
                    this.m_resMap.set(object.resUid, object);
                    this.m_texResTotal++;
                }
            }
            /*
            removeTextureRes(resUid:number):void
            {
                if(this.m_resMap.has(resUid))
                {
                    let object:GpuTexObect = this.m_resMap.get(resUid);
                    if(object.getAttachCount() < 1)
                    {
                        // 如果没有任何对象引用这个 gpu texture buffer，才可以被删除
                        this.m_gl.deleteTexture(object.texBuf);
                        this.m_resMap.delete(resUid);
                        this.m_texResTotal--;
                    }
                }
            }
            //*/
            hasTextureRes(resUid:number):boolean
            {
                return this.m_resMap.has(resUid);
            }
            getTextureRes(resUid:number):GpuTexObect
            {
                return this.m_resMap.get(resUid);
            }
            getTextureBuffer(resUid:number):any
            {
                if(this.m_resMap.has(resUid))
                {
                    return this.m_resMap.get(resUid).texBuf;
                }
                return null;
            }
            /**
             * @param resUid 准备 bind 到 当前 renderer context 的 gpu texture buffer
             */
            bindTexture(resUid:number):void
            {
                if(this.m_resMap.has(resUid))
                {
                    let object:GpuTexObect = this.m_resMap.get(resUid);
                    // console.log("ROTextureResource::bindTexture(),resUid:"+resUid,",sampler: ",object.sampler,object);
                    this.m_gl.bindTexture(object.sampler, object.texBuf);
                }
            }
            /**
             * 返回引用的总数量
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
                            // console.log("TextureResource remove a texture buffer(resUid="+value.resUid+")");
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