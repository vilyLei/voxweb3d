
import Vector3D from "../../vox/math/Vector3D";
import RendererDevice from "../../vox/render/RendererDevice";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../../vox/render/RenderConst";
import RendererState from "../../vox/render/RendererState";
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
import BrokenLine3DEntity from "../../vox/entity/BrokenLine3DEntity";
import { QuadHolePOV } from '../../voxocc/occlusion/QuadHolePOV';
import IRendererSpace from "../../vox/scene/IRendererSpace";
import { SpaceCullingMask } from "../../vox/space/SpaceCullingMask";
import SpaceCullingor from '../../vox/scene/SpaceCullingor';
import { MouseInteraction } from "../../vox/ui/MouseInteraction";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";


export class DemoQuadHoleOcc {
    constructor() {
    }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader;
    private m_camTrack: CameraTrack = null;

    private m_profileInstance = new ProfileInstance();
    //private m_quadOccObj = new QuadHoleOccObj();
    private m_quadOccObj = new QuadHolePOV();
    private m_dispList: DisplayEntity[] = [];
    private m_frameList: BillboardFrame[] = [];
    private m_rspace: IRendererSpace = null;
    initialize(): void {
        console.log("DemoQuadHoleOcc::initialize()......");
        if (this.m_rscene == null) {
            H5FontSystem.GetInstance().initialize("fontTex", 18, 512, 512, false, false);
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            rparam.setMatrix4AllocateSize(8192 * 4);
            rparam.setCamProject(45.0, 50.0, 5000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);
            //  this.m_renderer = new RendererInstance();
            //  this.m_renderer.initialize(rparam);
            //  this.m_renderer.appendProcess(true,true);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.setRendererProcessParam(1, true, true);
            this.m_rspace = this.m_rscene.getSpace();
            let cullingor: SpaceCullingor = new SpaceCullingor();
            cullingor.addPOVObject(this.m_quadOccObj);
            this.m_rspace.setSpaceCullingor(cullingor);

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);

			new MouseInteraction().initialize(this.m_rscene).setAutoRunning(true);
			new RenderStatusDisplay(this.m_rscene, true);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            let tex1 = this.m_texLoader.getImageTexByUrl("static/assets/broken_iron.jpg");

            let stage3D: Stage3D = this.m_rscene.getStage3D() as Stage3D;
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());
            this.m_rscene.setClearRGBColor3f(0.0, 0.1, 0.1);
            //
            //dis = StraightLine.CalcPVDis(this.m_camNV,this.m_camPv,this.m_pv);

            RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
            RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);
            this.m_rscene.updateCamera();
            let i: number = 0;
            let total: number = 1800;
            this.m_profileInstance = new ProfileInstance();
            this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            //
            let posList: Vector3D[] = null;
            /*
            posList = [
                new Vector3D(-500.0,700.0,200.0)
                , new Vector3D(500.0,700.0,200.0)
                , new Vector3D(500.0,-700.0,200.0)
                , new Vector3D(-500.0,-700.0,200.0)
                
                , new Vector3D(-500.0,700.0,-200.0)
                , new Vector3D(500.0,700.0,-200.0)
                , new Vector3D(500.0,-700.0,-200.0)
                , new Vector3D(-500.0,-700.0,-200.0)
            ];
            //*/
            this.m_quadOccObj.setCamPosition(this.m_rscene.getCamera().getPosition());
            //this.m_quadOccObj.setParam(posList[0],posList[1],posList[2],posList[3], posList[4],posList[5],posList[6],posList[7]);
            posList = this.m_quadOccObj.setParamFromeBoxFaceZ(new Vector3D(-500.0, -500.0, -100.0), new Vector3D(300.0, 300.0, 100.0));
            this.m_quadOccObj.updateOccData();

            let dispLS: BrokenLine3DEntity = new BrokenLine3DEntity();
            dispLS.initializeQuad(posList[0], posList[1], posList[2], posList[3]);
            dispLS.setRGB3f(1.0, 1.0, 0.0);
            this.m_rscene.addEntity(dispLS);
            dispLS = new BrokenLine3DEntity();
            dispLS.initializeQuad(posList[4], posList[5], posList[6], posList[7]);
            dispLS.setRGB3f(0.0, 1.0, 1.0);
            this.m_rscene.addEntity(dispLS);


            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);


            axis = new Axis3DEntity();
            axis.initialize(30.0);
            axis.setPosition(posList[0]);
            this.m_rscene.addEntity(axis);
            axis = new Axis3DEntity();
            axis.initialize(80.0);
            axis.setPosition(posList[1]);
            this.m_rscene.addEntity(axis);
            //return;
            let pv: Vector3D = new Vector3D();
            let circleFrame: BillboardFrame = null;//new BillboardFrame();
            let srcBox: Box3DEntity = new Box3DEntity();
            srcBox.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
            //srcBox = null;
            let sk: number = 0.15;
            let box: Box3DEntity = null;
            for (i = 0; i < total; ++i) {
                box = new Box3DEntity();
                if (srcBox != null) box.setMesh(srcBox.getMesh());
                box.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
                if (total > 1) box.setScaleXYZ((Math.random() * 1.5 + 0.8) * sk, (Math.random() * 1.5 + 0.8) * sk, (Math.random() * 1.5 + 0.8) * sk);
                //if(total > 1)box.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
                if (total > 1) box.setXYZ(Math.random() * 4000.0 - 2000.0, Math.random() * 4000.0 - 2000.0, Math.random() * 4000.0 - 2000.0);
                else box.setXYZ(-500.0, -200.0, -500.0);
                //: [Vector3D(x=-324.7812805175781, y=252.8412628173828,z=-619.5932006835938,w=0)]
                //if(total > 1)box.setXYZ(Math.random() * 8000.0 - 4000.0,Math.random() * 8000.0 - 4000.0,Math.random() * 8000.0 - 4000.0);

                box.spaceCullMask |= SpaceCullingMask.POV;
                this.m_rscene.addEntity(box);
                this.m_dispList.push(box);
                //this.m_quadOccObj.addEntity(box);
                box.getPosition(pv);
                circleFrame = new BillboardFrame();
                circleFrame.initializeCircle(box.getGlobalBounds().radius, 20);
                circleFrame.setPosition(pv);
                this.m_rscene.addEntity(circleFrame);
                this.m_frameList.push(circleFrame);
                //this.m_quadOccObj.addEntityFrame( circleFrame );

                //this.m_quadOccObj.test(box.getGlobalBounds());
            }
        }
    }
    mouseDownListener(evt: any): void {
    }

    showTestStatus(): void {
        let i = 0;
        let len = this.m_dispList.length;
        for (; i < len; ++i) {
            //this.m_frameList[i].setRGB3f(1.0,1.0,1.0);
            if (this.m_dispList[i].drawEnabled) {
                this.m_frameList[i].setRGB3f(1.0, 1.0, 1.0);
            }
            else {
                this.m_frameList[i].setRGB3f(1.0, 0.0, 1.0);
            }
        }
    }
    run(): void {
        if (this.m_rscene) {

            this.m_rscene.run();
            this.showTestStatus();
            //console.log("##-- begin");
            /*
            this.m_rscene.setClearRGBColor3f(0.0, 0.1, 0.1);
            this.m_rscene.runBegin();
    
            this.m_rscene.update();
            this.m_rscene.cullingTest();
            this.showTestStatus();
    
            this.m_rscene.run();
            this.m_rscene.runEnd();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            this.m_rscene.updateCamera();
            //*/
            if (this.m_profileInstance != null) {
                this.m_profileInstance.run();
            }
        }
    }
}