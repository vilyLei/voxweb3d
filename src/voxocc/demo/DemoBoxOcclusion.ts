
import Vector3D from "../../vox/math/Vector3D";
import RendererDevice from "../../vox/render/RendererDevice";
import { CubeRandomRange } from "../../vox/utils/RandomRange";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../../vox/render/RenderConst";
import RendererState from "../../vox/render/RendererState";
import RendererParam from "../../vox/scene/RendererParam";
import TextureProxy from "../../vox/texture/TextureProxy";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import RendererScene from "../../vox/scene/RendererScene";
import MouseEvent from "../../vox/event/MouseEvent";

import DisplayEntity from "../../vox/entity/DisplayEntity";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import BillboardFrame from "../../vox/entity/BillboardFrame";
import ProfileInstance from "../../voxprofile/entity/ProfileInstance";
import BoxFrame3D from "../../vox/entity/BoxFrame3D";
import BrokenLine3DEntity from "../../vox/entity/BrokenLine3DEntity";
import { QuadHolePOV } from '../../voxocc/occlusion/QuadHolePOV';
import BoxPOV from '../../voxocc/occlusion/BoxPOV';
import IRendererSpace from "../../vox/scene/IRendererSpace";
import { SpaceCullingMask } from "../../vox/space/SpaceCullingMask";
import SpaceCullingor from '../../vox/scene/SpaceCullingor';
import { MouseInteraction } from "../../vox/ui/MouseInteraction";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import DisplayEntityContainer from "../../vox/entity/DisplayEntityContainer";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";
import IRenderEntityBase from "../../vox/render/IRenderEntityBase";
import TextureConst from "../../vox/texture/TextureConst";

export class DemoBoxOcclusion {
    constructor() {
    }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader;

    private m_profileInstance = new ProfileInstance();
    private m_boxOcc0 = new BoxPOV();
    private m_boxOcc1 = new BoxPOV();
    private m_quadHolePOV = new QuadHolePOV();
    private m_entities: IRenderEntityBase[] = [];
    private m_frameList: BillboardFrame[] = [];
    private m_occStatusList: number[] = [];

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
        console.log("DemoBoxOcclusion::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;

            let rparam = new RendererParam();
            rparam.setCamProject(45.0, 50.0, 8000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);

            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam);
            this.m_rscene.setClearRGBColor3f(0.0, 0.1, 0.1);
            let rspace = this.m_rscene.getSpace();

