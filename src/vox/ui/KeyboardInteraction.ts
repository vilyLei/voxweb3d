// import IRendererScene from "../../../vox/scene/IRendererScene";
// import { IKeyboardInteraction } from "./IKeyboardInteraction";

import KeyboardEvent from "../event/KeyboardEvent";
import IRendererScene from "../scene/IRendererScene";

// import { ICoRScene } from "../../voxengine/ICoRScene";
// declare var CoRScene: ICoRScene;

class KeyEvtNode {

	type = 0x0;
	targets: any[] = [];
	listeners: ((evt: any) => void)[] = [];

	constructor() { }

	addListener(tar: any, func: ((evt: any) => void)): void {
		let i = 0;
		for (i = this.listeners.length - 1; i >= 0; --i) {
			if (func === this.listeners[i]) {
				break;
			}
		}
		if (i < 0) {
			this.targets.push(tar);
			this.listeners.push(func);
		}
	}
	removeListener(tar: any, func: ((evt: any) => void)): void {

		for (let i = this.listeners.length - 1; i >= 0; --i) {
			if (func === this.listeners[i]) {
				this.targets.splice(i, 1);
				this.listeners.splice(i, 1);
				break;
			}
		}
	}
	dispatch(evt: any): void {

		let ls = this.listeners;
		let len = ls.length;
		//console.log("dispatch(), listeners.length: ",len);
		for (let i = 0; i < len; ++i) {
			ls[i].call(this.targets[i], evt);
		}
	}
}
class KeyEvtManager {

	private m_evtMap: Map<number, KeyEvtNode> = new Map();
	private m_index = -1;
	private m_keys = new Uint32Array(8);
	private m_code0 = -1;
	private m_code1 = -1;

	constructor() { }
	reset(): void {

		this.m_code0 = -1;
		this.m_code1 = -1;
		this.m_index = -1;
		this.m_keys.fill(0);
	}
	getCurrKeyCode(): number {
		if (this.m_index > -1) {
			return this.m_keys[this.m_index];
		}
		return -1;
	}
	use(evt: any): void {

		// console.log("KeyEvtManager::use() A", this.m_index);
		if (this.m_code0 != evt.keyCode) {
			this.m_code0 = evt.keyCode;

			// console.log("KeyEvtManager::use() B ", evt.keyCode);
			this.m_code1 = -1;

			this.m_index++;
			let keys = this.m_keys;
			keys[this.m_index] = evt.keyCode;
			let t = this.createKeysEventType(this.m_keys);

			// console.log("sfsdfsdfsdfsdfsdfsd use B", this.m_index);
			const pm = this.m_evtMap;
			let node = pm.get(t);
			if (node != null) {
				evt.keysEventType = t;
				node.dispatch(evt);
			}
		}
	}
	disuse(evt: any): void {
		// console.log("sfsdfsdfsdfsdfsdfsd disuse A", this.m_index);
		if (this.m_code1 != evt.keyCode) {
			this.m_code1 = evt.keyCode;

			this.m_code0 = -1;
			let keys = this.m_keys;
			keys[this.m_index] = 0;

			if (this.m_index == 0) {
				// console.log("sfsdfsdfsdfsdfsdfsd disuse B", this.m_index);
			}
			this.m_index--;
			if (this.m_index < -1) {
				this.m_index = -1;
			}
		}
	}
	isEnabled(): boolean {
		return this.m_index > 0;
	}
	createKeysEventType(keyTypes: number[] | Uint32Array): number {

		if (keyTypes != null) {
			let len = keyTypes.length;
			if (len > 0) {
				if (len > 4) len = 4;
				let t = 0x0;
				for (let i = 0; i < len; ++i) {
					t = t | (keyTypes[i] << (i * 8));
				}
				return t;
			}
		}
		return 0x0;
	}
	addEventListener(keysEventType: number, target: any, func: (evt: any) => void): void {
		// console.log("XXX KeyEvtManager::addEventListener(), keysEventType: ", keysEventType);
		if (keysEventType > 0x0) {

			const pm = this.m_evtMap;
			let node = pm.get(keysEventType);
			if (node == null) {
				node = new KeyEvtNode();
				node.type = keysEventType;
				pm.set(keysEventType, node);
			}
			node.addListener(target, func);
		}
	}
	removeEventListener(keysEventType: number, target: any, func: (evt: any) => void): void {
		if (keysEventType > 0x0) {

			const pm = this.m_evtMap;
			let node = pm.get(keysEventType);
			if (node != null) {
				node.removeListener(target, func);
			}
		}
	}

}
class KeyboardInteraction {

