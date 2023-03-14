
import Vector3D from "../../vox/math/Vector3D";
import { CubeRandomRange } from "../../vox/utils/RandomRange";
import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import TextureProxy from "../../vox/texture/TextureProxy";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import RendererScene from "../../vox/scene/RendererScene";
import MouseEvent from "../../vox/event/MouseEvent";
import Stage3D from "../../vox/display/Stage3D";
import H5FontSystem from "../../vox/text/H5FontSys";

import DisplayEntity from "../../vox/entity/DisplayEntity";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import BillboardFrame from "../../vox/entity/BillboardFrame";
import ProfileInstance from "../../voxprofile/entity/ProfileInstance";
import CameraTrack from "../../vox/view/CameraTrack";
import IRendererSpace from "../../vox/scene/IRendererSpace";
import SpherePOV from '../../voxocc/occlusion/SpherePOV';
import SphereGapPOV from '../../voxocc/occlusion/SphereGapPOV';
import { SpaceCullingMask } from "../../vox/space/SpaceCullingMask";
import SpaceCullingor from '../../vox/scene/SpaceCullingor';
import { MouseInteraction } from "../../vox/ui/MouseInteraction";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import DebugFlag from "../../vox/debug/DebugFlag";


export class DemoSphereOcclusion {
    constructor() {
    }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader;
    private m_rspace: IRendererSpace = null;

    // private m_profileInstance = new ProfileInstance();
    // private m_sphOccObj = new SpherePOV();
    private m_sphOccObj = new SphereGapPOV();
    private m_entities: DisplayEntity[] = [];
    private m_frameList: BillboardFrame[] = [];

    initialize(): void {
        console.log("DemoSphereOcclusion::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;

            let rparam = new RendererParam();
            rparam.setCamProject(45.0, 0.1, 9000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);

            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.setRendererProcessParam(1, true, true);
            this.m_rscene.updateCamera();
            this.m_rscene.setClearRGBColor3f(0.0, 0.1, 0.2);

            this.m_rspace = this.m_rscene.getSpace();
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            let tex0 = this.m_texLoader.getImageTexByUrl("static/assets/default.jpg");
            let tex1 = this.m_texLoader.getImageTexByUrl("static/assets/broken_iron.jpg");


            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);

			new MouseInteraction().initialize(this.m_rscene).setAutoRunning(true);
			new RenderStatusDisplay(this.m_rscene, true);

            // 总的原则: 不可见的一定不可见， 可见的未必可见。也就是说，只要任何遮挡体判断其为不可见，则其就不可见
            // 这个原则本质上也有纰漏：如果一个实体遮挡体和一个Gap遮挡体同时并列存在，而且他们之间的关系是取交集，这时候就有问题了(有点烧脑)
            let i = 0;
            let total = 20;

            let axis = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);

            let cullingor = new SpaceCullingor();
            cullingor.addPOVObject(this.m_sphOccObj);
            this.m_rspace.setSpaceCullingor(cullingor);

            let occPv = new Vector3D(100.0, 200.0, 0.0);
            this.m_sphOccObj.setCamPosition(this.m_rscene.getCamera().getPosition());
            this.m_sphOccObj.setPosition(occPv);
            this.m_sphOccObj.updateOccData();
            this.m_sphOccObj.occRadius = 300.0;

            let circleOccFrame = new BillboardFrame();
            //circleOccFrame.color.setRGB3f(1.0,1.0,1.0);
            circleOccFrame.initializeCircle(this.m_sphOccObj.occRadius, 20);
            circleOccFrame.setPosition(occPv);
            this.m_rscene.addEntity(circleOccFrame);


            let cubeRange = new CubeRandomRange();
            cubeRange.min.setXYZ(-1500.0, -1500.0, -1500.0);
            cubeRange.max.setXYZ(1500.0, 1500.0, 1500.0);
            cubeRange.initialize();

            let pv = new Vector3D();
            let circleFrame: BillboardFrame = null;
            let srcBox = new Box3DEntity();
            srcBox.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
            //srcBox = null;
            let scaleK: number = 0.3;

            let minV = new Vector3D(-100.0, -100.0, -100.0);
            let maxV = new Vector3D(100.0, 100.0, 100.0);
            let texList = [tex1];
            let box: Box3DEntity = null;
            let posList = [
                // new Vector3D(0.0, 0.0, 220.0),
                new Vector3D(220.0, 0.0, 0.0)
            ];
            // total = posList.length + 10;
            for (i = 0; i < total; ++i) {
                box = new Box3DEntity();
                if (srcBox != null) box.copyMeshFrom(srcBox);
                box.initialize(minV, maxV, texList);
                if (total > 1) {
                    box.setScaleXYZ(scaleK * (Math.random() + 0.8), scaleK * (Math.random() + 0.8), scaleK * (Math.random() + 0.8));
                    cubeRange.calc();
                    box.setPosition(cubeRange.value);
                    //box.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
                }
                else {
                    box.setXYZ(0.0, 0.0, 220.0);
                }
                // box.setPosition( posList[i] );
                box.spaceCullMask |= SpaceCullingMask.POV;
                this.m_rscene.addEntity(box);
                //this.m_sphOcclusion.addEntity(box);
                this.m_entities.push(box);
                box.getPosition(pv);
                circleFrame = new BillboardFrame();
                circleFrame.uuid = "cirf_"+i;
                circleFrame.initializeCircle(box.getGlobalBounds().radius, 20);
                circleFrame.setPosition(pv);
                this.m_rscene.addEntity(circleFrame);
                this.m_frameList.push(circleFrame);

            }
        }
    }
    mouseDownListener(evt: any): void {
        DebugFlag.Flag_0 = 1;
    }

    showTestStatus(): void {
        let i = 0;
        let len = this.m_entities.length;
        for (; i < len; ++i) {
            //this.m_frameList[i].setRGB3f(1.0,1.0,1.0);
            // if(DebugFlag.Flag_0 > 0) {
            //     console.log("this.m_frameList[i].drawEnabled: ", this.m_frameList[i].drawEnabled);
            // }
            if (this.m_entities[i].drawEnabled) {
                this.m_frameList[i].setRGB3f(1.0, 1.0, 1.0);
            }
            else {
                this.m_frameList[i].setRGB3f(1.0, 0.0, 1.0);
            }
        }
    }
    pv = new Vector3D();
    delayTime = 10;
    run(): void {
        //console.log("##-- begin");

        this.m_rscene.run();

        /*

        // this.m_sphOccObj.setCamPosition(this.m_rscene.getCamera().getPosition());

        this.m_rscene.runBegin();

        this.m_rscene.update();
        this.m_rscene.cullingTest();
        // this.showTestStatus();

        this.m_rscene.run();
        this.m_rscene.runEnd();
        // this.m_rscene.updateCamera();
        //*/
        this.showTestStatus();

        // this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        // if (this.m_profileInstance != null) {
        //     this.m_profileInstance.run();
        // }
        DebugFlag.Flag_0 = 0;
    }
}
export default DemoSphereOcclusion;