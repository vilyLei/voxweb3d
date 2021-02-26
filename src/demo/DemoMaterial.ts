
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as Color4T from "../vox/material/Color4";
import * as ShaderMaterialT from "../vox/material/mcase/ShaderMaterial";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";

import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Cylinder3DEntityT from "../vox/entity/Cylinder3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";

import * as ImageTextureLoaderT from "../vox/texture/ImageTextureLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as RendererSceneT from "../vox/scene/RendererScene";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import Color4 = Color4T.vox.material.Color4;
import ShaderMaterial = ShaderMaterialT.vox.material.mcase.ShaderMaterial;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;

import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Cylinder3DEntity = Cylinder3DEntityT.vox.entity.Cylinder3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import RendererScene = RendererSceneT.vox.scene.RendererScene;

export namespace demo
{
    export class DemoMaterial
    {
        constructor()
        {
        }

        private m_rscene:RendererScene = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();

        getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        private m_uniformData:Float32Array = null;
        initialize():void
        {
            console.log("DemoMaterial::initialize()......");
            if(this.m_rcontext == null)
            {
                //DivLog.SetDebugEnabled(true);
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
                
                let rparam:RendererParam = new RendererParam();
                //rparam.maxWebGLVersion = 1;
                rparam.setCamPosition(800.0,800.0,800.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.updateCamera();
                this.m_rcontext = this.m_rscene.getRendererContext();
                
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

                this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 200);
                
                this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );
                
                let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
                let tex1:TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
                let tex4:TextureProxy = this.getImageTexByUrl("static/assets/yanj.jpg");
                let tex5:TextureProxy = this.m_rscene.textureBlock.createRGBATex2D(16,16,new Color4(1.0,0.0,1.0));
                
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(300.0);
                this.m_rscene.addEntity(axis);
                
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
                let material:ShaderMaterial = new ShaderMaterial("testShdMaterial");
                material.setFragShaderCode(fragCode);
                material.setVtxShaderCode(vtxCode);
                material.addUniformDataAt("u_colors", this.m_uniformData);

                let cly:Cylinder3DEntity = new Cylinder3DEntity();
                cly.setMaterial(material);
                cly.initialize(100.0,200.0,15,[tex1]);
                this.m_rscene.addEntity(cly);
            }
        }
        private m_time:number = 0;
        run():void
        {
            this.m_time += 1.0;
            this.m_uniformData[0] = Math.abs(Math.sin(this.m_time * 0.01));
            this.m_uniformData[6] = Math.abs(Math.cos(this.m_time * 0.002));
            let pcontext:RendererInstanceContext = this.m_rcontext;
            
            // show fps status
            this.m_statusDisp.statusInfo = "/"+pcontext.getTextureResTotal()+"/"+pcontext.getTextureAttachTotal();
            this.m_statusDisp.update();
            // 分帧加载
            this.m_texLoader.run();
            this.m_rscene.setClearRGBColor3f(0.0, 0.0, 0.0);
            // render begin
            this.m_rscene.runBegin();

            // run logic program
            this.m_rscene.update();
            this.m_rscene.run();

            // render end
            this.m_rscene.runEnd();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}