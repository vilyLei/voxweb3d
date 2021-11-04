
import MouseEvent from "../../vox/event/MouseEvent";
import Color4 from "../../vox/material/Color4";
import MouseEvt3DDispatcher from "../../vox/event/MouseEvt3DDispatcher";
import TextureProxy from "../../vox/texture/TextureProxy";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";

export default class ColorRectImgButton extends Plane3DEntity {
    private m_initFlag: boolean = true;
    private m_dispatcher: MouseEvt3DDispatcher = null;
    private m_width: number = 100.0;
    private m_height: number = 100.0;
    private m_posZ: number = 0.0;
    readonly overColor: Color4 = new Color4(1.0, 0.5, 1.1, 1.0);
    readonly downColor: Color4 = new Color4(1.0, 0.0, 1.0, 1.0);
    readonly outColor: Color4 = new Color4(1.0, 1.0, 1.0, 1.0);
    index: number = 0;
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
    initialize(startX: number, startY: number, pwidth: number, pheight: number, texList: TextureProxy[] = null): void {

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
    setXYZ(px: number, py: number, pz: number): void {
        this.m_posZ = pz;
        super.setXYZ(px, py, pz);
        this.update();
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
        this.setColor(this.overColor);
    }
    protected mouseOutListener(evt: any): void {
        this.setColor(this.outColor);
    }
    protected mouseDownListener(evt: any): void {
        this.setColor(this.downColor);
    }
    protected mouseUpListener(evt: any): void {
        //this.setColor(this.overColor);
    }
    setColor(color: Color4): void {
        let material: any = this.getMaterial();
        material.setRGBA4f(color.r, color.g, color.b, color.a);
    }
    destory(): void {
        super.destroy();
    }
    toString(): string {
        return "[ColorRectImgButton]";
    }
}