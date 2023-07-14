import Vector3D from "../vox/math/Vector3D";
import MouseEvent from "../vox/event/MouseEvent";
import RendererDevice from "../vox/render/RendererDevice";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";

import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import DebugFlag from "../vox/debug/DebugFlag";
import IRenderTexture from "../vox/render/texture/IRenderTexture";

import PBRMaterial from "./material/PBRMaterial";
import PBRShaderDecorator from "./material/PBRShaderDecorator";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import DracoMesh from "../voxmesh/draco/DracoMesh";
import { DracoWholeModuleLoader } from "../voxmesh/draco/DracoModuleLoader";
import DisplayEntity from "../vox/entity/DisplayEntity";

import { PointLight } from "../light/base/PointLight";
import { DirectionLight } from "../light/base/DirectionLight";
import { SpotLight } from "../light/base/SpotLight";
import { IShaderLibListener, CommonMaterialContext, MaterialContextParam } from "../materialLab/base/CommonMaterialContext";
import { DebugMaterialContext } from "../materialLab/base/DebugMaterialContext";
import { VertUniformComp } from "../vox/material/component/VertUniformComp";
import { EntityLayouter } from "../vox/utils/EntityLayouter";

import { CoModuleVersion, CoGeomDataType, CoModelTeamLoader } from "../cospace/app/common/CoModelTeamLoader";
import Matrix4 from "../vox/math/Matrix4";
import MeshFactory from "../vox/mesh/MeshFactory";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
export class DemoPBRViewer2 implements IShaderLibListener {
	private m_rscene: RendererScene = null;
	private m_materialCtx = new DebugMaterialContext();

	fogEnabled = false;
	hdrBrnEnabled = true;
	vtxFlatNormal = false;
	aoMapEnabled = false;

	private m_layouter = new EntityLayouter();
	private m_modelLoader = new CoModelTeamLoader();

	constructor() {}
	initialize(): void {
		console.log("DemoPBRViewer2::initialize()......");
		if (this.m_rscene == null) {
			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			//RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

			let rparam: RendererParam = new RendererParam();
			//rparam.maxWebGLVersion = 1;
			// rparam.cameraPerspectiveEnabled = false;
			rparam.setCamProject(45, 50.0, 10000.0);
			rparam.setAttriStencil(true);
			rparam.setAttriAntialias(true);
			//rparam.setCamPosition(2000.0, 2000.0, 2000.0);
			rparam.setCamPosition(800.0, 800.0, 800.0);

			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam, 5);
			this.m_rscene.updateCamera();

			this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
			this.m_rscene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUp);

