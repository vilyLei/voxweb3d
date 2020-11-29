/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// renderer context Extensions

import * as RenderFBOProxyT from "../../vox/render/RenderFBOProxy";
import RenderFBOProxy = RenderFBOProxyT.vox.render.RenderFBOProxy;

export namespace vox
{
    export namespace render
    {
        export class RCExtension
        {
            
            static readonly WEBGL_draw_buffers:any = null;
            static readonly OES_vertex_array_object:any = null;
            static readonly ANGLE_instanced_arrays:any = null;
            static readonly EXT_color_buffer_float:any = null;
            static readonly EXT_color_buffer_half_float:any = null;
            static readonly OES_texture_float_linear:any = null;
            static readonly OES_texture_half_float_linear:any = null;
            static readonly OES_texture_float:any = null;
            static readonly OES_element_index_uint:any = null;

            static Initialize(webVer:number, gl:any):void
            {
                let selfT:any = this;
                if(webVer == 1)
                {
                    selfT.WEBGL_draw_buffers = gl.getExtension('WEBGL_draw_buffers');
                    if(selfT.WEBGL_draw_buffers != null)
                    console.log("Use WEBGL_draw_buffers Extension success!");
                    else
                    console.log("WEBGL_draw_buffers Extension can not support!");
                    selfT.OES_vertex_array_object = gl.getExtension('OES_vertex_array_object');
                    if(selfT.OES_vertex_array_object != null)
                    console.log("Use OES_vertex_array_object Extension success!");
                    else
                    console.log("OES_vertex_array_object Extension can not support!");
                    selfT.ANGLE_instanced_arrays = gl.getExtension('ANGLE_instanced_arrays');
                    if(selfT.ANGLE_instanced_arrays != null)
                    console.log("Use ANGLE_instanced_arrays Extension success!");
                    else
                    console.log("ANGLE_instanced_arrays Extension can not support!");
                    selfT.EXT_color_buffer_float = gl.getExtension('EXT_color_buffer_float');
                    if(selfT.EXT_color_buffer_float != null)
                    console.log("Use EXT_color_buffer_float Extension success!");
                    else
                    console.log("EXT_color_buffer_float Extension can not support!");

                    selfT.EXT_color_buffer_half_float = gl.getExtension('EXT_color_buffer_half_float');
                    if(selfT.EXT_color_buffer_half_float != null)
                    console.log("Use EXT_color_buffer_half_float Extension success!");
                    else
                    console.log("EXT_color_buffer_half_float Extension can not support!");

                    selfT.OES_texture_half_float_linear = gl.getExtension('OES_texture_half_float_linear');
                    if(selfT.OES_texture_half_float_linear != null)
                    console.log("Use OES_texture_half_float_linear Extension success!");
                    else
                    console.log("OES_texture_half_float_linear Extension can not support!");

                    selfT.OES_texture_float = gl.getExtension('OES_texture_float');
                    if(selfT.OES_texture_float != null)
                    console.log("Use OES_texture_float Extension success!");
                    else
                    console.log("OES_texture_float Extension can not support!");
                    //
                    selfT.OES_element_index_uint = gl.getExtension('OES_element_index_uint');
                    if(selfT.OES_element_index_uint != null)
                    console.log("Use OES_element_index_uint Extension success!");
                    else
                    console.log("OES_element_index_uint Extension can not support!");
                }
                else
                {
                    
                    selfT.EXT_color_buffer_half_float = gl.getExtension('EXT_color_buffer_half_float');
                    if(selfT.EXT_color_buffer_half_float != null)
                    console.log("Use EXT_color_buffer_half_float Extension success!");
                    else
                    console.log("EXT_color_buffer_half_float Extension can not support!");
                    
                    selfT.OES_texture_half_float_linear = gl.getExtension('OES_texture_half_float_linear');
                    if(selfT.OES_texture_half_float_linear != null)
                    console.log("Use OES_texture_half_float_linear Extension success!");
                    else
                    console.log("OES_texture_half_float_linear Extension can not support!");

                    selfT.EXT_color_buffer_float = gl.getExtension('EXT_color_buffer_float');
                    if(selfT.EXT_color_buffer_float != null)
                    console.log("Use EXT_color_buffer_float Extension success!");
                    else
                    console.log("EXT_color_buffer_float Extension can not support!");
                }
                
                selfT.OES_texture_float_linear = gl.getExtension('OES_texture_float_linear');
                if(selfT.OES_texture_float_linear != null)
                console.log("Use OES_texture_float_linear Extension success!");
                else
                console.log("OES_texture_float_linear Extension can not support!");
            }
        }
    }
}
