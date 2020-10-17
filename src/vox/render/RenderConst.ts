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
        export class RenderDrawMode
        {
            static ELEMENTS_TRIANGLES:number = 1;
            static ELEMENTS_TRIANGLE_STRIP:number = 2;
            static ELEMENTS_TRIANGLE_FAN:number = 3;
            static ELEMENTS_INSTANCED_TRIANGLES:number = 4;
            static ARRAYS_LINES:number = 5;
            static ARRAYS_LINE_STRIP:number = 6;
            static ARRAYS_POINTS:number = 7;
            static DISABLE:number = 0;
        }
        // blend mode
        export class RenderBlendMode
        {
            static NORMAL:number = 1;
            static OPAQUE:number = 1;
            static TRANSPARENT:number = 2;
            static ALPHA_ADD:number = 3;
            static ADD:number = 4;
            static ADD2:number = 5;
            static INVERSE_ALPHA:number = 6;
            static BLAZE:number = 7;
            static OVERLAY:number = 8;
            static OVERLAY2:number = 8;
            static DISABLE:number = 0;
        }
        export class CullFaceMode
        {
            static BACK:number = 1;
            static FRONT:number = 2;
            static FRONT_AND_BACK:number = 3;
            static NONE:number = 4;
            static DISABLE:number = 0;
        }
        export class DepthTestMode
        {
            static RENDER_NEVER:number = 1;
        	//glDepthMask(false); glDepthFunc(GL_ALWAYS);
        	static RENDER_ALWAYS:number = 2;
        	//glDepthMask(true); glDepthFunc(GL_LEQUAL);
        	static RENDER_SKY:number = 3;
        	static RENDER_TRUE_LESS_EQUAL:number = 3;
        	//glDepthMask(true); glDepthFunc(GL_LESS);
        	static RENDER_OPAQUE:number = 4;
        	static RENDER_TRUE_LESS:number = 4;
        	//glDepthMask(false); glDepthFunc(GL_EQUAL);
        	static RENDER_OPAQUE_OVERHEAD:number = 5;
        	static RENDER_FALSE_EQUAL:number = 5;
        	//glDepthMask(false); glDepthFunc(GL_LESS);
        	static RENDER_FALSE_LESS:number = 6;
        	static RENDER_BLEND:number = 6;
        	static RENDER_BLEND_SORT:number = 6;
        	static RENDER_TRANSPARENT_SORT:number = 6;
        	//glDepthMask(TRUE); glDepthFunc(GL_LEQUAL);
        	static RENDER_TRUE_LEQUAL:number = 7;
            static RENDER_WIRE_FRAME:number = 7;
            //
        	//glDepthMask(false); glDepthFunc(GL_LEQUAL);
        	static RENDER_FALSE_LEQUAL:number = 8;
        	static RENDER_DECALS:number = 8;
        	//glDepthMask(false); glDepthFunc(GL_ALWAYS);
        	static RENDER_NEXT_LAYER:number = 11;
            static RENDER_WIRE_FRAME_NEXT:number = 12;

        	//glDepthMask(true); glDepthFunc(GL_EQUAL);
        	static RENDER_TRUE_EQUAL:number = 13;
        	//glDepthMask(true); glDepthFunc(GL_GREATER);
        	static RENDER_TRUE_GREATER:number = 14;
        	//glDepthMask(true); glDepthFunc(GL_GEQUAL);
        	static RENDER_TRUE_GEQUAL:number = 15;
            static DISABLE:number = 0;
        }
        export class RenderConst
        {
            // 32bit psign: 8bit->pageIndex,8bit->block uid,16bit->RenderDispRenderID
            static SCENE_RO_FILTER_BEGIN:number = (1<<19);
            static SCENE_RO_FILTER_FINISH:number = (2<<19);
            static SCENE_RO_ERASE:number = 0;
        }
    }
}