			this.m_rscene.enableMouseEvent(true);
			new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true, 0);

			this.m_rscene.setClearRGBColor3f(0.2, 0.2, 0.2);

			this.initMaterialCtx();
		}
	}
	private initMaterialCtx(): void {
		let mcParam = new MaterialContextParam();
		mcParam.pointLightsTotal = 1;
		mcParam.directionLightsTotal = 2;
		mcParam.spotLightsTotal = 0;
		mcParam.loadAllShaderCode = true;
		mcParam.shaderCodeBinary = true;
		mcParam.lambertMaterialEnabled = false;
		mcParam.pbrMaterialEnabled = true;
		mcParam.shaderLibVersion = 'v101';
		mcParam.shaderFileNickname = true;
		// 下面这一句设置为false的时候，则会启用外部编译好的shader代码
		this.m_materialCtx.debugEnabled = true;
		this.m_materialCtx.addShaderLibListener(this);
		this.m_materialCtx.initialize(this.m_rscene, mcParam);

		let pointLight: PointLight = this.m_materialCtx.lightModule.getPointLightAt(0);
		if (pointLight != null) {
			// pointLight.position.setXYZ(200.0, 180.0, 200.0);
			pointLight.position.setXYZ(0.0, 190.0, 0.0);
			pointLight.color.setRGB3f(0.0, 2.2, 0.0);
			pointLight.attenuationFactor1 = 0.00001;
			pointLight.attenuationFactor2 = 0.00005;
		}
		let spotLight: SpotLight = this.m_materialCtx.lightModule.getSpotLightAt(0);
		if (spotLight != null) {
			spotLight.position.setXYZ(0.0, 30.0, 0.0);
			spotLight.direction.setXYZ(0.0, -1.0, 0.0);
			spotLight.color.setRGB3f(0.0, 40.2, 0.0);
			spotLight.attenuationFactor1 = 0.000001;
			spotLight.attenuationFactor2 = 0.000001;
			spotLight.angleDegree = 30.0;
		}
		let directLight: DirectionLight = this.m_materialCtx.lightModule.getDirectionLightAt(0);
		if (directLight != null) {
			directLight.color.setRGB3f(2.0, 0.0, 0.0);
			directLight.direction.setXYZ(-1.0, -1.0, 0.0);
			directLight = this.m_materialCtx.lightModule.getDirectionLightAt(1);
			if (directLight != null) {
				directLight.color.setRGB3f(0.0, 0.0, 2.0);
				directLight.direction.setXYZ(1.0, 1.0, 0.0);
			}
		}
		this.m_materialCtx.lightModule.update();
		//  this.m_materialCtx.lightModule.showInfo();
	}
	shaderLibLoadComplete(loadingTotal: number, loadedTotal: number): void {
		console.log("shaderLibLoadComplete(), loadingTotal, loadedTotal: ", loadingTotal, loadedTotal);

		let urls = ["static/assets/obj/apple_01.obj"];
		let loader = this.m_modelLoader;
		loader.load(urls, (models: CoGeomDataType[], transforms: Float32Array[]): void => {
			this.m_layouter.layoutReset();
			for (let i = 0; i < models.length; ++i) {
				// this.createEntity(models[i], transforms != null ? transforms[i] : null, 2.0);
				this.createPBREntity(models[i], transforms != null ? transforms[i] : null, 2.0);
			}
			this.m_layouter.layoutUpdate(200, new Vector3D(0, 0, 0));
		});
	}
	// private createMeshPlane(material: PBRMaterial): void {
	// 	let size: number = 400.0;

	// 	let gridGeom: QuadGridMeshGeometry = new QuadGridMeshGeometry();
	// 	gridGeom.normalEnabled = true;
	// 	//gridGeom.normalScale = -1.0;
	// 	gridGeom.initializeXOZPlane(new Vector3D(-0.5 * size, 0, -0.5 * size), size, size, 200, 200);
	// 	//console.log("gridGeom: ", gridGeom);

	// 	let dataMesh: DataMesh = new DataMesh();
	// 	//dataMesh.wireframe = true;
	// 	dataMesh.setBufSortFormat(material.getBufSortFormat());
	// 	dataMesh.initializeFromGeometry(gridGeom);

	// 	let entity: DisplayEntity = new DisplayEntity();
	// 	entity.setMaterial(material);
	// 	entity.setMesh(dataMesh);
	// 	//entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
	// 	//entity.setScaleXYZ(4.0,12.0,4.0);
	// 	//entity.setXYZ(0,-400,0);
	// 	this.m_rscene.addEntity(entity);
	// }
	private m_rotV: Vector3D = new Vector3D(Math.random() * 360.0, Math.random() * 360.0, Math.random() * 360.0);
	private createPBREntity(model: CoGeomDataType, transform: Float32Array = null, uvScale: number = 1.0): void {
		let axis = new Axis3DEntity();
		//  axis.initialize(300.0);
		//  this.m_rscene.addEntity(axis);
		this.aoMapEnabled = true;
		let ns: string = "lava_03";
		let diffuseMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_COLOR.png");
		diffuseMap.flipY = true;
		//diffuseMap = this.m_materialCtx.getTextureByUrl("static/assets/noise.jpg");
		let normalMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_NRM.png");
		normalMap.flipY = true;
		let aoMap: IRenderTexture = null;
		if (this.aoMapEnabled) {
			//aoMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_OCC.png");
			aoMap = this.m_materialCtx.getTextureByUrl("static/assets/circleWave_disp.png");
		}
		let displacementMap: IRenderTexture = null;
		//displacementMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_DISP.png");
		displacementMap = this.m_materialCtx.getTextureByUrl("static/assets/circleWave_disp.png");
		let parallaxMap: IRenderTexture = null;
		//parallaxMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_DISP.png");
		//parallaxMap = this.m_materialCtx.getTextureByUrl("static/assets/circleWave_disp.png");
		parallaxMap = this.m_materialCtx.getTextureByUrl("static/assets/brick_bumpy01.jpg");

		// for test
		// displacementMap = null;
		// parallaxMap = null;
		// diffuseMap = null;
		// aoMap = null;
		// normalMap = null;
		this.aoMapEnabled = aoMap != null


		let material: PBRMaterial;

		let vertUniform: VertUniformComp;
		material = this.createMaterial();
		vertUniform = material.vertUniform as VertUniformComp;

		//material.decorator.normalMapEnabled = false;
		// material.decorator.aoMapEnabled = this.aoMapEnabled;
		//material.decorator.aoMapEnabled = false;
		material.decorator.scatterEnabled = false;

		// material.decorator.specularEnvMap = this.m_specularEnvMap;
		material.decorator.diffuseMap = diffuseMap;
		material.decorator.normalMap = normalMap;
		// material.decorator.aoMap = aoMap;
		// vertUniform.displacementMap = displacementMap;

		// material.decorator.parallaxMap = parallaxMap;

		material.initializeByCodeBuf(true);

		vertUniform.setDisplacementParams(1.0, 0.0);
		material.setToneMapingExposure(1.0);
		material.setAlbedoColor(1.0, 1.0, 1.0);
		material.setScatterIntensity(2.0);
		material.setParallaxParams(1, 10, 5.0, 0.02);
		material.setSideIntensity(1.0);
		material.setRoughness(0.3);
		material.setMetallic(0.1);
		material.setAO(1.0);

		//material.setTextureList(texList);
		/*
		let srcSph = new Sphere3DEntity();
		srcSph.setMaterial(material);
		srcSph.initialize(100.0, 150, 150);
		srcSph.setRotation3(this.m_rotV);
		this.m_rscene.addEntity(srcSph);
        //*/
		let mesh = MeshFactory.createDataMeshFromModel(model, material);
		let entity = new DisplayEntity();
		entity.setMesh(mesh);
		entity.setMaterial(material);
		this.m_rscene.addEntity(entity);
		this.m_layouter.layoutAppendItem(entity, new Matrix4(transform));
	}
	private mouseDown(evt: any): void {
		DebugFlag.Flag_0 = 1;
	}
	private mouseUp(evt: any): void {}
	// private update(): void {
	// 	this.m_statusDisp.update(true);
	// }
	private m_lookV: Vector3D = new Vector3D(0.0, 300.0, 0.0);
	run(): void {
		// this.update();
		// this.m_stageDragSwinger.runWithYAxis();
		// this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

		this.m_rscene.run();

		DebugFlag.Flag_0 = 0;
	}

	makePBRMaterial(metallic: number, roughness: number, ao: number): PBRMaterial {
		let material: PBRMaterial = this.m_materialCtx.createPBRLightMaterial(true, true, true);
		let decorator: PBRShaderDecorator = material.decorator;
		decorator.scatterEnabled = false;
		decorator.woolEnabled = true;
		decorator.toneMappingEnabled = true;
		decorator.specularEnvMapEnabled = true;
		decorator.specularBleedEnabled = true;
		decorator.metallicCorrection = true;
		decorator.absorbEnabled = false;
		decorator.normalNoiseEnabled = false;
		decorator.pixelNormalNoiseEnabled = true;
		decorator.hdrBrnEnabled = this.hdrBrnEnabled;
		decorator.vtxFlatNormal = this.vtxFlatNormal;

		material.setMetallic(metallic);
		material.setRoughness(roughness);
		material.setAO(ao);

		return material;
	}
	createMaterial(): PBRMaterial {
		let material: PBRMaterial;
		material = this.makePBRMaterial(0.9, 0.0, 1.0);

		let decorator: PBRShaderDecorator = material.decorator;
		decorator.shadowReceiveEnabled = false;
		decorator.fogEnabled = this.fogEnabled;
		decorator.indirectEnvMapEnabled = false;
		decorator.specularEnvMapEnabled = true;
		decorator.diffuseMapEnabled = true;
		decorator.normalMapEnabled = true;
		//material.setTextureList(ptexList);
		return material;
	}
}

