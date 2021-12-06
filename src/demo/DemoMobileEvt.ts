
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import Stage3D from "../vox/display/Stage3D";

import H5FontSystem from "../vox/text/H5FontSys";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import ObjData3DEntity from "../vox/entity/ObjData3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import DivLog from "../vox/utils/DivLog";
import MouseEvent from "../vox/event/MouseEvent";
import MouseEvt3DDispatcher from "../vox/event/MouseEvt3DDispatcher";
import BoxFrame3D from "../vox/entity/BoxFrame3D";
import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import Color4 from "../vox/material/Color4";
import DisplayEntityContainer from "../vox/entity/DisplayEntityContainer";

class DispCtrObj {
    constructor() { }
    static CurrDisp: DispCtrObj = null;
    name: string = "";
    rscene: RendererScene = null;
    private m_frameDisp: BoxFrame3D = null;

    static DeselectAll(): void {
        let list: BoxFrame3D[] = DispCtrObj.FrameDispList;
        for (let i: number = 0; i < list.length; ++i) {
            list[i].setVisible(false);
        }
    }
    static FrameDispList: BoxFrame3D[] = [];
    createDisp(evt: any): void {
        if (this.rscene != null && this.m_frameDisp == null) {
            //console.log("create frameDisp...",evt.target.getGlobalBounds().min,evt.target.getGlobalBounds().max);
            let boxFrame: BoxFrame3D = new BoxFrame3D(true);
            boxFrame.initialize(evt.target.getGlobalBounds().min, evt.target.getGlobalBounds().max);
            boxFrame.setScaleXYZ(1.02, 1.02, 1.02);
            this.rscene.addEntity(boxFrame);
            DispCtrObj.FrameDispList.push(boxFrame);
            this.m_frameDisp = boxFrame;
            //DivLog.ShowLog("create frame."+evt.target.name);
        }
    }
    mouseMoveListener(evt: any): void {
        //this.createDisp(evt);
        if (this.m_frameDisp != null) {
            //this.m_frameDisp.setRGB3f(Math.random() * 1.1,Math.random() * 1.1,Math.random() * 1.1);
        }
    }
    mouseOverListener(evt: any): void {
        //  this.createDisp(evt);
        //  //console.log(this.name+", mouse over. this.m_frameDisp != null: "+(this.m_frameDisp != null));
        //  if(this.m_frameDisp != null)
        //  {
        //      //this.m_frameDisp.setVisible(true);
        //  }
    }
    mouseOutListener(evt: any): void {
        //  //console.log(this.name+", mouse out. this.m_frameDisp != null: "+(this.m_frameDisp != null));
        //  if(this.m_frameDisp != null)
        //  {
        //      this.m_frameDisp.setVisible(false);
        //  }
    }
    mouseDownListener(evt: any): void {
        //DivLog.ShowLog("mouseDown "+evt.target.name+",name: "+this.name);
        console.log("mouseDown " + evt.target.name + ",name: " + this.name);
        this.createDisp(evt);
        //console.log("DispCtrObj::mouseDownListener call.");
        let list: BoxFrame3D[] = DispCtrObj.FrameDispList;
        for (let i: number = 0; i < list.length; ++i) {
            if (this.m_frameDisp != list[i]) {
                list[i].setVisible(false);
            }
            else if (list[i] != null) {
                list[i].setVisible(true);
                list[i].setRGB3f(Math.random() * 1.1, Math.random() * 1.1, Math.random() * 1.1);
                //DivLog.ShowLog("list "+i);
            }
        }
        //DispCtrObj.CurrDisp = this;
        //this.m_frameDisp.setRGB3f(Math.random() * 1.1,Math.random() * 1.1,Math.random() * 1.1);
        //console.log("evt.wpos: "+evt.wpos.toString());

        let axis: Axis3DEntity = new Axis3DEntity();
        if (DispCtrObj.s_axis != null) {
            axis.setMesh(DispCtrObj.s_axis.getMesh());
            axis.setMaterial(DispCtrObj.s_axis.getMaterial());
            axis.initializeCross(70.0);
        }
        else {
            axis.initializeCross(70.0);
            DispCtrObj.s_axis = axis;
        }
        axis.setPosition(evt.wpos);
        this.rscene.addEntity(axis);
    }
    private static s_axis: Axis3DEntity = null;

