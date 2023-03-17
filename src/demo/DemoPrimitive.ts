import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import Cylinder3DEntity from "../vox/entity/Cylinder3DEntity";
import Tube3DEntity from "../vox/entity/Tube3DEntity";
import Billboard3DEntity from "../vox/entity/Billboard3DEntity";
import BillboardLine3DEntity from "../vox/entity/BillboardLine3DEntity";
import TextureConst from "../vox/texture/TextureConst";

import ImageTextureLoader from "../vox/texture/ImageTextureLoader";

import { EntityDispQueue } from "./base/EntityDispQueue";
import Torus3DMesh from "../vox/mesh/Torus3DMesh";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Default3DMaterial from "../vox/material/mcase/Default3DMaterial";

import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";
import RendererScene from "../vox/scene/RendererScene";
import IRenderTexture from "../vox/render/texture/IRenderTexture";

export class DemoPrimitive {
	constructor() {}

	private m_rscene: RendererScene = null;
	private m_texLoader: ImageTextureLoader;

	private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
	private m_equeue: EntityDispQueue = new EntityDispQueue();
	private m_billLine: BillboardLine3DEntity = null;
	private m_beginPos: Vector3D = new Vector3D(0.0, 0.0, 0.0);
	private m_endPos: Vector3D = new Vector3D(0.0, 500.0, -100.0);
	private m_uvPos: Vector3D = new Vector3D(0.3, 0.0);

