/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import Billboard3DFlowEntity from "../../vox/entity/Billboard3DFlowEntity";
import Color4 from "../../vox/material/Color4";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";

import IPoolNode from "../../vox/base/IPoolNode";
import PoolNodeBuilder from "../../vox/base/PoolNodeBuilder";
import { FollowParticleParam } from "./FollowParticleParam";
import { ParticleShootParam } from "./ParticleShootParam";

class ParticleNode implements IPoolNode {

	pos = new Vector3D();
	time = new Vector3D();
	color = new Color4();
	index = 0;
	entity: Billboard3DFlowEntity = null;

	lifeTimeBase = 50.0;
	lifeTimeRange = 50.0;

	param: FollowParticleParam = null;
	accVScale = -1.0;
	constructor() { }

	uid = 0;
	reset(): void { }
	destroy(): void {
		this.entity = null;
		this.param = null;
	}
	update(dstPos: Vector3D, range: number): void {

		const et = this.entity;
		const pv = this.pos;
		if (this.accVScale >= 0.0) {
			pv.setXYZ(Math.random() * 0.6 - 0.3, Math.random() * 0.6 - 0.3, Math.random() * 0.6 - 0.3);
			pv.scaleBy(this.accVScale);
			et.setAccelerationAt(this.index, pv.x, pv.y, pv.z);
			this.accVScale = -1.0;
		}
		const hr = 0.5 * range;
		pv.setXYZ(Math.random() * range - hr, Math.random() * range + hr, Math.random() * range - hr);
		pv.addBy(dstPos);

		const t = this.time;
		t.x = this.param.lifetimeScale * (Math.random() * this.lifeTimeRange + this.lifeTimeBase);
		t.w = this.entity.getTime();
		et.setPositionAt(this.index, pv.x, pv.y, pv.z);
		et.setTimeAt(this.index, t.x, t.y, t.z, t.w);
		et.updateData();
		et.updateMeshToGpu();
	}
	isVisible(): boolean {
		const t = this.entity.getTime();
		return t >= this.time.w && t <= this.time.w + this.time.x;
	}
	isNotVisible(): boolean {
		const t = this.entity.getTime();
		return t < this.time.w || t > this.time.w + this.time.x;
	}
}
class PNodeBuilder extends PoolNodeBuilder {
	private m_currNodes: ParticleNode[] = [];
	entity: Billboard3DFlowEntity = null;
	unlock = true;
	minIndex = 0;
	maxIndex = 0;
	ivsIndex = 0;
	ivsCount = 0;
	constructor() {
		super();
	}
	protected createNode(): IPoolNode {
		return new ParticleNode();
	}
	getCurrNodes(): ParticleNode[] {
		return this.m_currNodes;
	}
	hasFreeNode(): boolean {
		if (this.m_currNodes.length > 0) {
			return true;
		}
		return super.hasFreeNode();
	}
	create(): ParticleNode {
		let ls = this.m_currNodes;
		if (ls.length > 0) {
			for (let i = 0; i < ls.length; ++i) {
				if (ls[i].isNotVisible()) {
					this.restore(ls[i]);
					ls.splice(i, 1);
				}
			}
		}
		if (super.hasFreeNode() || this.unlock) {

			let node = super.create() as ParticleNode;
			ls.push(node);

			this.minIndex = node.index;
			this.maxIndex = node.index;

			for (let i = 0; i < ls.length; ++i) {
				const node = ls[i];
				if (this.minIndex > node.index) {
					this.minIndex = node.index;
				} else if (this.maxIndex < node.index) {
					this.maxIndex = node.index;
				}
			}
			this.ivsCount = (this.maxIndex - this.minIndex + 1) * 6;
			this.ivsIndex = this.minIndex * 6;
			return node;
		}
		return null;
	}
	getNodes(): ParticleNode[] {
		return super.getNodes() as ParticleNode[];
	}

