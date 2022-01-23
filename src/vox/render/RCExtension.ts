import DivLog from "../utils/DivLog";

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// renderer context Extensions
class RCExtension
{
    static readonly OES_standard_derivatives:any = null;
    static readonly EXT_shader_texture_lod:any = null;
    static readonly WEBGL_draw_buffers:any = null;
    static readonly OES_vertex_array_object:any = null;
    static readonly ANGLE_instanced_arrays:any = null;
    static readonly EXT_color_buffer_float:any = null;
    static readonly EXT_color_buffer_half_float:any = null;
    static readonly OES_texture_float_linear:any = null;
    static readonly OES_texture_half_float_linear:any = null;
    static readonly OES_texture_half_float:any = null;
    static readonly OES_texture_float:any = null;
    static readonly OES_element_index_uint:any = null;
    static readonly EXT_blend_minmax:any = null;
    static readonly WEBGL_depth_texture:any = null;
    static readonly WEBGL_debug_renderer_info:any = null;
    static Initialize(webVer:number, gl:any):void
    {
        let selfT:any = this;
        if(webVer == 1)
        {
            //#extension OES_standard_derivatives : enable
            selfT.OES_standard_derivatives = gl.getExtension('OES_standard_derivatives');
            if(selfT.OES_standard_derivatives != null)
            console.log("Use OES_standard_derivatives Extension success!");
            else
            console.log("OES_standard_derivatives Extension can not support!");
            //#extension GL_EXT_shader_texture_lod : enable, for example: textureCubeLodEXT(envMap, dir, mipLv)
            // vec4 texture2DLodEXT(sampler2D sampler, vec2 coord, float lod)
            // vec4 texture2DProjLodEXT(sampler2D sampler, vec3 coord, float lod)
            // vec4 texture2DProjLodEXT(sampler2D sampler, vec4 coord, float lod)
            // vec4 textureCubeLodEXT(samplerCube sampler, vec3 coord, float lod)
            // vec4 texture2DGradEXT(sampler2D sampler, vec2 P, vec2 dPdx, vec2 dPdy)
            // vec4 texture2DProjGradEXT(sampler2D sampler, vec3 P, vec2 dPdx, vec2 dPdy)
            // vec4 texture2DProjGradEXT(sampler2D sampler, vec4 P, vec2 dPdx, vec2 dPdy)
            // vec4 textureCubeGradEXT(samplerCube sampler, vec3 P, vec3 dPdx, vec3 dPdy)
            selfT.EXT_shader_texture_lod = gl.getExtension('EXT_shader_texture_lod');
            if(selfT.EXT_shader_texture_lod != null)
            console.log("Use EXT_shader_texture_lod Extension success!");
            else
            console.log("EXT_shader_texture_lod Extension can not support!");
/*
<script type="x-shader/x-fragment">
#extension GL_EXT_shader_texture_lod : enable
#extension GL_OES_standard_derivatives : enable

uniform sampler2D myTexture;
varying vec2 texcoord;

void main(){
  gl_FragColor = texture2DGradEXT(myTexture, mod(texcoord, vec2(0.1, 0.5)),
                                  dFdx(texcoord), dFdy(texcoord));
}
</script>
*/
            selfT.WEBGL_draw_buffers = gl.getExtension('WEBGL_draw_buffers');
            if(selfT.WEBGL_draw_buffers != null)
            console.log("Use WEBGL_draw_buffers Extension success!");
            else
            console.log("WEBGL_draw_buffers Extension can not support!");
            //DivLog.ShowLog("selfT.WEBGL_draw_buffers != null: "+(selfT.WEBGL_draw_buffers != null));

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
            
            selfT.OES_texture_half_float = gl.getExtension('OES_texture_half_float');
            if(selfT.OES_texture_half_float != null)
            console.log("Use OES_texture_half_float Extension success!");
            else
            console.log("OES_texture_half_float Extension can not support!");

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
            //EXT_blend_minmax
            selfT.EXT_blend_minmax = gl.getExtension('EXT_blend_minmax');
            if(selfT.EXT_blend_minmax != null)
            console.log("Use EXT_blend_minmax Extension success!");
            else
            console.log("EXT_blend_minmax Extension can not support!");
        }
        else
        {
            //  selfT.OES_standard_derivatives = gl.getExtension('OES_standard_derivatives');
            //  if(selfT.OES_standard_derivatives != null)
            //  console.log("Use OES_standard_derivatives Extension success!");
            //  else
            //  console.log("OES_standard_derivatives Extension can not support!");

            selfT.EXT_shader_texture_lod = gl.getExtension('EXT_shader_texture_lod');
            if(selfT.EXT_shader_texture_lod != null)
            console.log("Use EXT_shader_texture_lod Extension success!");
            else
            console.log("EXT_shader_texture_lod Extension can not support!");

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
        selfT.WEBGL_depth_texture = gl.getExtension('WEBGL_depth_texture');
        if(selfT.WEBGL_depth_texture != null)
        console.log("Use WEBGL_depth_texture Extension success!");
        else
        console.log("WEBGL_depth_texture Extension can not support!");
        selfT.WEBGL_debug_renderer_info = gl.getExtension('WEBGL_debug_renderer_info');
        if(selfT.WEBGL_debug_renderer_info != null)
        console.log("Use WEBGL_debug_renderer_info Extension success!");
        else
        console.log("WEBGL_debug_renderer_info Extension can not support!");
        //
        //console.log("RCExtension.WEBGL_depth_texture: ",RCExtension.WEBGL_depth_texture);
    }
}
export default RCExtension;