
import * as DivLogT from "../vox/utils/DivLog";
import * as MathConstT from "../vox/utils/MathConst";
import * as Vector3DT from "../vox/geom/Vector3";
import * as Matrix4T from "../vox/geom/Matrix4";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as ShaderMaterialT from "../vox/material/mcase/ShaderMaterial";
import * as Color4T from "../vox/material/Color4";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as VtxBufConstT from "../vox/mesh/VtxBufConst";

import * as Box3DMeshT from "../vox/mesh/Box3DMesh";
import * as DisplayEntityT from "../vox/entity/DisplayEntity";
import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as Billboard3DEntityT from "../vox/entity/Billboard3DEntity";
import * as Cylinder3DEntityT from "../vox/entity/Cylinder3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";

import * as ImageTextureLoaderT from "../vox/texture/ImageTextureLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as BaseTestMaterialT from "../demo/material/BaseTestMaterial";

import DivLog = DivLogT.vox.utils.DivLog;
import MathConst = MathConstT.vox.utils.MathConst;
import Vector3D = Vector3DT.vox.geom.Vector3D;
import Matrix4 = Matrix4T.vox.geom.Matrix4;
import Matrix4Pool = Matrix4T.vox.geom.Matrix4Pool;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import Color4 = Color4T.vox.material.Color4;
import ShaderMaterial = ShaderMaterialT.vox.material.mcase.ShaderMaterial;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import VtxNormalType = VtxBufConstT.vox.mesh.VtxNormalType;

import Box3DMesh = Box3DMeshT.vox.mesh.Box3DMesh;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import Billboard3DEntity = Billboard3DEntityT.vox.entity.Billboard3DEntity;
import Cylinder3DEntity = Cylinder3DEntityT.vox.entity.Cylinder3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import BaseTestMaterial = BaseTestMaterialT.demo.material.BaseTestMaterial;

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
        private m_matrixA:Matrix4 = Matrix4Pool.GetMatrix();

        getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
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

                this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 180);
//  
                //  this.m_texBlock = new TextureBlock();
                //  this.m_texBlock.setRenderer(this.m_rscene.getRenderer());
                this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );
                
                let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
                let tex1:TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
                let tex4:TextureProxy = this.getImageTexByUrl("static/assets/yanj.jpg");
                let tex5:TextureProxy = this.m_rscene.textureBlock.createRGBATex2D(16,16,new Color4(1.0,0.0,1.0));
                
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(300.0);
                this.m_rscene.addEntity(axis);

                //  // add common 3d display entity
                //  var plane:Plane3DEntity = new Plane3DEntity();
                //  //plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [tex4]);
                //  plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [tex5]);
                //  this.m_rscene.addEntity(plane);
                
                let transMat:Matrix4 = new Matrix4();
                //transMat.appendRotationEulerAngle(MathConst.DegreeToRadian(90.0),0.0,MathConst.DegreeToRadian(90.0));
                transMat.appendRotationEulerAngle(0.0,0.0,MathConst.DegreeToRadian(90.0));
                //transMat.setTranslationXYZ(-200.0,0.0,0.0);
                //  let mesh:Box3DMesh = new Box3DMesh();
                //  mesh.setTransformMatrix(transMat);
                //  mesh.vaoEnabled = true;
                //  mesh.m_normalType = VtxNormalType.FLAT;
                //  mesh.vbWholeDataEnabled = true;
                //  mesh.setBufSortFormat( material.getBufSortFormat() );
                //  mesh.initialize(new Vector3D(-50.0,-100.0,-100.0),new Vector3D(50.0,100.0,100.0));

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
    gl_FragColor = color4;
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

                let shdM:ShaderMaterial = new ShaderMaterial("testShdMaterial");
                shdM.setFragShaderCode(fragCode);
                shdM.setVtxShaderCode(vtxCode);
                shdM.addUniformDataAt("u_colors",new Float32Array([0.0,1.0,0.0,1.0, 800.0,600.0,0.0,0.0]));

                let material:BaseTestMaterial = new BaseTestMaterial();
                /*
                let material:BaseTestMaterial = new BaseTestMaterial();
                material.initializeByCodeBuf(true);
                let box:Box3DEntity = new Box3DEntity();
                //box.setMesh(mesh);
                box.setTransformMatrix(transMat);
                box.setMaterial(material);
                box.initialize(new Vector3D(-50.0,-100.0,-100.0),new Vector3D(50.0,100.0,100.0),[tex1]);
                this.m_rscene.addEntity(box);
                //*/
                let cly:Cylinder3DEntity = new Cylinder3DEntity();
                //cly.setMaterial(material);
                cly.setMaterial(shdM);
                cly.setVtxTransformMatrix(transMat);
                cly.initialize(100.0,200.0,15,[tex1]);
                this.m_rscene.addEntity(cly);
            }
        }
        run():void
        {
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