	destroy(): void {
		this.m_currNodes = [];
		this.unlock = true;
		this.entity = null;
		super.destroy();
	}
}
class FollowParticle {
	private m_nodeBuilder = new PNodeBuilder();
	private m_total = 0;
	private m_playOnce = true;
	protected m_param: FollowParticleParam = null;
	particleEntity: Billboard3DFlowEntity = null;
	constructor() { }
	initialize(total: number, param: FollowParticleParam): void {
		this.m_total = total;
		this.m_param = param;
		// this.initTest();

		const p = this.m_param;
		const ts = p.textures;
		this.initfollowBill(ts[0], ts.length > 1 ? ts[1] : null, this.m_playOnce);
		this.m_nodeBuilder.entity = this.particleEntity;
	}
	getParam(): FollowParticleParam {
		return this.m_param;
	}
	/**
	 * @param pv the base position
	 * @param total current shooting particles total, the defualt value 1
	 * @param spaceRadius particle creation space radius, the defualt value 20
	 * @param accelerationScale the defualt value -1.0
	 * @param stepDis the defualt value 30
	 */
	addPosition(pv: Vector3D, total: number = 1, spaceRadius: number = 20, accelerationScale: number = -1.0, stepDis: number = 30): void {
	}
	shoot(pv: Vector3D, param: ParticleShootParam): void {
		// const total = Math.random() * 2 + 1;
		// const spaceRange = Math.random() * 15 + 15;
		// const p = this.m_param;
		// p.lifetimeScale = Math.random() * 1.7 + 0.3;
		pv = param.getPosition(pv);
		let total = param.getTotalValue();
		let spaceRaduis = param.getSpaceRadiusValue();
		this.m_param.lifetimeScale = param.getLifeTimeStaleValue();
		// this.addPosition(pv, total, spaceRaduis, (Math.random() - 0.5) * (0.1 * Math.random() + 0.01));
		this.addPosition(pv, total, spaceRaduis, param.getAccelerationScale(), param.stepDistance);
	}
	createParticles(pos: Vector3D, total: number, range: number, accelerationScale: number = -1.0): void {

		const builder = this.m_nodeBuilder;
		for (let i = 0; i < total; ++i) {
			if (builder.hasFreeNode()) {
				const node = builder.create();
				if (node) {
					if (accelerationScale >= 0.0) {
						node
					}
					node.update(pos, range);
				}
			} else {
				console.log("has not free node.")
				break;
			}
		}
		// force to build the bounds.
		let ls = builder.getCurrNodes();
		total = ls.length;
		// let ab = this.particleEntity.getMesh().bounds;
		// for (let i = 0; i < total; ++i) {
		// }
		// console.log("builder.ivsIndex, builder.ivsCount: ", builder.ivsIndex, builder.ivsCount);
		const et = builder.entity;
		et.getMaterial().vtxInfo.setIvsParam(builder.ivsIndex, builder.ivsCount);
	}
	run(): void {
		this.particleEntity.updateTime(1.0);
	}
	private initfollowBill(
		tex: IRenderTexture,
		colorTex: IRenderTexture,
		playOnce: boolean = false
	): void {
		let size = 100;
		const p = this.m_param;
		let total = this.m_total;
		let billGroup = new Billboard3DFlowEntity();
		this.particleEntity = billGroup;
		billGroup.flipVerticalUV = p.flipVerticalUV;
		billGroup.vtxColorEnabled = p.vtxColorEnabled;
		billGroup.premultiplyAlpha = p.premultiplyAlpha;
		billGroup.brnToAlpha = p.brnToAlpha;
		billGroup.clipRectEnabled = p.clipRectEnabled;
		billGroup.vtxClipUVRectEnabled = p.vtxClipUVRectEnabled;

		let clipEnabled = p.clipEnabled;
		let direcEnabled = p.direcEnabled;
		let clipMixEnabled = p.clipMixEnabled;

		billGroup.createGroup(total);

		// let color = new Color4();
		let pv = new Vector3D();
		let cn = p.clipRN;
		let rn = p.clipCN;
		let uvGridsTotal = cn * rn;
		let dw = 1.0 / cn;
		let dh = 1.0 / rn;

		let builder = this.m_nodeBuilder;
		let node: ParticleNode;
		let nodes: ParticleNode[] = [];
		let sizeParam = this.m_param.sizeParam;
		for (let i = 0; i < total; ++i) {
			size = Math.random() * sizeParam.y + sizeParam.x;
			if (total < 2) {
				size = 100.0;
			}
			billGroup.setSizeAndScaleAt(i, size, size, sizeParam.z, sizeParam.w);
			if (!clipEnabled) {
				// const uvParam = this.getAreaParam(cn, rn);
				const uvr = p.getUVRectAt(i);
				billGroup.setUVRectAt(i, uvr[0], uvr[1], uvr[2], uvr[3]);
			}
			if(p.vtxClipUVRectEnabled) {
				const vars = p.getAreaUVRectAt(i);
				billGroup.setVtxClipAreaUVRectAt(i, vars[0], vars[1], vars[2], vars[3]);
			}
			node = builder.create();
			node.entity = billGroup;
			node.index = i;
			node.param = this.m_param;

			node.time.setTo(50, 0.2, 0.5, 0.0);

			// billGroup.setBrightnessAt(i, Math.random() * 0.8 + 0.8);
			billGroup.setBrightnessAt(i, p.getBrnOrAlpha(i));
			// color.randomRGB();
			// color.a = Math.random() * 1.2;
			const color = p.getColor(i);
			billGroup.setColorAt(i, color);

			// for test
			// billGroup.setTimeAt(i, 100, 0.2, 0.8, 150.0);
			// if (total > 1) {
			// 	// pv.setTo(Math.random() * 500.0 - 250.0, Math.random() * 50.0 + 50.0, Math.random() * 500.0 - 250.0);
			// 	// billGroup.setPositionAt(i, pv.x, pv.y, pv.z);
			// } else {
			// 	billGroup.setPositionAt(0, 0, 0, 0);
			// }
			pv.setXYZ(Math.random() * 0.6 - 0.3, Math.random() * 0.6 - 0.3, Math.random() * 0.6 - 0.3);
			pv.scaleBy(this.m_param.speedScale);
			billGroup.setVelocityAt(i, pv.x, pv.y, pv.z);

			pv.setXYZ(Math.random() * 0.6 - 0.3, Math.random() * 0.6 - 0.3, Math.random() * 0.6 - 0.3);
			pv.scaleBy(this.m_param.accelerationScale);
			billGroup.setAccelerationAt(i, pv.x, pv.y, pv.z);

			nodes.push(node);
		}
		billGroup.setPlayParam(playOnce, direcEnabled, clipMixEnabled);
		if (colorTex) {
			billGroup.initialize(p.brightnessEnabled, p.alphaEnabled, clipEnabled, [tex, colorTex]);
		} else {
			billGroup.initialize(p.brightnessEnabled, p.alphaEnabled, clipEnabled, [tex]);
		}
		billGroup.setClipUVParam(cn, uvGridsTotal, dw, dh);
		// 保证没有激活的粒子不显示
		billGroup.setTime(130);

		for (let i = 0; i < total; ++i) {
			builder.restore(nodes[i]);
		}
		builder.unlock = false;
	}
	destroy(): void {
		this.m_nodeBuilder.destroy();
	}
}

export {ParticleShootParam, FollowParticleParam, FollowParticle }
