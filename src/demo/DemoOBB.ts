import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import DisplayEntityContainer from "../vox/entity/DisplayEntityContainer";
import Box3DEntity from "../vox/entity/Box3DEntity";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import OBB from "../vox/geom/OBB";
import IColorMaterial from "../vox/material/mcase/IColorMaterial";
import BoxFrame3D from "../vox/entity/BoxFrame3D";
import Vector3D from "../vox/math/Vector3D";
import IOBB from "../vox/geom/IOBB";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import Line3DEntity from "../vox/entity/Line3DEntity";

export class DemoOBB {
	private m_rscene: RendererScene = null;
	private m_texLoader: ImageTextureLoader = null;

	private m_profileInstance = new ProfileInstance();

	constructor() {}

	private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
		let ptex = this.m_texLoader.getImageTexByUrl(purl);
		ptex.mipmapEnabled = mipmapEnabled;
		if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
		return ptex;
	}
	initialize(): void {
		console.log("DemoOBB::initialize()......");

		if (this.m_rscene == null) {
			RendererDevice.SHADERCODE_TRACE_ENABLED = false;

			let rparam = new RendererParam();
			rparam.setAttriAntialias(true);
			rparam.setCamProject(45.0, 10.1, 3000.0);
			rparam.setCamPosition(1500.0, 1500.0, 1500.0);

			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam);
			this.m_rscene.setClearRGBColor3f(0.1, 0.3, 0.2);

			this.m_profileInstance.initialize(this.m_rscene.getRenderer());

			new RenderStatusDisplay(this.m_rscene, true);
			new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);

			this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

			this.init3DScene();
		}
	}

	private init3DScene(): void {
		// this.test01();
		this.test02();
	}
	private buildByOBB(obb: IOBB, scale: number = 1.0): void {
		let pv = new Vector3D();
		// bottom frame plane wit "-y axis"
		let et = obb.extent.clone().scaleBy(scale);

		let cv = obb.center.clone();
		let max_vx = obb.axis[0].clone().scaleBy(et.x);
		let max_vy = obb.axis[1].clone().scaleBy(et.y);
		let max_vz = obb.axis[2].clone().scaleBy(et.z);
		let min_vx = max_vx.clone().scaleBy(-1);//.addBy(cv);
		let min_vy = max_vy.clone().scaleBy(-1);//.addBy(cv);
		let min_vz = max_vz.clone().scaleBy(-1);//.addBy(cv);
		// max_vx.addBy(cv);
		// max_vy.addBy(cv);
		// max_vz.addBy(cv);

		console.log("max_vy: ", max_vy);

		// 与"y"轴垂直的上面
		let maxV = max_vx.clone().addBy(max_vy).addBy(max_vz).addBy(cv);
		let v0 = maxV;
		console.log("v0: ", max_vy);
		let v1 = max_vx.clone().addBy(max_vy).addBy(min_vz).addBy(cv);
		let v2 = min_vx.clone().addBy(max_vy).addBy(min_vz).addBy(cv);
		let v3 = min_vx.clone().addBy(max_vy).addBy(max_vz).addBy(cv);

		let p0 = max_vx.clone().addBy(min_vy).addBy(max_vz).addBy(cv);
		let p1 = max_vx.clone().addBy(min_vy).addBy(min_vz).addBy(cv);
		let p2 = min_vx.clone().addBy(min_vy).addBy(min_vz).addBy(cv);
		let p3 = min_vx.clone().addBy(min_vy).addBy(max_vz).addBy(cv);

		let ls = [v0, v1, v2, v3, p0, p1, p2, p3];
		let centV = new Vector3D();
		for(let i = 0; i < ls.length; ++i) {
			centV.addBy( ls[i] );
			// let sph = new Sphere3DEntity();
			// sph.initialize(5, 20,20);
			// sph.setPosition(ls[i]);
			// this.m_rscene.addEntity( sph );
		}
		centV.scaleBy(1.0 / ls.length);
		console.log("cv: ", cv);
		console.log("centV: ", centV);

		let size = 150;
		let axis_x = new Line3DEntity();
		axis_x.dynColorEnabled = true;
		axis_x.initialize(cv, obb.axis[0].clone().scaleBy(150).addBy(cv));
		axis_x.setRGB3f(1.0, 0, 0);
		this.m_rscene.addEntity( axis_x );

		let axis_y = new Line3DEntity();
		axis_y.dynColorEnabled = true;
		axis_y.initialize(cv, obb.axis[1].clone().scaleBy(150).addBy(cv));
		axis_y.setRGB3f(0, 1.0, 0);
		this.m_rscene.addEntity( axis_y );

		let axis_z = new Line3DEntity();
		axis_z.dynColorEnabled = true;
		axis_z.initialize(cv, obb.axis[2].clone().scaleBy(150).addBy(cv));
		axis_z.setRGB3f(0, 0, 1.0);
		this.m_rscene.addEntity( axis_z );

	}
	private test02(): void{

		console.log("test02() ------------------------------------- >>>>>>>>");
		let axis = new Axis3DEntity();
		axis.initialize(300);
		this.m_rscene.addEntity(axis);

		let box0 = new Box3DEntity();
		box0.normalEnabled = true;
		box0.initializeSizeXYZ(100, 100, 100);
		box0.setXYZ(0, 0, 0);
		box0.setRotationXYZ(0, 0, 30);
		this.m_rscene.addEntity(box0);
		let obb0 = new OBB();
		obb0.fromAABB(box0.getLocalBounds(), box0.getMatrix());
		this.buildByOBB(obb0);
		let obbFrame0 = new BoxFrame3D();
		obbFrame0.color.setRGB3f(1.0,0.0,0.0);
		obbFrame0.initializeByOBB(obb0, 1.002);
		this.m_rscene.addEntity(obbFrame0);

		let box1 = new Box3DEntity();
		box1.normalEnabled = true;
		box1.initializeSizeXYZ(80, 80, 80);
		(box1.getMaterial() as IColorMaterial).setRGB3f(0.5, 1.0, 0.8);
		box1.setXYZ(65, 80, 0);
		box1.setRotationXYZ(0, 90, 80);
		this.m_rscene.addEntity(box1);


		console.log(" ------------------------------------- ");

		let obb1 = new OBB();
		obb1.fromAABB(box1.getLocalBounds(), box1.getMatrix());
		this.buildByOBB(obb1);
		let obbFrame1 = new BoxFrame3D();
		obbFrame1.color.setRGB3f(1.0,1.0,0.0);
		obbFrame1.initializeByOBB(obb1, 1.002);
		this.m_rscene.addEntity(obbFrame1);

		console.log(" ------------------------------------- ");

		console.log("obb0: ", obb0);
		console.log("obb1: ", obb1);
		// let intersection = obb0.intersect(obb1);

		// let intersection = obb0.obbIntersect(obb0, obb1);

		// let intersection0 = obb0.obbIntersect2(obb0, obb1);
		// let intersection1 = obb0.obbIntersect2(obb1, obb0);
		// let intersection = intersection0 && intersection1;
		// console.log("$$$$$$$$$ intersection0: ", intersection0);
		// console.log("$$$$$$$$$ intersection1: ", intersection1);
		// console.log("$$$$$$$$$ intersection: ", intersection);

		let intersection = obb0.obbIntersect2(obb0, obb1);
		console.log("$$$$$$$$$ intersection: ", intersection);
	}
	private test01(): void {

		console.log("test01() ------------------------------------- >>>>>>>>");

		let box0 = new Box3DEntity();
		box0.normalEnabled = true;
		box0.initializeSizeXYZ(100, 100, 100);
		box0.setXYZ(0, 0, 0);
		this.m_rscene.addEntity(box0);

		let box1 = new Box3DEntity();
		box1.normalEnabled = true;
		box1.initializeSizeXYZ(80, 80, 80);
		(box1.getMaterial() as IColorMaterial).setRGB3f(0.5, 1.0, 0.8);
		box1.setXYZ(60, 90.5, 0);
		this.m_rscene.addEntity(box1);

		let obb0 = new OBB();
		obb0.fromAABB(box0.getGlobalBounds());

		let obb1 = new OBB();
		obb1.fromAABB(box1.getGlobalBounds());

		console.log("obb0: ", obb0);
		console.log("obb1: ", obb1);
		// let intersection = obb0.intersect(obb1);
		let intersection = obb0.obbIntersect(obb0, obb1);
		console.log("intersection: ", intersection);
	}
	mouseDownListener(evt: any): void {
		console.log("mouseDownListener call, this.m_rscene: ", this.m_rscene.toString());
	}
	run(): void {
		if (this.m_rscene) {
			this.m_rscene.run();

			if (this.m_profileInstance) {
				this.m_profileInstance.run();
			}
		}
	}
}
export default DemoOBB;
