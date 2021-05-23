
import RendererDeviece from "../vox/render/RendererDeviece";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import { TextureConst } from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import RendererState from "../vox/render/RendererState";
import RenderProxy from "../vox/render/RenderProxy";

export namespace demo {
    export class DemoStencil {
        constructor() { }

        private m_rscene: RendererScene = null;
        private m_rcontext: RendererInstanceContext = null;
        private m_texLoader: ImageTextureLoader = null;
        private m_camTrack: CameraTrack = null;
        private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
        private m_profileInstance: ProfileInstance = new ProfileInstance();
        private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
        private m_material:any = null;
        private m_entity:DisplayEntity = null;
        private m_renderProxy:RenderProxy = null;
        private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
            let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        initialize(): void {
            console.log("DemoStencil::initialize()......");
            if (this.m_rscene == null) {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
                let rparam: RendererParam = new RendererParam();
                rparam.setCamPosition(800.0,800.0,800.0);
                rparam.setAttriAntialias( true );
                rparam.setAttriStencil(true);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam, 3);
                this.m_rscene.updateCamera();
                this.m_rcontext = this.m_rscene.getRendererContext();
                this.m_renderProxy = this.m_rcontext.getRenderProxy();

                this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
                
                this.m_rscene.enableMouseEvent(true);
                this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());

                this.m_profileInstance.initialize(this.m_rscene.getRenderer());
                this.m_statusDisp.initialize("rstatus", this.m_rscene.getStage3D().viewWidth - 200);

                this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

                let axis: Axis3DEntity = new Axis3DEntity();
                axis.initialize(500.0);
                this.m_rscene.addEntity(axis,1);

                // add common 3d display entity
                let plane:Plane3DEntity = new Plane3DEntity();
                plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
                this.m_rscene.addEntity(plane,0);
                let sph: Sphere3DEntity = new Sphere3DEntity();
                //sph.initialize(200.0,20,20,[this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
                sph.initialize(200.0, 20, 20, [this.getImageTexByUrl("static/assets/default.jpg")]);
                this.m_rscene.addEntity(sph,2);

                this.m_entity = sph;
                this.m_material = sph.getMaterial() as any;

                this.update();

            }
        }
        private mouseDown(evt: any): void {
            console.log("mouse down... ...");
        }

        private m_timeoutId: any = -1;
        private update(): void {
            if (this.m_timeoutId > -1) {
                clearTimeout(this.m_timeoutId);
            }
            //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
            this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps

            this.m_statusDisp.render();
        }
        
        run(): void {
            this.m_statusDisp.update(false);
            
            let gl:any = this.m_renderProxy.RContext;
            this.m_stageDragSwinger.runWithYAxis();
            //this.m_rscene.run(true);
            this.m_rscene.runBegin();
            this.m_rscene.update();
            RendererState.SetStencilMask(0x00);
            this.m_rscene.runAt(0);
            this.m_rscene.runAt(1);

            let scale:number = 1.0;
            RendererState.SetStencilOp(gl.KEEP, gl.KEEP, gl.REPLACE); 

            RendererState.SetStencilFunc(gl.ALWAYS, 1, 0xFF); 
            RendererState.SetStencilMask(0xFF);

            this.m_material.setRGB3f(1.0,1.0,1.0);
            this.m_entity.setScaleXYZ(scale,scale,scale);
            this.m_entity.update();

            this.m_rscene.runAt(2);

            RendererState.SetStencilFunc(gl.NOTEQUAL, 1, 0xFF); 
            RendererState.SetStencilMask(0x00);
            
            //RendererState.SetDepthTestEnable( false );

            scale = 1.02;
            this.m_entity.setScaleXYZ(scale,scale,scale);
            this.m_entity.update();
            this.m_material.setRGB3f(20.0,0.0,0.0);
            this.m_rscene.runAt(2);

            //RendererState.SetDepthTestEnable( true );

            this.m_rscene.runEnd();

            RendererState.SetStencilMask(0xFF);
            //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            this.m_profileInstance.run();
        }
    }
}