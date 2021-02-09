/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RenderConstT from "../../vox/render/RenderConst";
import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;

export namespace vox
{
    export namespace render
    {
        export class RenderColorMask
        {
            private static s_uid:number = 0;    
            private static s_state:number = -1;
            private static s_states:RenderColorMask[] = [];
            private static s_statesLen:number = 1;
            private static s_stsMap:Map<number,RenderColorMask> = new Map();
            private static s_stsNameMap:Map<string,RenderColorMask> = new Map();
            private static s_unlocked:boolean = true;

            public static ALL_TRUE_COLOR_MASK:number = 0;
            public static ALL_FALSE_COLOR_MASK:number = 1;

            static Rstate:RODrawState = null;
        
            private m_uid:number = -1;
            private m_rBoo:boolean = true;
            private m_gBoo:boolean = true;
            private m_bBoo:boolean = true;
            private m_aBoo:boolean = true;
            private m_state:number = 0;
            constructor(rBoo:boolean,gBoo:boolean,bBoo:boolean,aBoo:boolean)
            {
                this.m_uid = RenderColorMask.s_uid++;
                this.m_rBoo = rBoo;
                this.m_gBoo = gBoo;
                this.m_bBoo = bBoo;
                this.m_aBoo = aBoo;
                this.m_state = (this.m_rBoo?1<<6:0) | (this.m_gBoo?1<<4:0) | (this.m_bBoo?1<<2:0) | (this.m_aBoo?1:0);
            }
            getUid():number
            {
                return this.m_uid;
            }
            getState():number
            {
                return this.m_state;
            }
            getR():boolean
            {
                return this.m_rBoo;
            }
            getG():boolean
            {
                return this.m_gBoo;
            }
            getB():boolean
            {
                return this.m_bBoo;
            }
            getA():boolean
            {
                return this.m_aBoo;
            }
            use():void
            {
                if(RenderColorMask.s_state != this.m_uid)
                {
                    RenderColorMask.Rstate.setColorMask(this.m_rBoo,this.m_gBoo,this.m_bBoo,this.m_aBoo);
                    RenderColorMask.s_state = this.m_uid;
                }
            }
    
            static Create(objName:string,rBoo:boolean,gBoo:boolean,bBoo:boolean,aBoo:boolean):number
            {
                if(RenderColorMask.s_stsNameMap.has(objName))
                {
                    let po:RenderColorMask = RenderColorMask.s_stsNameMap.get(objName);
                    return po.getUid();
                }
                let key:number = (rBoo?1<<6:1<<5) | (gBoo?1<<4:1<<3) | (bBoo?1<<2:1<<1) | (aBoo?1:0);
            
                if(RenderColorMask.s_stsMap.has(key))
                {
                    let po:RenderColorMask = RenderColorMask.s_stsMap.get(key);
                    key = po.getUid();
                }
                else
                {
                    let po:RenderColorMask = new RenderColorMask(rBoo,gBoo,bBoo,aBoo);
                    key = po.getUid();
                    RenderColorMask.s_stsMap.set(key, po);
                    RenderColorMask.s_stsNameMap.set(objName, po);
                    RenderColorMask.s_states.push(po);
                    ++RenderColorMask.s_statesLen;
                }
                return key;
            }
            
            static GetColorMaskByName(objName:string):number
            {
                if(RenderColorMask.s_stsNameMap.has(objName))
                {
                    let po = RenderColorMask.s_stsNameMap.get(objName);
                    return po.getUid();
                }
                return -1;
            }
            // @param           state come from RODisp::renderState
            static UseRenderState(state:number):void
            {
                if(RenderColorMask.s_unlocked && RenderColorMask.Rstate.roColorMask != state)
                {
                    if(state > -1 && state < RenderColorMask.s_statesLen)
                    {
                        RenderColorMask.s_states[state].use();
                    }
                }
            }
            static UseColorMaskByName(stateName:string):void
            {
                let state = RenderColorMask.GetColorMaskByName(stateName);
                //trace("state: "+state+", stateName: "+stateName);
                if(RenderColorMask.s_unlocked && RenderColorMask.Rstate.roColorMask != state)
                {
                    if(state > -1 && state < RenderColorMask.s_statesLen)
                    {
                        RenderColorMask.s_states[state].use();
                    }
                }
            }
            static Lock():void
            {
                RenderColorMask.s_unlocked = false;
            }
            static Unlock():void
            {
                RenderColorMask.s_unlocked = true;
            }
            static Reset():void
            {
                RenderColorMask.s_state = -1;
            }
        }


