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

class ParticleNode implements IPoolNode {
	
	pos = new Vector3D();
	time = new Vector3D();
	color = new Color4();
	index = 0;
	entity: Billboard3DFlowEntity = null;

	lifeTimeBase = 50.0;
	lifeTimeRange = 50.0;
	lifeTimeScale = 1.0;
	constructor() { }

	uid = 0;
	reset(): void { }
	destroy(): void {
		this.entity = null;
	}
	update(dstPos: Vector3D, range: number): void {
		const hr = 0.5 * range;
		const pos = this.pos.setXYZ(Math.random() * range - hr, Math.random() * range + hr, Math.random() * range - hr);
		pos.addBy(dstPos);

		const t = this.time;
		t.x = this.lifeTimeScale * (Math.random() * this.lifeTimeRange + this.lifeTimeBase);
		t.w = this.entity.getTime();
		const et = this.entity;
		et.setPositionAt(this.index, pos.x, pos.y, pos.z);
		et.setTimeAt(this.index, t.x, t.y, t.z, t.w);
		et.updateData();
		et.updateMeshToGpu();
	}	isVisible(): boolean {
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
		if(this.m_currNodes.length > 0) {
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
		if(super.hasFreeNode() || this.unlock) {

			let node = super.create() as ParticleNode;
			ls.push(node);

			this.minIndex = node.index;
			this.maxIndex = node.index;
			
			for (let i = 0; i < ls.length; ++i) {
				const node = ls[i];
				if(this.minIndex > node.index) {
					this.minIndex = node.index;
				}else if(this.maxIndex < node.index) {
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
class FollowParticleParam {
	textures: IRenderTexture[] = null;
	uvParams: number[][] = [
		[0.0, 0.0, 0.5, 0.5],
		[0.5, 0.0, 0.5, 0.5],
		[0.0, 0.5, 0.5, 0.5],
		[0.5, 0.5, 0.5, 0.5]
	];
	speedScale = 1.0;
	timeScale = 1.0;
	constructor() {
	}
}
class FollowParticle {
	private m_nodeBuilder = new PNodeBuilder();
	private m_total = 0;
	private m_playOnce = true;
	private m_param: FollowParticleParam = null;
	particleEntity: Billboard3DFlowEntity = null;
	constructor() { }
	initialize(total: number, param: FollowParticleParam): void {
		this.m_total = total;
		this.m_param = param;
		this.initTest();
		this.m_nodeBuilder.entity = this.particleEntity;
	}
	createParticles(pos: Vector3D, total: number, range: number): void {

		const builder = this.m_nodeBuilder;
		for (let i = 0; i < total; ++i) {
			if (builder.hasFreeNode()) {
				const node = builder.create();
				if(node) {
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
	private initTest(): void {
		this.initfollowBill(this.m_param.textures[0], null, false, this.m_playOnce);
	}
	private initfollowBill(
		tex: IRenderTexture,
		colorTex: IRenderTexture,
		clipEnabled: boolean = false,
		playOnce: boolean = false,
		direcEnabled: boolean = false,
		clipMixEnabled: boolean = false
	): void {
		let size = 100;
		let uvParams = this.m_param.uvParams;
		let total = this.m_total;
		let billGroup = new Billboard3DFlowEntity();
		this.particleEntity = billGroup;
		billGroup.vtxColorEnabled = true;
		billGroup.createGroup(total);

		// billGroup.getMaterial().vtxInfo.set

		let color = new Color4();
		let pv = new Vector3D();
		let builder = this.m_nodeBuilder;
		let node: ParticleNode;
		let nodes: ParticleNode[] = [];
		for (let i = 0; i < total; ++i) {
			size = Math.random() * 40 + 10.0;
			if (total < 2) {
				size = 100.0;
			}
			billGroup.setSizeAndScaleAt(i, size, size, 0.2, 2.0);
			if (!clipEnabled) {
				let uparams = uvParams[Math.floor((uvParams.length - 1) * Math.random() + 0.5)];
				billGroup.setUVRectAt(i, uparams[0], uparams[1], uparams[2], uparams[3]);
			}
			node = builder.create();
			node.entity = billGroup;
			node.index = i;
			node.lifeTimeScale = this.m_param.timeScale;

			node.time.setTo(50, 0.2, 0.5, 0.0);
			billGroup.setBrightnessAt(i, Math.random() * 0.8 + 0.8);
			color.randomRGB();
			// color.a = Math.random() * 1.2;
			billGroup.setColorAt(i, color);

			// for test
			// billGroup.setTimeAt(i, 100, 0.2, 0.8, 150.0);
			if (total > 1) {
				pv.setTo(Math.random() * 500.0 - 250.0, Math.random() * 50.0 + 50.0, Math.random() * 500.0 - 250.0);
				billGroup.setPositionAt(i, pv.x, pv.y, pv.z);
			} else {
				billGroup.setPositionAt(0, 0, 0, 0);
			}
			pv.setXYZ(Math.random() * 0.6 - 0.3, Math.random() * 0.6 - 0.3, Math.random() * 0.6 - 0.3);
			pv.scaleBy(this.m_param.speedScale);
			billGroup.setAccelerationAt(i, 0.0, 0.0, 0.0);
			billGroup.setVelocityAt(i, pv.x, pv.y, pv.z);
			pv.normalize();
			pv.scaleBy((Math.random() * 2.0 + 0.2) * -1.0);
			//billGroup.setVelocityAt(i,pv.x,pv.y,pv.z);
			nodes.push(node);
		}
		billGroup.setPlayParam(playOnce, direcEnabled, clipMixEnabled);
		if (colorTex) {
			billGroup.initialize(true, false, clipEnabled, [tex, colorTex]);
			billGroup.setRGB3f(0.1, 0.1, 0.1);
		} else {
			billGroup.initialize(true, false, clipEnabled, [tex]);
		}
		// billGroup.setClipUVParam(4,16,0.25,0.25);
		billGroup.setClipUVParam(2, 4, 0.5, 0.5);
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

export {FollowParticleParam, FollowParticle}