	private m_rscene: IRendererScene = null;
	private m_downMana = new KeyEvtManager();
	// private m_upMana = new KeyEvtManager();

	constructor() {
	}

	initialize(rscene: IRendererScene): void {

		if (this.m_rscene == null) {
			this.m_rscene = rscene;
			let KE = KeyboardEvent;
			this.m_rscene.addEventListener(KE.KEY_DOWN, this, this.keyDown);
			this.m_rscene.addEventListener(KE.KEY_UP, this, this.keyUp);

			window.onfocus = (): void => {
				this.reset();
			}
		}
	}
	getCurrDownKeyCode(): number {
		return this.m_downMana.getCurrKeyCode();
	}
	private keyDown(evt: any): void {

		// switch(evt.keyCode) {
		// 	case Keyboard.ESC:
		// 		this.reset();
		// 		return;
		// 		break;
		// }
		// console.log("KeyboardInteraction::keyDown() ..., evt: ", evt);

		this.m_downMana.use(evt);
	}

	private keyUp(evt: any): void {

		// switch(evt.keyCode) {
		// 	case Keyboard.ESC:
		// 		this.reset();
		// 		return;
		// 		break;
		// }

		// console.log("KeyboardInteraction::keyUp() ..., evt: ", evt);

		this.m_downMana.disuse(evt);
		// this.m_upMana.use(evt);

		if (!this.m_downMana.isEnabled()) {
			// todo
			// this.m_upMana.reset();
		}
	}
	reset(): void {
		this.m_downMana.reset();
	}
	/**
	 *
	 * @param keyTypes example: [Keyboard.CTRL, Keyboard.Z]
	 * @returns combination keys event type
	 */
	createKeysEventType(keyTypes: number[]): number {
		return this.m_downMana.createKeysEventType(keyTypes);
	}

	/**
	 * @param keysEventType the value is come from the createKeysEventType() function
	 * @param target event listerner
	 * @param func event listerner callback function
	 * @param captureEnabled the default value is true
	 * @param bubbleEnabled the default value is false
	 */
	addKeysDownListener(keysEventType: number, target: any, func: (evt: any) => void): void {

		this.m_downMana.addEventListener(keysEventType, target, func);
		// if (keyboardEvtType == KeyboardEvent.KEY_DOWN) {
		// 	this.m_downMana.addEventListener(keysEventType, target, func);
		// } else if (keyboardEvtType == KeyboardEvent.KEY_UP) {
		// 	// this.m_upMana.addEventListener(keysEventType, target, func);
		// }
	}

	/**
	 * @param keysEventType the value is come from the createKeysEventType() function
	 * @param target event listerner
	 * @param func event listerner callback function
	 */
	removeKeysDownListener(keysEventType: number, target: any, func: (evt: any) => void): void {
		this.m_downMana.removeEventListener(keysEventType, target, func);
		// if (keyboardEvtType == KeyboardEvent.KEY_DOWN) {
		// 	this.m_downMana.removeEventListener(keysEventType, target, func);
		// } else if (keyboardEvtType == KeyboardEvent.KEY_UP) {
		// 	// this.m_upMana.removeEventListener(keysEventType, target, func);
		// }
	}
}

export { KeyboardInteraction }
