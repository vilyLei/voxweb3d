import RSEntityFlag from '../vox/scene/RSEntityFlag';
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import Billboard3DEntity from "../vox/entity/Billboard3DEntity";
import BoxFrame3D from "../vox/entity/BoxFrame3D";
import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import { TextureBlock } from "../vox/texture/TextureBlock";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import DisplayEntityContainer from "../vox/entity/DisplayEntityContainer";
import DecayBrnParticle from "../particle/base/DecayBrnParticle";
import CameraBase from '../vox/view/CameraBase';

import {EntityDispQueue} from "./base/EntityDispQueue";
export class DemoContainer {
    constructor() { }
    private m_renderer: RendererInstance = null;
    private m_rcontext: RendererInstanceContext = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_texBlock: TextureBlock = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_equeue: EntityDispQueue = new EntityDispQueue();
    private m_container: DisplayEntityContainer = null;
    private m_containerMain: DisplayEntityContainer = null;
    private m_followEntity: DisplayEntity = null;

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoContainer::initialize()......");
        if (this.m_rcontext == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;

            this.m_statusDisp.initialize();
            let rparam: RendererParam = new RendererParam();
            rparam.setMatrix4AllocateSize(8192);
            rparam.setCamProject(45.0, 0.1, 3000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);
            this.m_renderer = new RendererInstance();
            this.m_renderer.initialize(rparam, new CameraBase());
            this.m_renderer.appendProcess();
            this.m_rcontext = this.m_renderer.getRendererContext();
            
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());


            this.m_texBlock = new TextureBlock();
            this.m_texBlock.setRenderer(this.m_renderer.getRenderProxy());
            this.m_texLoader = new ImageTextureLoader(this.m_texBlock);

