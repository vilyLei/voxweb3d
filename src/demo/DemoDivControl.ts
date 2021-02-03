
import * as DivLogT from "../vox/utils/DivLog";
import * as MathConstT from "../vox/utils/MathConst";
import * as Vector3DT from "../vox/geom/Vector3";
import * as Matrix4T from "../vox/geom/Matrix4";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as ShaderMaterialT from "../vox/material/mcase/ShaderMaterial";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as VtxBufConstT from "../vox/mesh/VtxBufConst";
import * as MouseEventT from "../vox/event/MouseEvent";

import * as Box3DMeshT from "../vox/mesh/Box3DMesh";
import * as DisplayEntityT from "../vox/entity/DisplayEntity";
import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as Cylinder3DEntityT from "../vox/entity/Cylinder3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureStoreT from "../vox/texture/TextureStore";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as ImageTexResLoaderT from "../vox/texture/ImageTexResLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as BaseTestMaterialT from "../demo/material/BaseTestMaterial";

import DivLog = DivLogT.vox.utils.DivLog;
import MathConst = MathConstT.vox.utils.MathConst;
import Vector3D = Vector3DT.vox.geom.Vector3D;
import Matrix4 = Matrix4T.vox.geom.Matrix4;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import ShaderMaterial = ShaderMaterialT.vox.material.mcase.ShaderMaterial;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import VtxNormalType = VtxBufConstT.vox.mesh.VtxNormalType;
import MouseEvent = MouseEventT.vox.event.MouseEvent;

import Box3DMesh = Box3DMeshT.vox.mesh.Box3DMesh;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import Cylinder3DEntity = Cylinder3DEntityT.vox.entity.Cylinder3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureStore = TextureStoreT.vox.texture.TextureStore;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import ImageTexResLoader = ImageTexResLoaderT.vox.texture.ImageTexResLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import BaseTestMaterial = BaseTestMaterialT.demo.material.BaseTestMaterial;

export namespace demo
{
    export class DemoDivControl
    {
        constructor()
        {
        }
        private m_rscene:RendererScene = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:ImageTexResLoader = new ImageTexResLoader();
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_tarEntity:DisplayEntity = null;
        getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        initialize():void
        {
            console.log("DemoDivControl::initialize()......");
            if(this.m_rcontext == null)
            {
                //DivLog.SetDebugEnabled(true);
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
                
                let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
                let tex1:TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
                //let div = document.getElementById("app");
                let div:HTMLElement = null;
                let rparam:RendererParam = new RendererParam(div);
                rparam.autoSyncRenderBufferAndWindowSize = false;
                rparam.maxWebGLVersion = 1;
                rparam.setCamPosition(500.0,500.0,500.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.updateCamera();
                this.m_rcontext = this.m_rscene.getRendererContext();
                this.m_rscene.getStage3D().addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

                this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 180);

                let transMat:Matrix4 = new Matrix4();
                //transMat.appendRotationEulerAngle(MathConst.DegreeToRadian(90.0),0.0,MathConst.DegreeToRadian(90.0));
                transMat.appendRotationEulerAngle(0.0,0.0,MathConst.DegreeToRadian(90.0));
                //transMat.setTranslationXYZ(-200.0,0.0,0.0);
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(300.0);
                this.m_rscene.addEntity(axis);

                let cly:Cylinder3DEntity = new Cylinder3DEntity();
                
                cly.setVtxTransformMatrix(transMat);
                cly.initialize(100.0,200.0,15,[tex1]);
                this.m_rscene.addEntity(cly);
                this.m_tarEntity = cly;
                //  // add rtt texture 3d display entity
                //  let boxRtt:Box3DEntity = new Box3DEntity();
                //  boxRtt.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[TextureStore.GetRTTTextureAt(0)]);
                //  this.m_rscene.addEntity(boxRtt, 1);

            }
        }
        private mouseDown():void
        {
            ///*
            this.m_rscene.getDiv().style.width = "600px";
            this.m_rscene.getDiv().style.height = "400px";

            //  this.m_div.style.width = "100%";
            //  this.m_div.style.height = "100%";
            this.m_rscene.updateRenderBufferSize();
            //*/
            console.log("mouse down.");
        }
        run():void
        {
            // show fps status
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