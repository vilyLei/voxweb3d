import RendererDeviece from "../vox/render/RendererDeviece";
import RendererParam from "../vox/scene/RendererParam";
import MouseEvent from "../vox/event/MouseEvent";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import H5FontSystem from "../vox/text/H5FontSys";
import Text2DEntity from "../vox2d/text/Text2DEntity";

export namespace demo
{
    export class DemoText2D
    {
        constructor(){}

        private m_rscene:RendererScene = null;
        private m_camTrack:CameraTrack = null;

        initialize():void
        {
            console.log("DemoText2D::initialize()......");
            if(this.m_rscene == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
                
                let rparam:RendererParam = new RendererParam();
                rparam.setCamPosition(800.0,800.0,800.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.updateCamera();

                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());

                H5FontSystem.GetInstance().setRenderProxy(this.m_rscene.getRenderProxy());
                H5FontSystem.GetInstance().initialize("fontTex",18, 512,512,false,false);

                this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);

                let text2D:Text2DEntity = null;
                text2D = new Text2DEntity();
                text2D.initialize("2d text test.");
                text2D.setXY(200.0,300.0);
                this.m_rscene.addEntity(text2D);
                
            }
        }
        private mouseDown(evt:any):void
        {
        }
        run():void
        {
            this.m_rscene.run();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}