export class ViewerDracoModule extends DracoWholeModuleLoader {
	texLoader: ImageTextureLoader = null;
	reflectPlaneY: number = -220.0;
	aoMapEnabled: boolean = false;
	specularEnvMap: IRenderTexture;
	viewer: DemoPBRViewer2;
	materialCtx: CommonMaterialContext;
	constructor() {
		super();
	}

	dracoParse(pmodule: any, index: number, total: number): void {
		console.log("ViewerDracoModule dracoParse, total: ", total);
	}
	dracoParseFinish(modules: any[], total: number): void {
		console.log("ViewerDracoModule dracoParseFinish, modules: ", modules, this.m_pos);

		let uvscale: number = 0.01; //Math.random() * 7.0 + 0.6;
		let material: PBRMaterial = this.viewer.createMaterial();

		material.decorator.specularEnvMap = this.specularEnvMap;
		material.decorator.diffuseMap = this.materialCtx.getTextureByUrl("static/assets/modules/skirt/baseColor.jpg");
		material.decorator.normalMap = this.materialCtx.getTextureByUrl("static/assets/modules/skirt/normal.jpg");
		material.decorator.diffuseMap = this.materialCtx.getTextureByUrl("static/assets/modules/skirt/ao.jpg");

		material.decorator.diffuseMapEnabled = true;
		material.decorator.normalMapEnabled = true;
		material.decorator.vtxFlatNormal = false;
		material.decorator.aoMapEnabled = this.aoMapEnabled;
		material.initializeByCodeBuf(true);
		material.setAlbedoColor(Math.random() * 3, Math.random() * 3, Math.random() * 3);
		let scale: number = 3.0;
		let entity: DisplayEntity = new DisplayEntity();

		let mesh: DracoMesh = new DracoMesh();
		mesh.setBufSortFormat(material.getBufSortFormat());
		mesh.initialize(modules);
		entity.setMaterial(material);
		entity.setMesh(mesh);
		entity.setScaleXYZ(scale, scale, scale);
		entity.setRotationXYZ(-90, 0, 0);
		//entity.setRotationXYZ(0, Math.random() * 300, 0);
		//entity.setPosition( this.m_pos );
		this.m_rscene.addEntity(entity);

		this.loadNext();
	}
}
export default DemoPBRViewer2;
