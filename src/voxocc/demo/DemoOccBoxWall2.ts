
import Vector3D from "../../vox/math/Vector3D";
import { CubeRandomRange } from "../../vox/utils/RandomRange";
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
import IRendererSpace from "../../vox/scene/IRendererSpace";
import SpaceCullingor from "../../vox/scene/SpaceCullingor";
import { SpaceCullingMask } from "../../vox/space/SpaceCullingMask";
import { OccBoxWall } from "../../voxocc/demo/occwall/OccBoxWall";

import { MouseInteraction } from "../../vox/ui/MouseInteraction";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import TextureConst from "../../vox/texture/TextureConst";

export class DemoOccBoxWall2 {
    constructor() {
    }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader;

    private m_profileInstance = new ProfileInstance();
    private m_dispList: DisplayEntity[] = [];
    private m_frameList: BillboardFrame[] = [];
    private m_occStatusList: number[] = [];
    private m_rspace: IRendererSpace = null;
    private m_texList: TextureProxy[] = [];
    
	private getAssetTexByUrl(pns: string): TextureProxy {
		return this.getTexByUrl("static/assets/" + pns);
	}
	private getTexByUrl(url: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
		let hostUrl = window.location.href;
		if (hostUrl.indexOf(".artvily.") > 0) {
			hostUrl = "http://www.artvily.com:9090/";
			url = hostUrl + url;
		}
		let ptex = this.m_texLoader.getImageTexByUrl(url);
		ptex.mipmapEnabled = mipmapEnabled;
		if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);