            let cullingor = new SpaceCullingor();
            cullingor.addPOVObject(this.m_boxOcc0);
            cullingor.addPOVObject(this.m_boxOcc1);
            rspace.setSpaceCullingor(cullingor);

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);

            new MouseInteraction().initialize(this.m_rscene).setAutoRunning(true);
            new RenderStatusDisplay(this.m_rscene, true);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            let tex1 = this.getTexByUrl("static/assets/broken_iron.jpg");

            RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
            RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);

            let pv = new Vector3D();
            let minVDis = -650.0;
            let maxVDis = 270.0;
            let boxMinV = new Vector3D(minVDis, minVDis, minVDis * 0.5);
            let boxMaxV = new Vector3D(maxVDis, maxVDis + 200, maxVDis * 0.5);
            this.m_boxOcc0.setCamPosition(this.m_rscene.getCamera().getPosition());
            this.m_boxOcc0.setParam(boxMinV, boxMaxV);
            this.m_boxOcc0.updateOccData();

            let boxFrame = new BoxFrame3D();
            //boxFrame.initialize(boxMinV,boxMaxV);
            boxFrame.initializeByPosList8(this.m_boxOcc0.getPositionList());
            //boxFrame.setScaleXYZ(0.98, 0.98,0.98);
            this.m_rscene.addEntity(boxFrame);

            let posList: Vector3D[] = null;
            this.m_quadHolePOV.setCamPosition(this.m_rscene.getCamera().getPosition());
            //this.m_quadOccObj.setParam(posList[0],posList[1],posList[2],posList[3], posList[4],posList[5],posList[6],posList[7]);
            posList = this.m_quadHolePOV.setParamFromeBoxFaceZ(
                new Vector3D(boxMinV.x + 200.0, boxMinV.y + 190.0, boxMinV.z)
                , new Vector3D(boxMaxV.x - 190.0, boxMaxV.y - 170.0, boxMaxV.z)
            );
            this.m_quadHolePOV.updateOccData();
            this.m_boxOcc0.addSubPov(this.m_quadHolePOV);


            let dispLS = new BrokenLine3DEntity();
            dispLS.initializeQuad(posList[0], posList[1], posList[2], posList[3]);
            dispLS.setRGB3f(1.0, 1.0, 0.0);
            this.m_rscene.addEntity(dispLS);
            dispLS = new BrokenLine3DEntity();
            dispLS.initializeQuad(posList[4], posList[5], posList[6], posList[7]);
            dispLS.setRGB3f(0.0, 1.0, 1.0);
            this.m_rscene.addEntity(dispLS);


            minVDis = 300.0;
            maxVDis = 800.0;
            boxMinV.setXYZ(minVDis, minVDis, minVDis);
            boxMaxV.setXYZ(maxVDis, maxVDis, maxVDis);
            this.m_boxOcc1.setCamPosition(this.m_rscene.getCamera().getPosition());
            this.m_boxOcc1.setParam(boxMinV, boxMaxV);
            this.m_boxOcc1.getPositionAt(pv, 0);
            pv.x += 150.0;
            this.m_boxOcc1.setPositionAt(pv, 0);
            this.m_boxOcc1.getPositionAt(pv, 1);
            pv.x += 150.0;
            this.m_boxOcc1.setPositionAt(pv, 1);
            this.m_boxOcc1.updateOccData();
            boxFrame = new BoxFrame3D();
            boxFrame.initializeByPosList8(this.m_boxOcc1.getPositionList());
            //boxFrame.initialize(boxMinV,boxMaxV);
            //boxFrame.setScaleXYZ(0.98, 0.98,0.98);
            this.m_rscene.addEntity(boxFrame);

            let cubeRange = new CubeRandomRange();
            cubeRange.min.setXYZ(-800.0, -400.0, -700.0);
            cubeRange.max.setXYZ(800.0, 400.0, -100.0);
            cubeRange.initialize();

            let i = 0;
            let total = 180;
            this.m_profileInstance = new ProfileInstance();
            this.m_profileInstance.initialize(this.m_rscene.getRenderer());

            let src_circleFrame = new BillboardFrame();
            src_circleFrame.initializeCircle(100.0, 20);
            let circleFrame: BillboardFrame = null;//new BillboardFrame();
            let srcBox = new Box3DEntity();
            srcBox.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);

            //srcBox = null;
            let box: Box3DEntity = null;
            let scaleK = 0.2;
            let frameScaleK = 1.0;
            for (i = 0; i < total; ++i) {
                box = new Box3DEntity();
                if (srcBox != null) box.setMesh(srcBox.getMesh());
                box.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
                if (total > 1) {
                    box.setScaleXYZ((Math.random() + 0.8) * scaleK, (Math.random() + 0.8) * scaleK, (Math.random() + 0.8) * scaleK);
                    //box.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
                    cubeRange.calc();
                    box.setPosition(cubeRange.value);
                }
                else {
                    box.setXYZ(0.0, 0.0, 0.0);
                    //box.setXYZ(-324.0,252.0,-619.0);
                }

                box.spaceCullMask |= SpaceCullingMask.POV;
                this.m_rscene.addEntity(box);
                this.m_entities.push(box);
                this.m_occStatusList.push(0);
                //this.m_boxOcc0.addEntity(box);
                box.getPosition(pv);
                circleFrame = new BillboardFrame();
                circleFrame.copyMeshFrom(src_circleFrame);
                circleFrame.initializeCircle(box.getGlobalBounds().radius, 20);
                frameScaleK = box.getGlobalBounds().radius / 100.0;
                circleFrame.setScaleXY(frameScaleK, frameScaleK);
                circleFrame.setPosition(pv);
                this.m_rscene.addEntity(circleFrame);
                this.m_frameList.push(circleFrame);
                //this.m_boxOcc0.addEntityFrame( circleFrame );
            }

			this.createContainer();
        }
    }

	private createContainer(): void {
		let tex0 = this.getTexByUrl("static/assets/default.jpg");
		let tex1 = this.getTexByUrl("static/assets/broken_iron.jpg");
		let tex2 = this.getTexByUrl("static/assets/box.jpg");

		let i = 0;

		// box.setXYZ(200, 0, 200);
		// box.spaceCullMask |= SpaceCullingMask.POV;
		// this.m_rscene.addEntity(box);
		// this.m_entities.push(box);

		let container = new DisplayEntityContainer(true, true);
		container.spaceCullMask |= SpaceCullingMask.POV;
		this.m_rscene.addEntity(container);
		container.setXYZ(-200, 100, 300);
		this.m_entities.push( container );


		let box0 = new Box3DEntity();
		box0.uuid = "box0";
		box0.initializeCube(20, [tex0]);
		container.addEntity( box0 );

		let box1 = new Box3DEntity();
		box1.uuid = "box1";
		box1.initializeCube(40, [tex2]);
		box1.setXYZ(200, 100, 0);
		container.addEntity( box1 );



		///*
		let container2 = new DisplayEntityContainer(true, true);
		container2.setXYZ(100, 50, 80);
		container.addEntity( container2 );
		let sph = new Sphere3DEntity();
		sph.initialize(30, 30, 30, [tex0]);
		container2.addEntity( sph );

		sph = new Sphere3DEntity();
		sph.initialize(30, 30, 30, [tex0]);
		sph.setXYZ(50, 20, 0);
		container2.addEntity( sph );
		//*/

		container.update();

		let gb = container.getGlobalBounds();
		// console.log("XXXX box: ", box0.getGlobalBounds());
		// console.log("XXXX box1: ", box1.getGlobalBounds());
		// console.log("XXXX container: ", container.getGlobalBounds());
		// console.log("XXXX radius: ", (100 + 30) * 0.707);
		// console.log("XXXX gb.radius: ", gb.radius);
		let circleFrame = new BillboardFrame();
		circleFrame.uuid = "cirf_container_" + i;
		circleFrame.initializeCircle(gb.radius, 20);
		circleFrame.setPosition(gb.center);
		this.m_rscene.addEntity(circleFrame);
		this.m_frameList.push(circleFrame);

		// let sph2 = new Sphere3DEntity();
		// sph2.initialize(gb.radius, 30, 30);
		// sph2.setPosition(gb.center);
		// this.m_rscene.addEntity(sph2);
	}
    mouseDownListener(evt: any): void {

    }
    showTestStatus(): void {

        let i = 0;
        let len = this.m_entities.length;
        for (; i < len; ++i) {
            //this.m_frameList[i].setRGB3f(1.0,1.0,1.0);
            if (this.m_entities[i].isRendering()) {
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

            if (this.m_profileInstance) {
                this.m_profileInstance.run();
            }
        }
    }
}