        export class RenderStateObject
        {
            private static s_uid:number = 0;
            private static s_state:number = -1;    
            private static s_states:RenderStateObject[] = [];
            private static s_statesLen:number = 1;
            private static s_blendMode:number = -1;
            private static s_depthTestMode:number = -1;
            private static s_stsMap:Map<number,RenderStateObject> = new Map();
            private static s_stsNameMap:Map<string,RenderStateObject> = new Map();
            private static s_unlocked:boolean = true;

            static NORMAL_STATE:number = 0;
            static BACK_CULLFACE_NORMAL_STATE:number = 0;
            static FRONT_CULLFACE_NORMAL_STATE:number = 1;
            static NONE_CULLFACE_NORMAL_STATE:number = 2;
            static ALL_CULLFACE_NORMAL_STATE:number = 3;
            static BACK_NORMAL_ALWAYS_STATE:number = 4;
            static BACK_TRANSPARENT_STATE:number = 5;
            static BACK_TRANSPARENT_ALWAYS_STATE:number = 6;
            static NONE_TRANSPARENT_STATE:number = 7;

            static Rstate:RODrawState = null;

            private m_uid:number = -1;
            private m_cullFaceMode:number = 0;
	        // blend mode
	        private m_blendMode:number = 0;
	        // depth test type mode
	        private m_depthTestMode:number = 0;
            // shadow status Mode(receive | make | receive and make | none)
            private m_shadowMode:number = 0;
            private m_state:number = 0;
            constructor(cullFaceMode:number,blendMode:number,depthTestMode:number)
            {
                this.m_uid = RenderStateObject.s_uid++;
                this.m_cullFaceMode = cullFaceMode;
	            this.m_blendMode = blendMode;
	            this.m_depthTestMode = depthTestMode;
                this.m_state = this.m_shadowMode << 12 | this.m_depthTestMode << 8 | this.m_blendMode<<4 | this.m_cullFaceMode;
            }
            getUid():number
            {
                return this.m_uid;
            }
            getState():number
            {
                return this.m_state;
            }
            getCullFaceMode():number
            {
                return this.m_cullFaceMode;
            }
            getDepthTestMode():number
            {
                return this.m_depthTestMode;
            }
            getBlendMode():number
            {
                return this.m_blendMode;
            }
            use():void
            {
                if(RenderStateObject.s_state != this.m_uid)
                {
                    //console.log("RenderStateObject::use(), m_blendMode: "+this.m_blendMode+",m_depthTestMode: "+this.m_depthTestMode+", m_uid: "+this.m_uid);
                    RenderStateObject.Rstate.setCullFaceMode(this.m_cullFaceMode);
                    //RenderStateObject.Rstate.setBlendMode(this.m_blendMode);
                    if(RenderStateObject.s_blendMode < 0)
                    {
                        RenderStateObject.Rstate.setBlendMode(this.m_blendMode);
                    }
                    else
                    {
                        RenderStateObject.Rstate.setBlendMode(RenderStateObject.s_blendMode);
                    }
                    //RenderStateObject.Rstate.setDepthTestMode(this.m_depthTestMode);
                    if(RenderStateObject.s_depthTestMode < 0)
                    {
                        RenderStateObject.Rstate.setDepthTestMode(this.m_depthTestMode);
                    }
                    else
                    {
                        RenderStateObject.Rstate.setDepthTestMode(RenderStateObject.s_depthTestMode);
                    }
                    //
                    RenderStateObject.s_state = this.m_uid;
                }
            }
            static Create(objName:string,cullFaceMode:number,blendMode:number,depthTestMode:number):number
            {
                if(RenderStateObject.s_stsNameMap.has(objName))
                {
                    let po = RenderStateObject.s_stsNameMap.get(objName);
                    return po.getUid();
                }
                let key = depthTestMode << 8 | blendMode<<4 | cullFaceMode;
                if(RenderStateObject.s_stsMap.has(key))
                {
                    let po = RenderStateObject.s_stsMap.get(key);
                    key = po.getUid();
                }
                else
                {
                    let po = new RenderStateObject(cullFaceMode,blendMode,depthTestMode);
                    key = po.getUid();
                    RenderStateObject.s_stsMap.set(key, po);
                    RenderStateObject.s_stsNameMap.set(objName, po);
                    RenderStateObject.s_states.push(po);
                    ++RenderStateObject.s_statesLen;
                }
                return key;
            }
            static GetRenderStateByName(objName:string):number
            {
                if(RenderStateObject.s_stsNameMap.has(objName))
                {
                    let po = RenderStateObject.s_stsNameMap.get(objName);
                    return po.getUid();
                }
                return -1;
            }
            // @param           state come from RODisp::renderState
            static UseRenderState(state:number)
            {
                //if(RenderStateObject.s_unlocked && RenderStateObject.Rstate.roState != state)                
                if(RenderStateObject.s_unlocked && RenderStateObject.s_state != state)
                {
                    if(state > -1 && state < RenderStateObject.s_statesLen)
                    {
                        RenderStateObject.s_states[state].use();
                    }
                }
            }
            static UseRenderStateByName(stateName:string):void
            {
                if(RenderStateObject.s_unlocked)
                {
                    let state:number = RenderStateObject.GetRenderStateByName(stateName);
                    //trace("state: "+state+", stateName: "+stateName);
                    //if(RenderStateObject.Rstate.roState != state)
                    if(RenderStateObject.s_state != state)
                    {
                        if(state > -1 && state < RenderStateObject.s_statesLen)
                        {
                            RenderStateObject.s_states[state].use();
                        }
                    }
                }
            }
            static UnlockBlendMode():void
            {
                RenderStateObject.s_blendMode = -1;
            }
            static LockBlendMode(cullFaceMode:number):void
            {
                RenderStateObject.s_blendMode = cullFaceMode;
            }
            static UnlockDepthTestMode():void
            {
                RenderStateObject.s_depthTestMode = -1;
            }
            static LockDepthTestMode(depthTestMode:number):void
            {
                RenderStateObject.s_depthTestMode = depthTestMode;
            }
            static Lock():void
            {
                RenderStateObject.s_unlocked = false;
            }
            static Unlock():void
            {
                RenderStateObject.s_unlocked = true;
            }
            static Reset():void
            {
                RenderStateObject.s_state = -1;
            }
        }


