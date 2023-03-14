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
	addPOVObject(poc: ISpacePOV): void {
		if (poc != null) {
			this.m_pocRawList.push(poc);
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
			let poc: ISpacePOV = null;
			let pocList  = this.m_pocList;
			let i = 0;
			let j = 0;
			let len = this.m_pocRawList.length;
			let boo = false;
			const camMask = SpaceCullingMask.CAMERA;

			for (i = 0; i < len; i++) {
				poc = this.m_pocRawList[i];
				if (poc.enabled) {
					poc.cameraTest(cam);
					if (poc.status > 0) {
						poc.begin();
						pocList[j] = poc;
						++j;
					}
				}
			}

			len = j;
			this.m_povNumber = j;
			while (nextNode != null) {
				nextNode.drawEnabled = false;
				// let ns = nextNode.entity.uuid;
				// if(ns != "") {
				// 	if(DebugFlag.Flag_0 > 0) {
				// 		console.log("cullingor ns: ", ns, nextNode.rstatus);
				// 	}
				// }
				if (nextNode.rstatus > 0) {
					ab = nextNode.bounds;
					const entity = nextNode.entity;
					const rnode = nextNode.rpoNode;
					if (entity.isVisible()) {
						if (rnode.isVsible()) {
							boo = cam.visiTestSphere2(ab.center, ab.radius);
							if (boo && entity.spaceCullMask > camMask) {
								for (i = 0; i < len; i++) {
									poc = pocList[i];
									poc.test(nextNode.bounds, entity.spaceCullMask);
									boo = poc.status != 1;
									if (!boo) {
										break;
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
					rnode.drawEnabled = boo;
					//  if(boo && nextNode.distanceFlag)
					//  {
					//      nextNode.rpoNode.setValue(-Vector3D.DistanceSquared(camPos,ab.center));
					//  }
				}
				// if(ns != "") {
				// 	if(DebugFlag.Flag_0 > 0) {
				// 		console.log("cullingor ns: ", ns, ", nextNode.drawEnabled: ", nextNode.drawEnabled);
				// 	}
				// }
				nextNode = nextNode.next;
			}
		}
	}
}
