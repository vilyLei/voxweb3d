
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import Stage3D from "../vox/display/Stage3D";

import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import Cylinder3DEntity from "../vox/entity/Cylinder3DEntity";
import Billboard3DEntity from "../vox/entity/Billboard3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import { EntityDispQueue } from "./base/EntityDispQueue";
import CubeMapMaterial from "../vox/material/mcase/CubeMapMaterial";
import CameraBase from "../vox/view/CameraBase";

export class DemoTexture {
    constructor() {
    }
    private m_renderer: RendererInstance = null;
    private m_rcontext: RendererInstanceContext = null;
    private m_texLoader: ImageTextureLoader;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_equeue: EntityDispQueue = new EntityDispQueue();
    private m_followEntity: DisplayEntity = null;
    private m_testTex0: TextureProxy = null;
    private m_testTex1: TextureProxy = null;
    initialize(): void {
        console.log("DemoTexture::initialize()......");
        if (this.m_rcontext == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            let tex0: TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/fruit_01.jpg");
            let tex1: TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/default.jpg");
            let tex2: TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/guangyun_H_0007.png");
            tex0.mipmapEnabled = true;
            tex0.setWrap(TextureConst.WRAP_REPEAT);
            tex1.mipmapEnabled = true;
            tex1.setWrap(TextureConst.WRAP_REPEAT);
            tex2.mipmapEnabled = true;
            tex2.setWrap(TextureConst.WRAP_REPEAT);
            this.m_testTex0 = tex0;
            this.m_testTex1 = tex1;

            this.m_statusDisp.initialize();
            let rparam: RendererParam = new RendererParam();
            rparam.setCamProject(45.0, 50.0, 5000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);
            this.m_renderer = new RendererInstance();
            this.m_renderer.initialize(rparam, new CameraBase());
            this.m_rcontext = this.m_renderer.getRendererContext() as any;
            let stage3D: Stage3D = this.m_rcontext.getStage3D() as Stage3D;
            stage3D.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseUpListener);
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

            RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
            RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.uuid = "axis";
            axis.initialize(300.0);
            axis.setXYZ(100.0, 0.0, 100.0);
            this.m_renderer.addEntity(axis);

            let plane: Plane3DEntity = new Plane3DEntity();
            plane.uuid = "plane";
            plane.showDoubleFace();
            plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [tex0]);
            this.m_renderer.addEntity(plane);
            this.m_followEntity = plane;
            //return;
            //plane.setRenderStateByName("ADD01");

            //  let urls:string[] = [
            //      "static/assets/hw_morning/morning_ft.jpg",
            //      "static/assets/hw_morning/morning_bk.jpg",
            //      "static/assets/hw_morning/morning_up.jpg",
            //      "static/assets/hw_morning/morning_dn.jpg",
            //      "static/assets/hw_morning/morning_rt.jpg",
            //      "static/assets/hw_morning/morning_lf.jpg"
            //  ];
            //  let cubeTex0:TextureProxy = this.m_texLoader.getCubeTexAndLoadImg("cubeMap",urls);
            //  cubeTex0.mipmapEnabled = true;
            //  //tex0.setWrap(TextureConst.WRAP_REPEAT);
            //  let boxCubeMap:Box3DEntity = new Box3DEntity();
            //  boxCubeMap.name = "boxCubeMap";
            //  boxCubeMap.useGourandNormal();
            //  boxCubeMap.setMaterial(new CubeMapMaterial());
            //  boxCubeMap.initialize(new Vector3D(-300.0,-300.0,-300.0),new Vector3D(300.0,300.0,300.0),[cubeTex0]);
            //  this.m_renderer.addEntity(boxCubeMap);
            //  return;
            let i: number = 0;
            for (; i < 15; ++i) {
                let billboard: Billboard3DEntity = new Billboard3DEntity();
                billboard.uuid = "billboard";
                billboard.toBrightnessBlend();
                billboard.initialize(100.0, 100.0, [tex2]);
                billboard.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
                billboard.setFadeFactor(Math.random());
                this.m_renderer.addEntity(billboard);
                this.m_equeue.addBillEntity(billboard, false);
            }


            ///*

            axis = new Axis3DEntity();
            axis.uuid = "axis";
            axis.initialize(600.0);
            this.m_renderer.addEntity(axis);
            axis = new Axis3DEntity();
            axis.uuid = "axis";
            axis.initialize(50.0);
            axis.setXYZ(0, 300.0, 0);
            this.m_renderer.addEntity(axis);

            let srcBox: Box3DEntity = new Box3DEntity();
            srcBox.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
            let box: Box3DEntity = null;
            for (i = 0; i < 2; ++i) {
                box = new Box3DEntity();
                box.uuid = "box_" + i;
                box.setMesh(srcBox.getMesh());
                box.initialize(null, null, [tex1]);
                box.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
                this.m_renderer.addEntity(box);
            }
            for (i = 0; i < 2; ++i) {
                let sphere: Sphere3DEntity = new Sphere3DEntity();
                sphere.uuid = "sphere";
                sphere.initialize(50.0, 15, 15, [tex1]);
                sphere.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
                this.m_renderer.addEntity(sphere);
            }

            let axisB: Axis3DEntity = new Axis3DEntity();
            axisB.uuid = "axisB";
            axisB.initialize(50.0);
            axisB.setXYZ(-300.0, 0.0, -300.0);
            this.m_renderer.addEntity(axisB);

            for (i = 0; i < 2; ++i) {
                let cylinder: Cylinder3DEntity = new Cylinder3DEntity();
                cylinder.uuid = "cylinder";
                cylinder.initialize(30, 80, 15, [tex0]);
                cylinder.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
                this.m_renderer.addEntity(cylinder);
            }

            let axisC: Axis3DEntity = new Axis3DEntity();
            axisC.uuid = "axisC";
            axisC.initialize(50.0);
            axisC.setXYZ(300.0, 0.0, 300.0);
            this.m_renderer.addEntity(axisC);
            //*/

        }
    }
    private m_runFlag: number = 1;
    mouseUpListener(evt: any): void {
        //this.m_runFlag = 1;
        //  if(this.m_followEntity.isRenderEnabled())
        //  {
        //      this.m_renderer.removeEntity(this.m_followEntity);
        //  }
        //  else
        //  {
        //      this.m_renderer.addEntity(this.m_followEntity);
        //  }
        //this.m_testTex0.setDataFromImage(this.m_testTex1.getImageData());
        if (this.m_runFlag > 0) {
            this.m_runFlag = 0;
            this.m_followEntity.setTextureList([this.m_testTex1]);
        }
        else {
            this.m_runFlag = 1;
            this.m_followEntity.setTextureList([this.m_testTex0]);
        }
    }
    run(): void {
        if (this.m_runFlag < 1) {
            //return;
        }
        //--this.m_runFlag;
        //TextureRenderObj
        this.m_statusDisp.statusInfo = "/" + this.m_rcontext.getTextureAttachTotal();
        this.m_equeue.run();
        this.m_statusDisp.update();

        //console.log("##-- begin");
        this.m_rcontext.setClearRGBColor3f(0.0, 0.5, 0.0);
        //this.m_rcontext.setClearRGBAColor4f(0.0, 0.5, 0.0,0.0);
        this.m_rcontext.renderBegin();

        this.m_renderer.update();
        this.m_renderer.run();

        this.m_rcontext.runEnd();
        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);;
        this.m_rcontext.updateCamera();

        //  //console.log("#---  end");
    }
}
export default DemoTexture;