    mouseUpListener(evt: any): void {
    }
    destory(): void {
        this.rscene = null;
        this.m_frameDisp = null;
        DivLog.ShowLog("destory list fDisp = null" + (this.m_frameDisp == null));
    }
}
export class DemoMobileEvt {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_rcontext: RendererInstanceContext = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    private m_profileInstance: ProfileInstance;
    getImageTexByUrl(purl: string): TextureProxy {
        return this.m_texLoader.getImageTexByUrl(purl);
    }
    private initMobileEvt(): void {
        let stage3D: Stage3D = this.m_rscene.getStage3D() as Stage3D;
        stage3D.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
        stage3D.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener);
        stage3D.addEventListener(MouseEvent.MOUSE_MOVE, this, this.mouseMoveListener);

        stage3D.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.test_bgmouseDownListener);
        stage3D.addEventListener(MouseEvent.MOUSE_BG_UP, this, this.test_bgmouseUpListener);

    }
    mouseDownListener(evt: any): void {
        console.log("mouseDown...");
    }
    mouseUpListener(evt: any): void {
        console.log("mouseUP...");
    }
    mouseMoveListener(evt: any): void {
        //console.log("mouseDown...");
        //this.m_rscene.setClearRGBColor3f(Math.random(), 0, Math.random());
    }

    private test_bgmouseDownListener(evt: any): void {
        console.log("test_bgmouseDownListener");
        //this.m_rscene.setClearRGBColor3f(Math.random() * 0.3, 0, Math.random() * 0.3);
        //this.m_clearColor.randomRGB();
        DispCtrObj.DeselectAll();
    }
    private test_bgmouseUpListener(evt: any): void {
        console.log("test_bgmouseUpListener");
    }
    private test_bgmouseMoveListener(evt: any): void {
        console.log("test_bgmouseMoveListener");
    }
    private m_clearColor: Color4 = new Color4(0.1, 0.2, 0.1, 1.0);

    initialize(): void {
        console.log("DemoMobileEvt::initialize()......");
        if (this.m_rscene == null) {
            //H5FontSystem.GetInstance().initialize("fontTex",18, 512,512,false,false);
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            DivLog.SetDebugEnabled(false);

            let rparam: RendererParam = new RendererParam();
            rparam.maxWebGLVersion = 1;
            rparam.setCamProject(45, 0.1, 6000.0);
            rparam.setCamPosition(1100.0, 1100.0, 1100.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            this.m_rcontext = this.m_rscene.getRendererContext();
            this.m_profileInstance = new ProfileInstance();
            if (this.m_profileInstance != null) this.m_profileInstance.initialize(this.m_rscene.getRenderer());

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            let tex0: TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
            let tex1: TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
            let tex2: TextureProxy = this.getImageTexByUrl("static/assets/color_01.jpg");

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);

            let srcBox: Box3DEntity = new Box3DEntity();
            srcBox.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
            let i: number = 0;
            ///*
            for (i = 0; i < 2; ++i) {
                let box: Box3DEntity = new Box3DEntity();
                box.name = "box_" + i;
                box.setMesh(srcBox.getMesh());
                box.setMaterial(srcBox.getMaterial());
                box.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
                //box.setXYZ(800 * Math.random() - 400.0,800 * Math.random() - 400.0,800 * Math.random() - 400.0);
                box.setXYZ(400.0 * (i - 1), 0, 0);
                box.setRotationXYZ(Math.random() * 360.0, Math.random() * 360.0, Math.random() * 360.0);
                this.useEntityEvtDispatcher(box);
                this.m_rscene.addEntity(box);
            }
            for (i = 0; i < 2; ++i) {
                let sph: Sphere3DEntity = new Sphere3DEntity();
                sph.name = "sph_" + i;
                sph.initialize(150, 20, 20, [tex1]);
                sph.setXYZ(800 * Math.random() - 400.0, 800 * Math.random() - 400.0, 800 * Math.random() - 400.0);
                this.useEntityEvtDispatcher(sph);
                this.m_rscene.addEntity(sph);
            }
            //*/
            ///*
            // container mouse event test
            for (i = 0; i < 2; ++i) {
                let box: Box3DEntity = new Box3DEntity();
                box.name = "box_" + i * 10;
                box.setMesh(srcBox.getMesh());
                box.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex0]);
                box.setXYZ(400.0 * (i - 1), 0, 300);
                box.setRotationXYZ(Math.random() * 360.0,  Math.random() * 360.0, Math.random() * 360.0);
                box.mouseEnabled = true;
                box.update();
                let container: DisplayEntityContainer = new DisplayEntityContainer();
                container.addEntity(box);
                box = new Box3DEntity();
                box.name = "box_" + i*10+1;
                box.setMesh(srcBox.getMesh());
                box.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex2]);
                box.setXYZ(400.0 * (i - 1), 0, 450);
                box.setScaleXYZ(0.5,0.5,0.5);
                box.setRotationXYZ(Math.random() * 360.0,  Math.random() * 360.0, Math.random() * 360.0);
                box.mouseEnabled = true;
                box.update();
                container.addEntity(box);
                this.m_rscene.addContainer(container);
                console.log("test...............>>>...........");
                // container.update();
                // container.update();
                // container.update();
                this.useContainerEvtDispatcher(container);
            }
            /*
            let objUrl: string = "static/assets/obj/box01.obj";
            objUrl = "static/assets/obj/building_001.obj";
            let objDisp: ObjData3DEntity = new ObjData3DEntity();
            objDisp.moduleScale = 3.0;
            objDisp.name = "objDisp_" + 0;
            objDisp.initializeByObjDataUrl(objUrl, [tex1]);

            objDisp.setXYZ(800 * Math.random() - 400.0, 800 * Math.random() - 400.0, 800 * Math.random() - 400.0);
            this.useEntityEvtDispatcher(objDisp);
            this.m_rscene.addEntity(objDisp);
            //*/
            this.initMobileEvt();
            this.m_rscene.setClearColor(this.m_clearColor);
        }
    }
    private useEntityEvtDispatcher(entity: DisplayEntity, frameBoo: boolean = false): void {
        let ctrObj: DispCtrObj = new DispCtrObj();
        ctrObj.name = entity.name + "_entity";
        ctrObj.rscene = this.m_rscene;
        let dispatcher: MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
        dispatcher.addEventListener(MouseEvent.MOUSE_DOWN, ctrObj, ctrObj.mouseDownListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_UP, ctrObj, ctrObj.mouseUpListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_OVER, ctrObj, ctrObj.mouseOverListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_OUT, ctrObj, ctrObj.mouseOutListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_MOVE, ctrObj, ctrObj.mouseMoveListener);
        entity.setEvtDispatcher(dispatcher);
        entity.mouseEnabled = true;
        if (frameBoo) {
            ctrObj.createDisp({ target: entity });
        }
    }
    private m_containerIndex: number = 0;
    private useContainerEvtDispatcher(entity: DisplayEntityContainer, frameBoo: boolean = false): void {
        let ctrObj: DispCtrObj = new DispCtrObj();
        ctrObj.name = entity.name + "_container_" + this.m_containerIndex++;
        ctrObj.rscene = this.m_rscene;
        let dispatcher: MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
        dispatcher.addEventListener(MouseEvent.MOUSE_DOWN, ctrObj, ctrObj.mouseDownListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_UP, ctrObj, ctrObj.mouseUpListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_OVER, ctrObj, ctrObj.mouseOverListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_OUT, ctrObj, ctrObj.mouseOutListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_MOVE, ctrObj, ctrObj.mouseMoveListener);
        entity.setEvtDispatcher(dispatcher);
        entity.mouseEnabled = true;
        if (frameBoo) {
            ctrObj.createDisp({ target: entity });
        }
    }
    run(): void {
        //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

        this.m_rscene.run(true);

        if (this.m_profileInstance != null) this.m_profileInstance.run();
    }
}
export default DemoMobileEvt;