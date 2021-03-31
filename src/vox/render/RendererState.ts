/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RODrawStateT from "../../vox/render/RODrawState";
import * as RenderConstT from "../../vox/render/RenderConst";

import RenderColorMask = RODrawStateT.vox.render.RenderColorMask;
import RenderStateObject = RODrawStateT.vox.render.RenderStateObject;
import RODrawState = RODrawStateT.vox.render.RODrawState;

import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;

export namespace vox
{
    export namespace render
    {
        export class RendererState
        {
            private static s_initBoo:boolean = true;
            static Rstate:RODrawState = null;
            static DrawCallTimes:number = 0;
            static DrawTrisNumber:number = 0;
            static POVNumber:number = 0;

            public static ALL_TRUE_COLOR_MASK:number = 0;
            public static ALL_FALSE_COLOR_MASK:number = 1;

            static NORMAL_STATE:number = 0;
            static BACK_CULLFACE_NORMAL_STATE:number = 0;
            static FRONT_CULLFACE_NORMAL_STATE:number = 1;
            static NONE_CULLFACE_NORMAL_STATE:number = 2;
            static ALL_CULLFACE_NORMAL_STATE:number = 3;
            static BACK_NORMAL_ALWAYS_STATE:number = 4;
            static BACK_TRANSPARENT_STATE:number = 5;
            static BACK_TRANSPARENT_ALWAYS_STATE:number = 6;
            static NONE_TRANSPARENT_STATE:number = 7;
            static NONE_TRANSPARENT_ALWAYS_STATE:number = 8;
            static FRONT_CULLFACE_GREATER_STATE:number = 9;
            static BACK_ADD_BLENDSORT_STATE:number = 10;
            static BACK_ADD_ALWAYS_STATE:number = 11;
            static BACK_ALPHA_ADD_ALWAYS_STATE:number = 12;
            static NONE_ADD_ALWAYS_STATE:number = 13;
            static NONE_ADD_BLENDSORT_STATE:number = 14;
            static NONE_ALPHA_ADD_ALWAYS_STATE:number = 15;

