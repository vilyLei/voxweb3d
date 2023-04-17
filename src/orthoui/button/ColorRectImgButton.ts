
import MouseEvent from "../../vox/event/MouseEvent";
import Color4 from "../../vox/material/Color4";
import MouseEvt3DDispatcher from "../../vox/event/MouseEvt3DDispatcher";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";

export default class ColorRectImgButton extends Plane3DEntity {
    private m_initFlag = true;
    private m_dispatcher: MouseEvt3DDispatcher = null;
    private m_width = 100.0;
    private m_height = 100.0;
    private m_posZ = 0.0;
    readonly overColor = new Color4(1.0, 0.5, 1.1, 1.0);
    readonly downColor = new Color4(1.0, 0.0, 1.0, 1.0);
    readonly outColor = new Color4(1.0, 1.0, 1.0, 1.0);
    index = 0;
    constructor() {
        super();
    }

    setAlpha(pa: number): void {
        this.overColor.a = pa;
        this.downColor.a = pa;
        this.outColor.a = pa;
    }
    getWidth(): number {
        return this.m_width;
    }
    getHeight(): number {
        return this.m_height;
    }
    setSize(pwidth: number, pheight: number): void {

        this.m_width = pwidth;
        this.m_height = pheight;
    }
    updateColor(): void {
        let material: any = this.getMaterial();
        if (material != null) {
            material.setRGBA4f(this.outColor.r, this.outColor.g, this.outColor.b, this.outColor.a);
        }
    }
    private initEvtBase(): void {
        if(this.m_dispatcher == null) {
            this.m_dispatcher = new MouseEvt3DDispatcher();
            this.m_dispatcher.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
            this.m_dispatcher.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener);
            this.m_dispatcher.addEventListener(MouseEvent.MOUSE_OVER, this, this.mouseOverListener);
            this.m_dispatcher.addEventListener(MouseEvent.MOUSE_OUT, this, this.mouseOutListener);
            this.setEvtDispatcher(this.m_dispatcher);
        }
    }
    initialize(startX: number, startY: number, pwidth: number, pheight: number, texList: IRenderTexture[] = null): void {

        if (this.m_initFlag) {
            this.m_initFlag = false;

            this.m_width = pwidth;
            this.m_height = pheight;

            this.initEvtBase();
            super.initializeXOY(startX, startY, pwidth, pheight, texList);
            this.mouseEnabled = true;

            this.setColor( this.outColor );
        }
    }
    setXY(px: number, py: number): void {
        super.setXYZ(px, py, this.m_posZ);
        this.update();
    }
    setXYZ(px: number, py: number, pz: number): ColorRectImgButton {
        this.m_posZ = pz;
        super.setXYZ(px, py, pz);
        this.update();
        return this;
    }

    addEventListener(type: number, listener: any, func: (evt: any) => void): void {
        if (this.m_dispatcher != null) {
            this.m_dispatcher.addEventListener(type, listener, func);
        }
    }
    removeEventListener(type: number, listener: any, func: (evt: any) => void): void {
        if (this.m_dispatcher != null) {
            this.m_dispatcher.removeEventListener(type, listener, func);
        }
    }
    protected mouseOverListener(evt: any): void {
		// console.log("ColorRectImgButton::mouseOverListener()..., this.overColor: ", this.overColor);
        this.setColor(this.overColor);
    }
    protected mouseOutListener(evt: any): void {
		// console.log("ColorRectImgButton::mouseOutListener()..., this.outColor: ", this.outColor);
        this.setColor(this.outColor);
    }
    protected mouseDownListener(evt: any): void {
        this.setColor(this.downColor);
    }
    protected mouseUpListener(evt: any): void {
        this.setColor(this.overColor);
    }
    setColor(color: Color4): void {
        this.setRGBA4f(color.r, color.g, color.b, color.a);
    }
	// update(): void {
	// 	this.setColor(this.outColor);
	// 	super.update();
	// }
    destory(): void {
        super.destroy();
    }
}