	private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
	private m_cameraZoomController: CameraZoomController = new CameraZoomController();
	private m_sph = new Sphere3DEntity();
	private m_sphPv = new Vector3D();
	private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		let ptex = this.m_texLoader.getImageTexByUrl(purl);
		ptex.mipmapEnabled = mipmapEnabled;
		if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
		return ptex;
	}

	initialize(): void {
		if (this.m_rscene == null) {

			console.log("DemoPrimitive::initialize()......");

			RendererDevice.SHADERCODE_TRACE_ENABLED = false;

			let rparam = new RendererParam();
			rparam.setTickUpdateTime(20);
			rparam.setCamProject(45.0, 1.0, 3000.0);
			rparam.setCamPosition(1500.0, 1500.0, 1500.0);

			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam);

			this.m_rscene.enableMouseEvent(true);
			this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
			this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
			this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

			this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

			if (this.m_statusDisp != null) this.m_statusDisp.initialize();
			let tex0 = this.getTexByUrl("static/assets/box.jpg");
			let tex1 = this.getTexByUrl("static/assets/color_01.jpg");
			let tex2 = this.getTexByUrl("static/assets/guangyun_H_0007.png");
			let tex3 = this.getTexByUrl("static/assets/flare_core_02.jpg");
			let tex4 = this.getTexByUrl("static/assets/flare_core_01.jpg");

			RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
			RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);
			/*
            let tex = new ImageTextureProxy(64, 64);
            //tex.mipmapEnabled = true;
            //tex.setWrap(TextureConst.WRAP_REPEAT);
            let pl = new Plane3DEntity();
            //plane.initializeXOZSquare(400.0);
            //this.m_rscene.addEntity(plane);
            let img: HTMLImageElement = new Image();
            img.onload = (evt: any): void => {
                console.log("PlayerOne::initialize() image loaded",img.src);
                //tex.__$setRenderProxy(this.m_rscene.getRenderProxy());
                tex.setDataFromImage(img);
                pl.initializeXOZSquare(500.0, [tex]);
                this.m_rscene.addEntity(pl);
            }
            img.src = "static/assets/yanj.jpg";
            return;
            //*/

			// tex1 = this.getTexByUrl("static/assets/metal_08.jpg");
			// let size = 300.0;
			// let bgBox = new Box3DEntity();
			// // bgBox.setMaterial(material);
			// bgBox.showFrontFace();
			// bgBox.initialize(new Vector3D(-size, -size, -size), new Vector3D(size, size, size), [tex1]);
			// let bgBoxMaterial = bgBox.getMaterial() as IDefault3DMaterial;
			// bgBoxMaterial.setUVScale(10, 10);
			// bgBox.setScaleXYZ(2.0, 2.0, 2.0);
			// this.m_rscene.addEntity(bgBox);
			// return;

			// let spl = new ScreenFixedAlignPlaneEntity();
			// spl.initialize(-0.8, -0.8, 0.5,0.5);
			// this.m_rscene.addEntity(spl, 6);
			// return;
			let i: number = 0;
			// this.m_sph.initialize(100, 30, 30);
			// this.m_sph.setXYZ(0, 0, 0);
			// this.m_rscene.addEntity(this.m_sph);
			// this.m_sphPv = this.m_sph.getPosition();
			// // return;
			let axis = new Axis3DEntity();
			axis.initialize();
			console.log("BBBBBBBB dfsfsd9");
			this.m_rscene.addEntity(axis);
			return;
			/*
            let plane: Plane3DEntity = new Plane3DEntity();
            //plane.wireframe = true;
            plane.color0.setRGB3f(1.0, 0.0, 0.0);
            plane.color2.setRGB3f(0.0, 1.0, 0.0);
            plane.vertColorEnabled = true;
            //plane.showDoubleFace();
            plane.initializeXOZ(-500.0, -500.0, 1000.0, 1000.0, [tex0]);
            //plane.initializeXOZ(-200.0,-150.0,400.0,300.0);
            plane.setXYZ(0.0, -100.0, 0.0);
            this.m_rscene.addEntity(plane);
            //return;
            //  return;
            //*/
			/*
            let billLine: BillboardLine3DEntity = new BillboardLine3DEntity();
            //lightLine.showDoubleFace();
            billLine.toBrightnessBlend();
            billLine.initialize([tex4]);
            billLine.setBeginAndEndPos(this.m_beginPos, this.m_endPos);
            billLine.setLineWidth(50.0);
            billLine.setRGB3f(0.1, 0.1, 0.1);
            //billLine.setUVOffset(0.0,0.5);
            billLine.setUVOffset(this.m_uvPos.x, this.m_uvPos.y);
            billLine.setFadeRange(0.3, 0.7);
            billLine.setRGBOffset3f(Math.random() * 1.5 + 0.1, Math.random() * 1.5 + 0.1, Math.random() * 1.5 + 0.1);
            this.m_rscene.addEntity(billLine, 1);
            //billLine.setFadeFactor(0.5);
            this.m_billLine = billLine;
            // return;
            //*/
			/*
            let lightLine:LightLine3DEntity = new LightLine3DEntity();
            //lightLine.showDoubleFace();
            lightLine.toBrightnessBlend();
            //lightLine.initialize(new Vector3D(-400.0,0.0,-400.0), new Vector3D(400.0,300.0,100.0), 200.0,[tex3]);
            lightLine.initialize(new Vector3D(0.0,0.0,0.0), new Vector3D(0.0,500.0,-100.0), 100.0,[tex4]);
            lightLine.setRGB3f(0.1,0.1,0.1);
            lightLine.setRGBOffset3f(Math.random() * 1.5 + 0.1,Math.random() * 1.5 + 0.1,Math.random() * 1.5 + 0.1);
            this.m_rscene.addEntity(lightLine,1);
            lightLine.setFadeFactor(0.5);
            //return;
            //*/
			//let posV:Vector3D = new Vector3D();

			let material = new Default3DMaterial();
			material.normalEnabled = true;
			// material.setTextureList([tex0]);
			material.initializeByCodeBuf(material.getTextureAt(0) != null);

			let ringRadius = 200;
			let latitudeNumSegments = 30;
			let torusMesh = new Torus3DMesh();
			torusMesh.axisType = 2;
			torusMesh.setVtxBufRenderData(material);
			torusMesh.initialize(ringRadius, 60, 30, latitudeNumSegments);
			/*
            let linevs = new Float32Array([0,0,0, 100,0,0, 100,0,100]);
            let pvs = torusMesh.geometry.getVSSegAt(1).slice();
            let line = new Line3DEntity();
            line.initializeByPosVS(pvs);
            this.m_rscene.addEntity(line, 1);
            let pi2 = 2.0 * Math.PI * 0.3;
            let rad = 0.0;
            let pv = new Vector3D();
            let mat4A = new Matrix4();
            //latitudeNumSegments
            for (let i = 0; i <= latitudeNumSegments; ++i) {

                rad = pi2 * i / latitudeNumSegments;
                pv.y = Math.cos(rad) * ringRadius;
                pv.x = Math.sin(rad) * ringRadius;
                mat4A.identity();
                // mat4B.identity();
                console.log("XXX rad: ", rad);
                mat4A.rotationZ(-rad);
                mat4A.setTranslation(pv);
                // mat4A.append(mat4B);

                let pvs = torusMesh.geometry.getVSSegAt(1).slice();
                mat4A.transformVectorsSelf(pvs, pvs.length);
                let line = new Line3DEntity();
                line.initializeByPosVS(pvs);
                this.m_rscene.addEntity(line, 1);
                // g.transformAt(i, mat4A);
            }
            //*/
			///*
			let torusEntity = new DisplayEntity();
			torusEntity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
			torusEntity.setMaterial(material);
			torusEntity.setMesh(torusMesh);

			this.m_rscene.addEntity(torusEntity, 1);
			//*/
			// return;
			///*
			let pipe: Tube3DEntity = new Tube3DEntity();
			pipe.axisType = 2;
			//pipe.wireframe = true;
			// pipe.showDoubleFace();
			//pipe.toBrightnessBlend(false,true);
			pipe.initialize(50.0, 200.0, 8, 1, [tex3]);
			//pipe.setXYZ(Math.random() * 500.0 - 250.0,Math.random() * 50.0 + 10.0,Math.random() * 500.0 - 250.0);
			this.m_rscene.addEntity(pipe, 1);
			// return;
			//*/
			///*
			//  pipe.getCircleCenterAt(0,posV);
			//  console.log("XXX posV: ",posV);
			//  return;
			let srcBillboard: Billboard3DEntity = new Billboard3DEntity();
			srcBillboard.initialize(100.0, 100.0, [tex2]);
			for (i = 0; i < 2; ++i) {
				let billboard: Billboard3DEntity = new Billboard3DEntity();
				billboard.copyMeshFrom(srcBillboard);
				billboard.toBrightnessBlend();
				billboard.initialize(100.0, 100.0, [tex2]);
				billboard.setXYZ(Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
				billboard.setFadeFactor(Math.random());
				this.m_rscene.addEntity(billboard);
				this.m_equeue.addBillEntity(billboard, false);
			}

			for (i = 0; i < 2; ++i) {
				let billboard: Billboard3DEntity = new Billboard3DEntity();
				billboard.copyMeshFrom(srcBillboard);
				billboard.toBrightnessBlend();
				billboard.initialize(100.0, 100.0, [tex3]);
				billboard.setXYZ(Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
				billboard.setFadeFactor(Math.random());
				this.m_rscene.addEntity(billboard);
				this.m_equeue.addBillEntity(billboard, false);
			}
			//*/
			let srcBox: Box3DEntity = new Box3DEntity();
			srcBox.wireframe = true;
			srcBox.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);

			let box: Box3DEntity = null;
			for (i = 0; i < 2; ++i) {
				box = new Box3DEntity();
				if (srcBox != null) box.setMesh(srcBox.getMesh());
				//box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
				box.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
				box.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
				this.m_rscene.addEntity(box);
			}

			for (i = 0; i < 1; ++i) {
				let sphere: Sphere3DEntity = new Sphere3DEntity();
				sphere.initialize(50.0, 15, 15, [tex1]);
				sphere.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
				this.m_rscene.addEntity(sphere);
			}
			for (i = 0; i < 2; ++i) {
				let cylinder: Cylinder3DEntity = new Cylinder3DEntity();
				//cylinder.wireframe = true;
				cylinder.initialize(30, 80, 15, [tex0]);
				cylinder.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
				this.m_rscene.addEntity(cylinder);
			}
		}
	}
	private m_time: number = 1.1;
	private m_uvRotation: number = 0.0;
	run(): void {
		if (this.m_rscene != null) {
			if (this.m_billLine != null) {
				//  this.m_time += 0.01;
				//  this.m_billLine.setFadeFactor(Math.abs(Math.cos(this.m_time)));
				//  /*
				this.m_beginPos.x = 200.0 * Math.sin(this.m_time);
				//this.m_endPos.x = 200.0 * Math.sin(this.m_time);
				this.m_time += 0.02;
				this.m_uvPos.x += 0.01;
				this.m_uvPos.y += 0.01;
				this.m_uvRotation += 1.0;
				this.m_billLine.setUVOffset(this.m_uvPos.x, this.m_uvPos.y);
				//this.m_billLine.setUVRotation(this.m_uvRotation);
				//this.m_billLine.setEndPos(this.m_endPos);
				this.m_billLine.setBeginPos(this.m_beginPos);
				//this.m_billLine.setBeginAndEndPos(this.m_beginPos,this.m_endPos);
				//*/
			}

			this.m_equeue.run();
			// if (this.m_statusDisp != null) this.m_statusDisp.update();

			this.m_stageDragSwinger.runWithYAxis();
			this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);
			this.m_rscene.run();
		}
	}
}
export default DemoPrimitive;
