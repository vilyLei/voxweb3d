/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import {ParticleShootParam, FollowParticleParam, FollowParticle} from "./FollowParticle";
import PathTrack from "../../voxnav/path/PathTrack";

class PathFollowParticle extends FollowParticle {

	private m_pathTrack = new PathTrack();
	private m_dis = 0;
	private m_pv = new Vector3D();
	constructor() {super();}

	addPosition(pv: Vector3D, total: number = 1, spaceRange: number = 20, accelerationScale: number = -1.0, stepDis: number = 30): void {

		const track = this.m_pathTrack;
		track.addXYZ(pv.x, pv.y, pv.z);
		if(track.getPosTotal() > 1) {
			const outV = this.m_pv;
			for (let i = 0; i < 100; ++i) {
				const flag = track.calcNextPosByDis(outV, this.m_dis, false);
				this.createParticles(outV, total, spaceRange, accelerationScale);
				this.m_dis += stepDis;
				if (flag == PathTrack.TRACK_END) {
					// console.log("path search end.");
					track.clear();
					this.m_dis = stepDis;
					track.addXYZ(pv.x, pv.y, pv.z);
					break;
				}
			}
		}else {
			this.createParticles(pv, total, spaceRange, accelerationScale);
		}
	}
	// shoot(pv: Vector3D): void {
	// 	const total = Math.random() * 2 + 1;
	// 	const spaceRange = Math.random() * 15 + 15;
	// 	const param = this.m_param;
	// 	param.lifetimeScale = Math.random() * 1.7 + 0.3;
	// 	this.addPosition(pv, total, spaceRange, (Math.random() - 0.5) * (0.1 * Math.random() + 0.01));
	// }
	destroy(): void {
		super.destroy();
	}
}

export {FollowParticleParam, ParticleShootParam, FollowParticle, PathFollowParticle}
