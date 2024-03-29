import RSEntityFlag from '../vox/scene/RSEntityFlag';
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
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
import {EntityDispQueue} from "./base/EntityDispQueue";
import RendererScene from '../vox/scene/RendererScene';
import { MouseInteraction } from '../vox/ui/MouseInteraction';
export class DemoContainer {
    constructor() { }
    
    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    // private m_statusDisp = new RenderStatusDisplay();
    private m_equeue = new EntityDispQueue();
    private m_container: DisplayEntityContainer = null;
    private m_containerMain: DisplayEntityContainer = null;
    private m_followEntity: DisplayEntity = null;

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoContainer::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;

            // this.m_statusDisp.initialize();

            
            let rparam = new RendererParam();
            rparam.setMatrix4AllocateSize(8192);
            rparam.setCamProject(45.0, 0.1, 3000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);
            
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam);
            this.m_rscene.setClearRGBColor3f(0.0, 0.5, 0.0);

            new RenderStatusDisplay(this.m_rscene, true);
            new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            let tex0: TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
            let tex1: TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
            let tex2: TextureProxy = this.getImageTexByUrl("static/assets/guangyun_H_0007.png");
            //DecayBrnParticle.texs.push(tex2);
            RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
            RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);

            DecayBrnParticle.Initialize(200.0, [tex2], this.m_rscene.getRenderer());

            let scale: number = 1.0;
            let i: number = 0;

            let plane: Plane3DEntity = new Plane3DEntity();
            plane.uuid = "plane";
            plane.showDoubleFace();
            plane.initializeXOZ(-300.0, -300.0, 600.0, 600.0, [tex0]);

            let container = new DisplayEntityContainer();
            container.addEntity(plane);

            container.setXYZ(100.0, 100.0, 100.0);
            //let cid:number = plane.__$contId;
            plane.__$rseFlag = RSEntityFlag.RemoveRendererLoad(plane.__$rseFlag);
            this.m_rscene.addEntity(plane);
            plane.__$rseFlag = RSEntityFlag.AddRendererLoad(plane.__$rseFlag);
            //plane.setRenderStateByName("ADD01");
            //container.update();
            let containerB = new DisplayEntityContainer();
            containerB.addChild(container);
            this.m_container = container;
            this.m_containerMain = containerB;

            let axisEntity: Axis3DEntity = new Axis3DEntity();
            axisEntity.uuid = "axisEntity";
            axisEntity.initialize(30.0);
            //axisEntity.setXYZ(200.0,10.0,150.0);
            //container.addEntity(axisEntity);
            this.m_rscene.addEntity(axisEntity);
            this.m_followEntity = axisEntity;

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.uuid = "axis";
            axis.initialize(300.0);
            axis.setXYZ(100.0, 100.0, 100.0);
            this.m_rscene.addEntity(axis);

            axis = new Axis3DEntity();
            axis.uuid = "axis";
            axis.initialize(600.0);
            this.m_rscene.addEntity(axis);

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
                this.m_rscene.addEntity(billboard);
                this.m_equeue.addBillEntity(billboard, false);
            }

            billboard = new Billboard3DEntity();
            billboard.setMesh(srcBillboard.getMesh());
            billboard.toBrightnessBlend();
            billboard.setRenderStateByName("ADD02");
            billboard.initialize(100.0, 100.0, [tex2]);
            billboard.setXYZ(200, 10, 150);
            container.addEntity(billboard);
            this.m_rscene.addEntity(billboard, 1);
            billboard = new Billboard3DEntity();
            billboard.setMesh(srcBillboard.getMesh());
            billboard.setRenderStateByName("ADD02");
            billboard.initialize(100.0, 100.0, [tex2]);
            billboard.setXYZ(-200, 10, -150);
            container.addEntity(billboard);
            this.m_rscene.addEntity(billboard, 1);
            //*/
            let cubeFrame: BoxFrame3D = null;
            let srcSphere: Sphere3DEntity = new Sphere3DEntity();
            srcSphere.initialize(50.0, 15, 15, [tex1]);

            let srcBox: Box3DEntity = new Box3DEntity();
            srcBox.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
            srcBox.setXYZ(Math.random() * 2000.0 - 1000.0, Math.random() * 2000.0 - 1000.0, Math.random() * 2000.0 - 1000.0);
            srcBox.setRotationXYZ(Math.random() * 360.0, Math.random() * 360.0, Math.random() * 360.0);
            //this.m_rscene.addEntity(srcBox);
        }
    }
    private m_runFlag: number = 20;
    mouseDownListener(evt: any): void {
        console.log("mouseDownListener call, this.m_rscene: " + this.m_rscene.toString());
        this.m_runFlag = 1;
    }
    pv: Vector3D = new Vector3D();
    delayTime: number = 10;
    run(): void {
        this.m_equeue.run();
        // this.m_statusDisp.update();

        this.m_rscene.run();

        if (this.m_containerMain != null) {
            this.m_container.setRotationY(this.m_container.getRotationY() + 1.0);
            this.m_containerMain.setRotationZ(this.m_containerMain.getRotationZ() + 1.0);
            this.m_containerMain.update();
            
            this.pv.setXYZ(300.0, 10.0, 300.0);
            this.m_container.localToGlobal(this.pv);
            this.m_followEntity.setPosition(this.pv);
            this.m_followEntity.update();
            
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

                let i = 0;
                let len = Math.round(Math.random() * 15);
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
