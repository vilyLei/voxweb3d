/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 整个渲染器的空间管理类接口规范

import Vector3D from "../../vox/math/Vector3D";
import { IAABB } from "../../vox/geom/IAABB";
import CameraBase from "../../vox/view/CameraBase";
import RendererState from "../../vox/render/RendererState";
import Entity3DNode from "../../vox/scene/Entity3DNode";
import ISpacePOV from "../../vox/scene/occlusion/ISpacePOV";
import ISpaceCullingor from "../../vox/scene/ISpaceCullingor";

export default class SpaceCullingor implements ISpaceCullingor {
	private m_camera: CameraBase = null;
	private m_headNode: Entity3DNode = null;
	private m_pocRawList: ISpacePOV[] = [];
	private m_pocList: ISpacePOV[] = [];
	addPOVObject(poc: ISpacePOV): void {
		if (poc != null) {
			this.m_pocRawList.push(poc);
			this.m_pocList.push(null);
		}
	}
	setCamera(cam: CameraBase): void {
		this.m_camera = cam;
	}
	setCullingNodeHead(headNode: Entity3DNode): void {
		this.m_headNode = headNode;
	}
	run(): void {
		let nextNode = this.m_headNode;
		if (nextNode != null) {
			let ab: IAABB = null;
			let cam: CameraBase = this.m_camera;;
			let poc: ISpacePOV = null;
			let pocList: ISpacePOV[] = this.m_pocList;
			let i: number = 0;
			let j: number = 0;
			let len: number = this.m_pocRawList.length;
			let boo: boolean = false;

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
			RendererState.POVNumber = j;
			while (nextNode != null) {
				nextNode.drawEnabled = false;
				if (nextNode.rstatus > 0) {
					ab = nextNode.bounds;
					if (nextNode.entity.getVisible()) {
						if (nextNode.rpoNode.isVsible()) {
							boo = cam.visiTestSphere2(ab.center, ab.radius);
							if (boo) {
								for (i = 0; i < len; i++) {
									poc = pocList[i];
									poc.test(nextNode.bounds, nextNode.entity.spaceCullMask);
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
					nextNode.drawEnabled = boo;
					nextNode.entity.drawEnabled = boo;
					nextNode.rpoNode.drawEnabled = boo;
					//  if(boo && nextNode.distanceFlag)
					//  {
					//      nextNode.rpoNode.setValue(-Vector3D.DistanceSquared(camPos,ab.center));
					//  }
				}
				nextNode = nextNode.next;
			}
		}
	}
}
