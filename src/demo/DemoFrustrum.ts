
import Vector3D from "../vox/math/Vector3D";
import MathConst from "../vox/math/MathConst";
import RendererDeviece from "../vox/render/RendererDeviece";
import {RenderBlendMode,CullFaceMode,DepthTestMode} from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import Stage3D from "../vox/display/Stage3D";
import CameraBase from "../vox/view/CameraBase";

import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import DashedLine3DEntity from "../vox/entity/DashedLine3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import {TextureConst,} from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import TextureBlock from "../vox/texture/TextureBlock";
import CameraTrack from "../vox/view/CameraTrack";

export namespace demo
{
    export class DemoFrustrum
    {
        constructor()
        {
        }
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texBlock:TextureBlock;
        private m_texLoader:ImageTextureLoader;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_tarDisp:Sphere3DEntity = null;
        initialize():void
        {
            console.log("DemoFrustrum::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                
                this.m_statusDisp.initialize("rstatus");
                let rparam:RendererParam = new RendererParam();
                rparam.setCamProject(45.0,10.0,3000.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                this.m_renderer = new RendererInstance();
                let stage:Stage3D = new Stage3D(this.m_renderer.getUid(),document);
                this.m_renderer.__$setStage3D(stage);
                this.m_renderer.initialize(rparam);
                this.m_rcontext = this.m_renderer.getRendererContext();
                let stage3D:Stage3D = this.m_rcontext.getStage3D() as Stage3D;
                if(stage3D != null)stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
                
                this.m_texBlock = new TextureBlock();
                this.m_texBlock.setRenderer(this.m_renderer);
                this.m_texLoader = new ImageTextureLoader(this.m_texBlock);

                let tex0:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/broken_iron.jpg");
                let tex2:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/assets/guangyun_H_0007.png");
                let tex3:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/assets/flare_core_02.jpg");
                tex0.mipmapEnabled = true;
                tex0.setWrap(TextureConst.WRAP_REPEAT);
                tex1.mipmapEnabled = true;
                tex1.setWrap(TextureConst.WRAP_REPEAT);
                tex2.mipmapEnabled = true;
                tex2.setWrap(TextureConst.WRAP_REPEAT);
                tex3.mipmapEnabled = true;

                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.ALWAYS);
                
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.name = "axis";
                axis.initialize(300.0);
                axis.setXYZ(100.0,0.0,100.0);
                this.m_renderer.addEntity(axis);

                let camera0:CameraBase = new CameraBase(0);
                camera0.lookAtRH(new Vector3D(-500.0,500.0,500.0), new Vector3D(0.0,0.0,0.0), new Vector3D(0.0,1.0,0.0));
                camera0.perspectiveRH(MathConst.DegreeToRadian(45.0),600.0/500.0,150.1,600.0);
                camera0.update();

                let pvs:Vector3D[] = camera0.getWordFrustumVtxArr();

                let fruLine:DashedLine3DEntity = new DashedLine3DEntity();
                fruLine.initializeBySegmentLine([pvs[0],pvs[1],pvs[1],pvs[2],pvs[2],pvs[3],pvs[3],pvs[0]]);
                fruLine.setRGB3f(1.0,0.0,1.0);
                this.m_renderer.addEntity(fruLine);

                fruLine = new DashedLine3DEntity();
                fruLine.initializeBySegmentLine([pvs[4],pvs[5],pvs[5],pvs[6],pvs[6],pvs[7],pvs[7],pvs[4]]);
                fruLine.setRGB3f(0.0,0.5,1.0);
                this.m_renderer.addEntity(fruLine);
                
                fruLine = new DashedLine3DEntity();
                fruLine.initializeBySegmentLine([pvs[0],pvs[4],pvs[1],pvs[5],pvs[2],pvs[6],pvs[3],pvs[7]]);
                fruLine.setRGB3f(0.0,0.9,0.0);
                this.m_renderer.addEntity(fruLine);

                this.m_tarDisp = new Sphere3DEntity();
                this.m_tarDisp.initialize(50.0,30,30,[tex1]);
                this.m_tarDisp.setXYZ(0.0,0.0,0.0);
                this.m_renderer.addEntity(this.m_tarDisp);
            }
        }
        mouseDownListener(evt:any):void
        {
            console.log("mouseUpListener call, this.m_renderer: "+this.m_renderer.toString());
        }
        run():void
        {
            this.m_statusDisp.update();

            this.m_rcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
            this.m_rcontext.renderBegin();

            this.m_renderer.update();
            this.m_renderer.run();

            this.m_rcontext.runEnd();            
            this.m_camTrack.rotationOffsetAngleWorldY(0.2);
            this.m_rcontext.updateCamera();
            
        }
    }
}