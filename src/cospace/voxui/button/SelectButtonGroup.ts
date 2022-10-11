import { IButton } from "../button/IButton";
import { ISelectButtonGroup } from "../button/ISelectButtonGroup";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

class SelectButtonGroup implements ISelectButtonGroup {

	private m_map: Map<string, IButton> = new Map();
	private m_selectFunc: (btn: IButton)=>void = null;
	private m_deselectFunc: (btn: IButton)=>void = null;
	private m_mouseUpSelect: boolean = true;
	private m_btn: IButton = null;

	constructor(mouseUpSelect: boolean = true) {
		this.m_mouseUpSelect = mouseUpSelect;
	}
	addButton(btn: IButton): void {
		if(btn != null) {

			if(this.m_map == null) {
				this.m_map = new Map();
			}
			
			this.m_map.set(btn.uuid, btn);

			const ME = CoRScene.MouseEvent;
			if(this.m_mouseUpSelect) {
				btn.addEventListener(ME.MOUSE_UP, this, this.mouseEvtFunc);
			} else {
				btn.addEventListener(ME.MOUSE_DOWN, this, this.mouseEvtFunc);
			}
		}
	}
	private mouseEvtFunc(evt: any): void {
		this.select( evt.currentTarget.uuid );
	}
	setSelectedFunction(selectFunc: (btn: IButton)=>void, deselectFunc: (btn: IButton)=>void): void {
		this.m_selectFunc = selectFunc;
		this.m_deselectFunc = deselectFunc;
	}
	select(uuid: string): void {

		if(this.m_map != null && this.m_map.has(uuid)) {

			let btn = this.m_map.get(uuid);
			if(this.m_btn != btn) {
				if(this.m_btn != null) {
					if(this.m_deselectFunc != null) {
						this.m_deselectFunc( this.m_btn );
					}
				}
				this.m_btn = btn;
				if(this.m_selectFunc != null) {
					this.m_selectFunc( btn );
				}
			}
		}
	}
	destroy(): void {
		
		this.m_btn = null;
		this.m_map = null;
		this.m_selectFunc = null;
		this.m_deselectFunc = null;
	}
}
export { SelectButtonGroup };