		return ptex;
	}
    initialize(): void {
        console.log("DemoOccBoxWall2::initialize()......");
        if (this.m_rscene == null) {

            RendererDevice.SHADERCODE_TRACE_ENABLED = false;

            let rparam = new RendererParam();
            rparam.setMatrix4AllocateSize(8192 * 4);
            rparam.setCamProject(45.0, 100.0, 5000.0);
            rparam.setCamPosition(2000.0, 1500.0, 2000.0);

            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.setRendererProcessParam(1, true, true);
            this.m_rspace = this.m_rscene.getSpace();


            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);

            new MouseInteraction().initialize(this.m_rscene).setAutoRunning(true);
            new RenderStatusDisplay(this.m_rscene, true);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);


            let tex0 = this.getTexByUrl("static/assets/moss_02.jpg");
            let tex1 = this.getTexByUrl("static/assets/moss_02.jpg");
            let tex2 = this.getTexByUrl("static/assets/metal_08.jpg");
            let tex3 = this.getTexByUrl("static/assets/moss_02.jpg");
            let tex4 = this.getTexByUrl("static/assets/moss_02.jpg");
            let tex5 = this.getTexByUrl("static/assets/moss_02.jpg");

            this.m_texList.push(tex0);
            this.m_texList.push(tex1);
            this.m_texList.push(tex2);
            this.m_texList.push(tex3);
            this.m_texList.push(tex4);
            this.m_texList.push(tex5);

            RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
            RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);

            let cubeRange = new CubeRandomRange();
            cubeRange.min.setXYZ(-600.0, -600.0, -1050.0);
            cubeRange.max.setXYZ(600.0, 600.0, 850.0);
            cubeRange.initialize();

            let cubeRange1 = new CubeRandomRange();
            cubeRange1.min.setXYZ(-700.0, -600.0, 450.0);
            cubeRange1.max.setXYZ(700.0, 600.0, 300.0);
            cubeRange1.initialize();

            let cubeRange2 = new CubeRandomRange();
            cubeRange2.min.setXYZ(-700.0, -600.0, -950.0);
            cubeRange2.max.setXYZ(700.0, 600.0, -800.0);
            cubeRange2.initialize();

            let axis = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);

            let i = 0;
            let total = 1000;
            this.m_profileInstance = new ProfileInstance();
            this.m_profileInstance.initialize(this.m_rscene.getRenderer());

            let src_circleFrame = new BillboardFrame();
            src_circleFrame.initializeCircle(100.0, 20);
            let pv = new Vector3D();
            let circleFrame: BillboardFrame = null;
            let srcBox: Box3DEntity = new Box3DEntity();
            srcBox.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex0]);
            let box: Box3DEntity = null;
            let scaleK = 0.2;
            let frameScaleK = 1.0;

            let minV = new Vector3D(-100.0, -100.0, -100.0);
            let maxV = new Vector3D(100.0, 100.0, 100.0);
            let texList: TextureProxy[] = [tex5];
            for (i = 0; i < total; ++i) {
                box = new Box3DEntity();
                if (srcBox != null) box.setMesh(srcBox.getMesh());
                box.initialize(minV, maxV, texList);
                if (total > 1) {
                    box.setScaleXYZ((Math.random() + 0.8) * scaleK, (Math.random() + 0.8) * scaleK, (Math.random() + 0.8) * scaleK);
                    //let rand:number = Math.random();
                    //if(rand > 0.6)
                    //{
                    //    cubeRange2.calc();
                    //    box.setPosition(cubeRange2.value);
                    //}
                    //else if(rand > 0.3)
                    //{
                    //    cubeRange1.calc();
                    //    box.setPosition(cubeRange1.value);
                    //}
                    //else
                    //{
                    cubeRange.calc();
                    box.setPosition(cubeRange.value);
                    //}
                    //box.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
                }
                else {
                    box.setXYZ(0.0, 0.0, 0.0);
                    //box.setXYZ(-324.0,252.0,-619.0);
                }

                box.spaceCullMask |= SpaceCullingMask.POV;
                this.m_rscene.addEntity(box);
                this.m_dispList.push(box);
                this.m_occStatusList.push(0);

                box.getPosition(pv);
                circleFrame = new BillboardFrame();
                circleFrame.copyMeshFrom(src_circleFrame);
                circleFrame.initializeCircle(box.getGlobalBounds().radius, 20);
                frameScaleK = box.getGlobalBounds().radius / 100.0;
                circleFrame.setScaleXY(frameScaleK, frameScaleK);
                circleFrame.setPosition(pv);
                //this.m_rscene.addEntity(circleFrame);
                this.m_frameList.push(circleFrame);
            }

            let cullingor: SpaceCullingor = new SpaceCullingor();
            this.m_rspace.setSpaceCullingor(cullingor);
            let gapList: number[] = null;
            let gapSizeList: number[] = null;

            let wall0: OccBoxWall = new OccBoxWall();
            wall0.initialize(this.m_rscene, cullingor, this.m_texList);
            gapList = [2, 2];
            gapSizeList = [1, 2];
            //  //gapList = [];
            wall0.createXOYWall(
                new Vector3D(-400.0, -500.0, -800.0), new Vector3D(300.0, 350.0, 250.0)
                , 4, 6, gapList, gapSizeList, 2, -1, -1
            );

            let wall1: OccBoxWall = new OccBoxWall();
            wall1.initialize(this.m_rscene, cullingor, this.m_texList);
            gapList = [1, 1];
            gapSizeList = [2, 2];
            //  //gapList = [];
            wall1.createZOYWall(
                new Vector3D(-300.0, -500.0, -500.0), new Vector3D(250.0, 350.0, 300.0)
                , 4, 5, gapList, gapSizeList, 2, -1, -1
            );
            //createZOYWall
            wall0 = new OccBoxWall();
            wall0.initialize(this.m_rscene, cullingor, this.m_texList);
            gapList = [2, 2];
            gapSizeList = [1, 2];
            //  //gapList = [];
            wall0.createXOYWall(
                new Vector3D(-1500.0, -500.0, 1050.0), new Vector3D(300.0, 350.0, 250.0)
                , 4, 6, gapList, gapSizeList, 2, -1, -1
            );
        }
    }
    mouseDownListener(evt: any): void {
    }
    showTestStatus(): void {
        let i = 0;
        let len = this.m_dispList.length;
        for (; i < len; ++i) {
            if (this.m_dispList[i].isRendering()) {
                this.m_frameList[i].setRGB3f(1.0, 1.0, 1.0);
            }
            else {
                this.m_frameList[i].setRGB3f(1.0, 0.0, 1.0);
            }
        }
    }

    run(): void {
        if(this.m_rscene) {
            this.m_rscene.run();
            this.showTestStatus();

            if (this.m_profileInstance != null) {
                this.m_profileInstance.run();
            }
        }
    }
    // run(): void {
    //     //console.log("##-- begin");
    //     this.m_rscene.setClearRGBColor3f(0.0, 0.1, 0.1);
    //     this.m_rscene.runBegin();
    //     this.m_rscene.update();
    //     this.m_rscene.cullingTest();
    //     this.showTestStatus();
    //     this.m_rscene.run();
    //     this.m_rscene.runEnd();
    //     if (this.m_flagBoo) this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
    //     this.m_rscene.updateCamera();
    //     if (this.m_profileInstance != null) {
    //         this.m_profileInstance.run();
    //     }
    // }
}