        export class RODrawState
        {
            private s_blendMode:number = RenderBlendMode.NORMAL;
            private s_cullMode:number = CullFaceMode.NONE;
            private s_depthTestType:number = DepthTestMode.DISABLE;
            private s_blendDisabled:boolean = true;
            private s_cullDisabled:boolean = true;
            private m_gl:any = null;
        
            public roColorMask:number = -11;
            //public drawcallTimes:number = 0;
            constructor()
            {
            }
            setRenderer(gl:any):void
            {
                this.m_gl = gl;
            }
            setColorMask(mr:boolean,mg:boolean,mb:boolean,ma:boolean):void
            {
                this.m_gl.colorMask(mr,mg,mb,ma);
            }
            setCullFaceMode(mode:number):void
        	{
        		switch (mode)
        		{
                case CullFaceMode.BACK:
                    if(this.s_cullMode != mode)
                    {
                        this.s_cullMode = mode;
                        if(this.s_cullDisabled){this.s_cullDisabled = false;this.m_gl.enable(this.m_gl.CULL_FACE);}
                        this.m_gl.cullFace(this.m_gl.BACK);
                    }
        		break;
                case CullFaceMode.FRONT:
                    if(this.s_cullMode != mode)
                    {
                        this.s_cullMode = mode;
                        if(this.s_cullDisabled){this.s_cullDisabled = false;this.m_gl.enable(this.m_gl.CULL_FACE);}
                        this.m_gl.cullFace(this.m_gl.FRONT);
                    }
        		break;
                case CullFaceMode.FRONT_AND_BACK:
                    if(this.s_cullMode != mode)
                    {
                        this.s_cullMode = mode;
                        if(this.s_cullDisabled){this.s_cullDisabled = false;this.m_gl.enable(this.m_gl.CULL_FACE);}
                        this.m_gl.cullFace(this.m_gl.FRONT_AND_BACK);
                    }
                break;
                case CullFaceMode.NONE:
                case CullFaceMode.DISABLE:
                    if(this.s_cullMode != mode)
                    {
                        this.s_cullMode = mode;
                        if(!this.s_cullDisabled)
                        {
                            this.s_cullDisabled = true;
                            this.m_gl.disable(this.m_gl.CULL_FACE);
                        }
                    }
        		break;
        		default:
        			break;
        		}
        	}
            setBlendMode(mode:number):void
            {
                if(this.s_blendMode != mode)
                {
                    //trace("this.s_blendMode: "+this.s_blendMode + ","+mode);
                    this.s_blendMode = mode;
                    switch(mode)
                    {
                        case RenderBlendMode.NORMAL:
                            if (this.s_blendDisabled) { this.m_gl.enable(this.m_gl.BLEND); this.s_blendDisabled = false; this.m_gl.blendEquation(this.m_gl.FUNC_ADD);}
                            this.m_gl.blendFunc(this.m_gl.ONE, this.m_gl.ZERO);
                            //trace("use blendMode NORMAL.");
                            break;
                        case RenderBlendMode.TRANSPARENT:
                            if (this.s_blendDisabled) { this.m_gl.enable(this.m_gl.BLEND); this.s_blendDisabled = false; this.m_gl.blendEquation(this.m_gl.FUNC_ADD);}
                            this.m_gl.blendFunc(this.m_gl.SRC_ALPHA, this.m_gl.ONE_MINUS_SRC_ALPHA);
                            //trace("use blendMode TRANSPARENT.");
                            break;
                        case RenderBlendMode.ALPHA_ADD:
                            if (this.s_blendDisabled) { this.m_gl.enable(this.m_gl.BLEND); this.s_blendDisabled = false; this.m_gl.blendEquation(this.m_gl.FUNC_ADD);}
                            this.m_gl.blendFunc(this.m_gl.ONE, this.m_gl.ONE_MINUS_SRC_ALPHA);
                            break;
                        case RenderBlendMode.ADD:
                            if (this.s_blendDisabled) {this.m_gl.enable(this.m_gl.BLEND); this.s_blendDisabled = false; this.m_gl.blendEquation(this.m_gl.FUNC_ADD);}
                            this.m_gl.blendFunc(this.m_gl.SRC_ALPHA, this.m_gl.ONE);
                            //trace("use blendMode ADD.");
                            break;
                        case RenderBlendMode.ADD2:
                            if (this.s_blendDisabled) { this.m_gl.enable(this.m_gl.BLEND); this.s_blendDisabled = false; this.m_gl.blendEquation(this.m_gl.FUNC_ADD);}
                            this.m_gl.blendFunc(this.m_gl.ONE, this.m_gl.ONE);
                            break;
                        case RenderBlendMode.INVERSE_ALPHA:
                            if (this.s_blendDisabled) { this.m_gl.enable(this.m_gl.BLEND); this.s_blendDisabled = false; this.m_gl.blendEquation(this.m_gl.FUNC_ADD);}
                            this.m_gl.blendFunc(this.m_gl.ONE, this.m_gl.SRC_ALPHA);
                            break;
                        case RenderBlendMode.BLAZE:
                            if (this.s_blendDisabled) { this.m_gl.enable(this.m_gl.BLEND); this.s_blendDisabled = false; this.m_gl.blendEquation(this.m_gl.FUNC_ADD);}
        					this.m_gl.blendFunc(this.m_gl.SRC_COLOR, this.m_gl.ONE);
                            break;
                        case RenderBlendMode.OVERLAY:
                            if (this.s_blendDisabled) { this.m_gl.enable(this.m_gl.BLEND); this.s_blendDisabled = false; this.m_gl.blendEquation(this.m_gl.FUNC_ADD);}
                            this.m_gl.blendFunc(this.m_gl.DST_COLOR, this.m_gl.DST_ALPHA);
                            break;
                        case RenderBlendMode.OVERLAY2:
                            if (this.s_blendDisabled) { this.m_gl.enable(this.m_gl.BLEND); this.s_blendDisabled = false; this.m_gl.blendEquation(this.m_gl.FUNC_ADD);}
                            this.m_gl.blendFunc(this.m_gl.DST_COLOR, this.m_gl.SRC_ALPHA);
                            break;
                        case RenderBlendMode.DISABLE:
                            if (!this.s_blendDisabled) { this.m_gl.disable(this.m_gl.BLEND); this.s_blendDisabled = true; }
                            break; 
                        default:
                            break;
                    }
                }
            }
            setDepthTestMode(type:number):void
            {
                if (this.s_depthTestType != type) {
                    this.s_depthTestType = type;
                    //trace("RendererBase::setDepthTest(),type：",std::to_string(static_cast<int>(type)));
                    switch (type)
                    {
                    case DepthTestMode.RENDER_ALWAYS:
                        this.m_gl.depthMask(false); this.m_gl.depthFunc(this.m_gl.ALWAYS);
                        break;
                    case DepthTestMode.RENDER_SKY:
                        this.m_gl.depthMask(true); this.m_gl.depthFunc(this.m_gl.LEQUAL);
                        break;
                    case DepthTestMode.RENDER_OPAQUE:
                        this.m_gl.depthMask(true); this.m_gl.depthFunc(this.m_gl.LESS);
                        break;
                    case DepthTestMode.RENDER_OPAQUE_OVERHEAD:
                        this.m_gl.depthMask(false); this.m_gl.depthFunc(this.m_gl.EQUAL);
                        break;
                    case DepthTestMode.RENDER_DECALS:
                        this.m_gl.depthMask(false); this.m_gl.depthFunc(this.m_gl.LEQUAL);
                        break;
                    case DepthTestMode.RENDER_BLEND:
                        //if (list.next != null) list = sortByAverageZ(list);
                        this.m_gl.depthMask(false); this.m_gl.depthFunc(this.m_gl.LESS);
                        break;
                    case DepthTestMode.RENDER_WIRE_FRAME:
                        this.m_gl.depthMask(true); this.m_gl.depthFunc(this.m_gl.LEQUAL);
                        break;
                    case DepthTestMode.RENDER_NEXT_LAYER:
                        this.m_gl.depthMask(false); this.m_gl.depthFunc(this.m_gl.ALWAYS);
                        break;
                    case DepthTestMode.RENDER_TRUE_EQUAL:
                        this.m_gl.depthMask(true); this.m_gl.depthFunc(this.m_gl.EQUAL);
                        break;
                    case DepthTestMode.RENDER_TRUE_GREATER:
                        this.m_gl.depthMask(true); this.m_gl.depthFunc(this.m_gl.GREATER);
                        break;
                    case DepthTestMode.RENDER_TRUE_GEQUAL:
                        this.m_gl.depthMask(true); this.m_gl.depthFunc(this.m_gl.GEQUAL);
                        break;
                    case DepthTestMode.RENDER_WIRE_FRAME_NEXT:
                        break;
                    default:
                        break;
                    }
                }
            }
        }
    }
}