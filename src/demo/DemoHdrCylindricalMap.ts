
import RendererDeviece from "../vox/render/RendererDeviece";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import { TextureConst } from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureProxy from "../vox/texture/ImageTextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import HdrClyMapMaterial from "./material/HdrClyMapMaterial";
import Vector3D from "../vox/math/Vector3D";
import URLTool from "../vox/utils/URLTool";
import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";


export namespace demo {
    export class DemoHdrCylindricalMap {
        constructor() { }

        private m_rscene: RendererScene = null;
        private m_rcontext: RendererInstanceContext = null;
        private m_texLoader: ImageTextureLoader = null;
        private m_camTrack: CameraTrack = null;
        private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
        private m_profileInstance: ProfileInstance = new ProfileInstance();
        private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
        
        private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
            let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        initialize(): void {
            console.log("DemoHdrCylindricalMap::initialize()......");
            if (this.m_rscene == null) {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
                let purl: string = 'https://lt3d.oss-cn-hangzhou.aliyuncs.com/vr/HP8JkiCBwDeJ2XzH3FAY.pto?reawe=5.fg';
                let fileSuffix: any = URLTool.GetURLFileSuffix(purl);
                console.log("fileSuffix: ", fileSuffix);

                let rparam: RendererParam = new RendererParam();
                //rparam.setCamPosition(800.0,800.0,800.0);
                rparam.setCamPosition(10.0, 100.0, 1800.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam, 3);
                this.m_rscene.updateCamera();
                this.m_rcontext = this.m_rscene.getRendererContext();
                this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
                
                this.m_rscene.enableMouseEvent(true);
                this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());

                this.m_profileInstance.initialize(this.m_rscene.getRenderer());
                this.m_statusDisp.initialize("rstatus", this.m_rscene.getStage3D().viewWidth - 200);

                this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

                let axis: Axis3DEntity = new Axis3DEntity();
                axis.initialize(300.0);
                this.m_rscene.addEntity(axis);

                let v3: Vector3D = new Vector3D();
                this.m_rscene.getCamera().getInvertViewMatrix().transformVector3Self(v3);
                console.log("v3: ", v3);
                //  // add common 3d display entity
                //  let plane:Plane3DEntity = new Plane3DEntity();
                //  plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
                //  this.m_rscene.addEntity(plane);
                //  this.m_targets.push(plane);
                //  //this.m_disp = plane;

                let material: HdrClyMapMaterial = new HdrClyMapMaterial();
                material.initializeByCodeBuf(true);
                let sph: Sphere3DEntity = new Sphere3DEntity();
                sph.setMaterial(material);

                //sph.initialize(200.0,20,20,[this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
                sph.initialize(200.0, 20, 20, [this.getImageTexByUrl("static/assets/hdr/night_free_Bg.jpg")]);
                this.m_rscene.addEntity(sph);
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
            let pcontext: RendererInstanceContext = this.m_rcontext;
            this.m_statusDisp.statusInfo = "/" + pcontext.getTextureResTotal() + "/" + pcontext.getTextureAttachTotal();

            this.m_rscene.update();
            this.m_statusDisp.render();
        }
        run(): void {
            this.m_statusDisp.update(false);

            this.m_stageDragSwinger.runWithYAxis();
            
            this.m_rscene.run(true);

            //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            this.m_profileInstance.run();
        }
    }
}