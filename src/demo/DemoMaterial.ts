
import * as RendererParamT from "../vox/scene/RendererParam";
import * as ShaderMaterialT from "../vox/material/mcase/ShaderMaterial";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Cylinder3DEntityT from "../vox/entity/Cylinder3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as ImageTextureLoaderT from "../vox/texture/ImageTextureLoader";

import RendererParam = RendererParamT.vox.scene.RendererParam;
import ShaderMaterial = ShaderMaterialT.vox.material.mcase.ShaderMaterial;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Cylinder3DEntity = Cylinder3DEntityT.vox.entity.Cylinder3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;

export namespace demo
{
    export class DemoMaterial
    {
        constructor(){}

        private m_rscene:RendererScene = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_uniformData:Float32Array = null;
        private m_time:number = 0;
        getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            return this.m_texLoader.getImageTexByUrl(purl);
        }
        
        private rendererInit():void
        {
            let rparam:RendererParam = new RendererParam();
            rparam.setCamPosition(800.0,800.0,800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam,3);
            this.m_rscene.updateCamera();
            this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );
        }
        initialize():void
        {
            this.rendererInit();

            let fragCode:string = 
`
precision mediump float;
uniform sampler2D u_sampler0;
uniform vec4 u_colors[2];
varying vec2 v_uvs;
void main()
{
    vec4 color4 = texture2D(u_sampler0, v_uvs);
    color4 *= u_colors[0];
    gl_FragColor = color4 * sin(u_colors[1]);
}
`;
            let vtxCode:string = 
`
precision mediump float;
attribute vec3 a_vs;
attribute vec2 a_uvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
varying vec2 v_uvs;
void main(){
    mat4 viewMat4 = u_viewMat * u_objMat;
    vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);
    gl_Position = u_projMat * viewPos;
    v_uvs = a_uvs;
}
`;
            this.m_uniformData = new Float32Array([0.0,1.0,1.0,1.0, 1.0,1.0,1.0,1.0]);
            let material:ShaderMaterial = new ShaderMaterial("testShaderMaterial");
            material.setFragShaderCode(fragCode);
            material.setVtxShaderCode(vtxCode);
            material.addUniformDataAt("u_colors", this.m_uniformData);

            let cly:Cylinder3DEntity = new Cylinder3DEntity();
            cly.setMaterial(material);
            cly.initialize(100.0,200.0,15,[this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
            this.m_rscene.addEntity(cly);

            let axis:Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);                
        }
        run():void
        {
            // 修改uniform数据
            this.m_time += 1.0;
            this.m_uniformData[0] = Math.abs(Math.sin(this.m_time * 0.01));
            this.m_uniformData[6] = Math.abs(Math.cos(this.m_time * 0.002));
            
            // load texture resource (资源分帧加载)
            this.m_texLoader.run();
            // run rendering process (执行渲染过程)         
            this.m_rscene.run();
        }
    }
}