            static Initialize():void
            {
                if(RendererState.s_initBoo)
                {
                    RendererState.s_initBoo = false;

                    RendererState.Rstate = new RODrawState();

                    RenderColorMask.Rstate = RendererState.Rstate;
                    RenderStateObject.Rstate = RendererState.Rstate;

                    RendererState.ALL_TRUE_COLOR_MASK = RenderColorMask.Create("all_true",true,true,true,true);
                    RendererState.ALL_FALSE_COLOR_MASK = RenderColorMask.Create("all_false",false,false,false,false);
                    
                    RendererState.BACK_CULLFACE_NORMAL_STATE = RenderStateObject.Create("normal",CullFaceMode.BACK,RenderBlendMode.NORMAL,DepthTestMode.RENDER_OPAQUE);
                    RendererState.FRONT_CULLFACE_NORMAL_STATE = RenderStateObject.Create("front_normal",CullFaceMode.FRONT,RenderBlendMode.NORMAL,DepthTestMode.RENDER_OPAQUE);
                    RendererState.NONE_CULLFACE_NORMAL_STATE = RenderStateObject.Create("none_normal",CullFaceMode.NONE,RenderBlendMode.NORMAL,DepthTestMode.RENDER_OPAQUE);
                    RendererState.ALL_CULLFACE_NORMAL_STATE = RenderStateObject.Create("all_cull_normal",CullFaceMode.FRONT_AND_BACK,RenderBlendMode.NORMAL,DepthTestMode.RENDER_OPAQUE);
                    RendererState.BACK_NORMAL_ALWAYS_STATE = RenderStateObject.Create("back_normal_always",CullFaceMode.BACK,RenderBlendMode.NORMAL,DepthTestMode.RENDER_ALWAYS);
                    RendererState.BACK_TRANSPARENT_STATE = RenderStateObject.Create("back_transparent",CullFaceMode.BACK,RenderBlendMode.TRANSPARENT,DepthTestMode.RENDER_TRANSPARENT_SORT);
                    RendererState.BACK_TRANSPARENT_ALWAYS_STATE = RenderStateObject.Create("back_transparent_always",CullFaceMode.BACK,RenderBlendMode.TRANSPARENT,DepthTestMode.RENDER_ALWAYS);
                    RendererState.NONE_TRANSPARENT_STATE = RenderStateObject.Create("none_transparent",CullFaceMode.NONE,RenderBlendMode.TRANSPARENT,DepthTestMode.RENDER_TRANSPARENT_SORT);
                    RendererState.NONE_TRANSPARENT_ALWAYS_STATE = RenderStateObject.Create("none_transparent_always",CullFaceMode.NONE,RenderBlendMode.TRANSPARENT,DepthTestMode.RENDER_ALWAYS);
                    RendererState.FRONT_CULLFACE_GREATER_STATE = RenderStateObject.Create("front_greater",CullFaceMode.FRONT,RenderBlendMode.NORMAL,DepthTestMode.RENDER_TRUE_GREATER);
                    RendererState.BACK_ADD_BLENDSORT_STATE = RenderStateObject.Create("back_add_blendSort",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_TRANSPARENT_SORT);
                    RendererState.BACK_ADD_ALWAYS_STATE = RenderStateObject.Create("back_add_always",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                    RendererState.BACK_ALPHA_ADD_ALWAYS_STATE = RenderStateObject.Create("back_alpha_add_always",CullFaceMode.BACK,RenderBlendMode.ALPHA_ADD,DepthTestMode.RENDER_ALWAYS);
                    RendererState.NONE_ADD_ALWAYS_STATE = RenderStateObject.Create("none_add_always",CullFaceMode.NONE,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                    RendererState.NONE_ADD_BLENDSORT_STATE = RenderStateObject.Create("none_add_blendSort",CullFaceMode.NONE,RenderBlendMode.ADD,DepthTestMode.RENDER_TRANSPARENT_SORT);
                    RendererState.NONE_ALPHA_ADD_ALWAYS_STATE = RenderStateObject.Create("none_alpha_add_always",CullFaceMode.NONE,RenderBlendMode.ALPHA_ADD,DepthTestMode.RENDER_ALWAYS);

                }
            }
            static CreateRenderState(objName:string,cullFaceMode:number,blendMode:number,depthTestMode:number):number
            {
                return RenderStateObject.Create(objName,cullFaceMode,blendMode,depthTestMode);
            }
            static CreateRenderColorMask(objName:string,rBoo:boolean,gBoo:boolean,bBoo:boolean,aBoo:boolean):number
            {
                return RenderColorMask.Create(objName,rBoo,gBoo,bBoo,aBoo);
            }
            static GetRenderStateByName(objName:string):number
            {
                return RenderStateObject.GetRenderStateByName(objName);
            }
            static GetRenderColorMaskByName(objName:string):number
            {
                return RenderColorMask.GetColorMaskByName(objName);
            }
            
            static UnlockBlendMode():void
            {
                RenderStateObject.UnlockBlendMode();
            }
            static LockBlendMode(cullFaceMode:number):void
            {
                RenderStateObject.LockBlendMode(cullFaceMode);
            }
            static UnlockDepthTestMode():void
            {
                RenderStateObject.UnlockDepthTestMode();
            }
            static LockDepthTestMode(depthTestMode:number):void
            {
                RenderStateObject.LockDepthTestMode( depthTestMode );
            }
            static Reset():void
            {
                RenderColorMask.Reset();
                RenderStateObject.Reset();
                RendererState.Rstate.roColorMask = -11;
            }
            static SetDrawState(rstate:RODrawState):void
            {
                RenderColorMask.Rstate = rstate;
                RenderStateObject.Rstate = rstate;
            }
            static ResetInfo():void
            {
                RendererState.DrawCallTimes = 0;
                RendererState.DrawTrisNumber = 0;
                RendererState.POVNumber = 0;
            }
        }
    }
}