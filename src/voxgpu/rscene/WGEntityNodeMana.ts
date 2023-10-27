import { WebGPUContext } from "../gpu/WebGPUContext";
import { Entity3D } from "../entity/Entity3D";
import { WGMaterial } from "../material/WGMaterial";
import { WGWaitEntityNode } from "./WGEntityNode";

interface NodeManaTarget {
	addEntity(entity: Entity3D, processIndex?: number, deferred?: boolean): void;
	getWGCtx(): WebGPUContext;
}
class WGEntityNodeMana {

	private mNodes: WGWaitEntityNode[] = [];

	target: NodeManaTarget;

	addEntity(entity: Entity3D, processIndex = 0, deferred = true): void {
		this.mNodes.push({entity: entity, processIndex: processIndex, deferred: deferred});
	}
	update(): void {
		const ls = this.mNodes;
		for(let i = 0; i < ls.length; ++i) {
			const node = ls[i];
			// console.log("ppp 01");
			if(node.entity.isREnabled()) {
				// console.log("ppp a 01");
				ls.splice(i, 1);
				--i;
				this.target.addEntity(node.entity, node.processIndex, node.deferred);
			}else {
				// console.log("ppp b 01");
				const ms = node.entity.materials;
				if(ms) {
					for(let j = 0; j < ms.length; ++j) {
						this.updateMaterial( ms[j] );
					}
				}
			}
		}
	}
	private updateMaterial(m: WGMaterial): void {

		const ctx = this.target.getWGCtx();
		const texs = m.textures;
		for (let i = 0; i < texs.length; ++i) {
			const tex = texs[i];
			if (tex.texture && tex.texture.data && !tex.texture.texture) {
				tex.texture.texture = tex.texture.data.build(ctx);
				// if(tex.texture.texture) {
				// }
			}
		}
	}
	updateToTarget(): void {

		const ls = this.mNodes;

		this.mNodes = [];
		for(let i = 0, ln = ls.length; i < ln; ++i) {
			const node = ls[i];
			this.target.addEntity(node.entity, node.processIndex, node.deferred);
		}
	}
}
export { WGEntityNodeMana };
