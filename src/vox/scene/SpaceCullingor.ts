/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 整个渲染器的空间管理类接口规范

import IAABB from "../../vox/geom/IAABB";
import { IRenderCamera } from "../../vox/render/IRenderCamera";
import IEntity3DNode from "../../vox/scene/IEntity3DNode";
import ISpacePOV from "../../vox/scene/occlusion/ISpacePOV";
import ISpaceCullingor from "../../vox/scene/ISpaceCullingor";
import DebugFlag from "../debug/DebugFlag";
import { SpaceCullingMask } from "../space/SpaceCullingMask";

export default class SpaceCullingor implements ISpaceCullingor {

	private m_camera: IRenderCamera = null;
	private m_headNode: IEntity3DNode = null;
	private m_pocRawList: ISpacePOV[] = [];
	private m_pocList: ISpacePOV[] = [];
	private m_povNumber = 0;
	/**
	   * 可以被渲染的entity数量
	   */
	total = 0;
	addPOVObject(pov: ISpacePOV): void {
		if (pov != null) {
			this.m_pocRawList.push(pov);
			this.m_pocList.push(null);
		}
	}
	setCamera(cam: IRenderCamera): void {
		this.m_camera = cam;
	}
	setCullingNodeHead(headNode: IEntity3DNode): void {
		this.m_headNode = headNode;
	}
	getPOVNumber(): number {
		return this.m_povNumber;
	}
	run(): void {
		this.total = 0;
		this.m_povNumber = 0;
		let nextNode = this.m_headNode;
		if (nextNode != null) {
			let ab: IAABB = null;
			let cam = this.m_camera;;
			let pov: ISpacePOV = null;
			let pocList = this.m_pocList;
			let i = 0;
			let j = 0;
			let len = this.m_pocRawList.length;
			let boo = false;
			const camMask = SpaceCullingMask.CAMERA;

			for (i = 0; i < len; i++) {
				pov = this.m_pocRawList[i];
				if (pov.enabled) {
					pov.cameraTest(cam);
					if (pov.status > 0) {
						pov.begin();
						pocList[j] = pov;
						++j;
					}
				}
			}

			len = j;
			this.m_povNumber = j;
			while (nextNode != null) {
				nextNode.drawEnabled = false;
				// let ns = nextNode.entity.uuid;
				// if (ns != "") {
				// 	if (DebugFlag.Flag_0 > 0) {
				// 		console.log("cullingor ns: ", ns, nextNode.rstatus);
				// 	}
				// }
				if (nextNode.rstatus > 0) {
					ab = nextNode.bounds;
					const entity = nextNode.entity;
					const runit = nextNode.runit;
					if (entity.isVisible()) {
						// 不管是不是可渲染几何体的mesh entity都需要处理遮挡提出的操作
						if (runit.rendering) {
							boo = cam.visiTestSphere2(ab.center, ab.radius);
							if (boo && entity.spaceCullMask > camMask) {
								for (i = 0; i < len; i++) {
									pov = pocList[i];
									if(pov.enabled) {
										pov.test(nextNode.bounds, entity.spaceCullMask);
										boo = pov.status != 1;
										if (!boo) {
											break;
										}
									}
								}
							}
						} else {
							boo = false;
						}
					}
					this.total += boo ? 1 : 0;
					nextNode.drawEnabled = boo;
					entity.drawEnabled = boo;
					runit.rendering = boo;
					// if (boo && nextNode.distanceFlag) {
					// 	nextNode.rpoNode.setValue(-Vector3D.DistanceSquared(camPos, ab.center));
					// }
				}
				// if (ns != "") {
				// 	if (DebugFlag.Flag_0 > 0) {
				// 		console.log("cullingor ns: ", ns, ", nextNode.drawEnabled: ", nextNode.drawEnabled);
				// 	}
				// }
				nextNode = nextNode.next;
			}
		}
	}
}