            let tex0: TextureProxy = this.getImageTexByUrl("static/assets/meBlurTest.jpg");
            let tex1: TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
            let tex2: TextureProxy = this.getImageTexByUrl("static/assets/guangyun_H_0007.png");
            //DecayBrnParticle.texs.push(tex2);
            RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
            RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);

            DecayBrnParticle.Initialize(200.0, [tex2], this.m_renderer);

            let scale: number = 1.0;
            let i: number = 0;

            let plane: Plane3DEntity = new Plane3DEntity();
            plane.name = "plane";
            plane.showDoubleFace();
            plane.initializeXOZ(-300.0, -300.0, 600.0, 600.0, [tex0]);

            let container: DisplayEntityContainer = new DisplayEntityContainer();
            container.addEntity(plane);

            container.setXYZ(100.0, 100.0, 100.0);
            //let cid:number = plane.__$contId;
            plane.__$rseFlag = RSEntityFlag.RemoveRendererLoad(plane.__$rseFlag);
            this.m_renderer.addEntity(plane);
            plane.__$rseFlag = RSEntityFlag.AddRendererLoad(plane.__$rseFlag);
            //plane.setRenderStateByName("ADD01");
            //container.update();
            let containerB: DisplayEntityContainer = new DisplayEntityContainer();
            containerB.addChild(container);
            this.m_container = container;
            this.m_containerMain = containerB;

            let axisEntity: Axis3DEntity = new Axis3DEntity();
            axisEntity.name = "axisEntity";
            axisEntity.initialize(30.0);
            //axisEntity.setXYZ(200.0,10.0,150.0);
            //container.addEntity(axisEntity);
            this.m_renderer.addEntity(axisEntity);
            this.m_followEntity = axisEntity;

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.name = "axis";
            axis.initialize(300.0);
            axis.setXYZ(100.0, 100.0, 100.0);
            this.m_renderer.addEntity(axis);

            axis = new Axis3DEntity();
            axis.name = "axis";
            axis.initialize(600.0);
            this.m_renderer.addEntity(axis);

            let srcBillboard: Billboard3DEntity = new Billboard3DEntity();
            srcBillboard.initialize(100.0, 100.0, [tex2]);

            let billboard: Billboard3DEntity = new Billboard3DEntity();

            for (; i < 0; ++i) {
                billboard = new Billboard3DEntity();
                billboard.setMesh(srcBillboard.getMesh());
                billboard.toBrightnessBlend();
                billboard.setRenderStateByName("ADD01");
                billboard.initialize(100.0, 100.0, [tex2]);
                billboard.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
                billboard.setFadeFactor(Math.random());
                this.m_renderer.addEntity(billboard);
                this.m_equeue.addBillEntity(billboard, false);
            }

            billboard = new Billboard3DEntity();
            billboard.setMesh(srcBillboard.getMesh());
            billboard.toBrightnessBlend();
            billboard.setRenderStateByName("ADD02");
            billboard.initialize(100.0, 100.0, [tex2]);
            billboard.setXYZ(200, 10, 150);
            container.addEntity(billboard);
            this.m_renderer.addEntity(billboard, 1);
            billboard = new Billboard3DEntity();
            billboard.setMesh(srcBillboard.getMesh());
            billboard.setRenderStateByName("ADD02");
            billboard.initialize(100.0, 100.0, [tex2]);
            billboard.setXYZ(-200, 10, -150);
            container.addEntity(billboard);
            this.m_renderer.addEntity(billboard, 1);
            //*/
            let cubeFrame: BoxFrame3D = null;
            let srcSphere: Sphere3DEntity = new Sphere3DEntity();
            srcSphere.initialize(50.0, 15, 15, [tex1]);

            let srcBox: Box3DEntity = new Box3DEntity();
            srcBox.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
            srcBox.setXYZ(Math.random() * 2000.0 - 1000.0, Math.random() * 2000.0 - 1000.0, Math.random() * 2000.0 - 1000.0);
            srcBox.setRotationXYZ(Math.random() * 360.0, Math.random() * 360.0, Math.random() * 360.0);
            //this.m_renderer.addEntity(srcBox);
        }
    }
    private m_runFlag: number = 20;
    mouseDownListener(evt: any): void {
        console.log("mouseDownListener call, this.m_renderer: " + this.m_renderer.toString());
        this.m_runFlag = 1;
    }
    pv: Vector3D = new Vector3D();
    delayTime: number = 10;
    run(): void {
        this.m_texLoader.run();
        this.m_equeue.run();
        this.m_statusDisp.update();

        //console.log("##-- begin");
        this.m_rcontext.setClearRGBColor3f(0.0, 0.5, 0.0);
        //this.m_rcontext.setClearRGBAColor4f(0.0, 0.5, 0.0,0.0);
        this.m_rcontext.renderBegin();

        this.m_renderer.update();
        this.m_renderer.run();

        this.m_rcontext.runEnd();
        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        this.m_rcontext.updateCamera();
        if (this.m_containerMain != null) {
            this.m_container.setRotationY(this.m_container.getRotationY() + 1.0);
            //this.m_containerMain.setRotationY(this.m_containerMain.getRotationY() + 1.0);
            this.m_containerMain.setRotationZ(this.m_containerMain.getRotationZ() + 1.0);
            this.m_containerMain.update();
            //this.m_container.update();
            //console.log("#---  end");
            this.pv.setXYZ(300.0, 10.0, 300.0);
            this.m_container.localToGlobal(this.pv);
            this.m_followEntity.setPosition(this.pv);
            this.m_followEntity.update();
            //this.m_container.globalToLocal(pv);
            //console.log(pv);
            if (this.delayTime < 0) {
                this.delayTime = 10;
                let par: DecayBrnParticle = null;

                this.pv.setXYZ(-300.0, 10.0, -300.0);
                this.m_container.localToGlobal(this.pv);
                par = DecayBrnParticle.Create();
                par.setPosition(this.pv);
                par.awake();

                this.pv.setXYZ(300.0, 10.0, 300.0);
                this.m_container.localToGlobal(this.pv);
                par = DecayBrnParticle.Create();
                par.setPosition(this.pv);
                par.awake();

                let i: number = 0;
                let len: number = Math.round(Math.random() * 15);
                len = 0;
                for (; i < len; ++i) {
                    this.pv.setXYZ(Math.random() * 800.0 - 400.0, Math.random() * 800.0 - 400.0, Math.random() * 800.0 - 400.0);
                    par = DecayBrnParticle.Create();
                    par.setPosition(this.pv);
                    par.awake();
                }
            }
            else {
                --this.delayTime;
            }
            DecayBrnParticle.Run();
        }
    }
}
export default DemoContainer;