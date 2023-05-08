
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import Vector3D from "../../vox/math/Vector3D";
import MouseEvent from "../../vox/event/MouseEvent";
import Color4 from "../../vox/material/Color4";
import MouseEvt3DDispatcher from "../../vox/event/MouseEvt3DDispatcher";
import TextureProxy from "../../vox/texture/TextureProxy";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import TextBillboard3DEntity from "../../vox/text/TextBillboard3DEntity";


export default class ColorTextImgButton extends Plane3DEntity {
    constructor() {
        super();
    }
    index: number = 0;
    overColor: Color4 = new Color4(1.0, 0.5, 1.1, 1.0);
    downColor: Color4 = new Color4(1.0, 0.0, 1.0, 1.0);
    outColor: Color4 = new Color4(1.0, 1.0, 1.0, 1.0);
    overTextColor: Color4 = new Color4(1.0, 0.5, 1.1, 1.0);
    downTextColor: Color4 = new Color4(1.0, 0.0, 1.0, 1.0);
    outTextColor: Color4 = new Color4(1.0, 1.0, 1.0, 1.0);
    private m_dispatcher: MouseEvt3DDispatcher = null;
    private m_width: number = 100.0;
    private m_height: number = 100.0;
    private m_posZ: number = 0.0;
    private m_posV: Vector3D = new Vector3D();
    private m_textOffsetV: Vector3D = new Vector3D(0.0, 0.0, 0.1);
    private m_btnStr: string = "button";
    private m_textDisp: TextBillboard3DEntity = null;

    setVisible(boo: boolean): ColorTextImgButton {
        if (this.m_textDisp != null) {
            this.m_textDisp.setVisible(boo);
        }
        super.setVisible(boo);
        return this;
    }
    setAlpha(pa: number, texAlpha: number = 0.0): void {
        this.overColor.a = pa;
        this.downColor.a = pa;
        this.outColor.a = pa;
        this.overTextColor.a = texAlpha;
        this.downTextColor.a = texAlpha;
        this.outTextColor.a = texAlpha;
    }
    getWidth(): number {
        return this.m_width;
    }
    getHeight(): number {
        return this.m_height;
    }
    setTextOffset(dx: number, dy: number, dz: number): void {
        this.m_textOffsetV.setXYZ(dx, dy, dz);
    }
    setText(str: string): void {
        if (str != "" && str != this.m_btnStr) {
            this.m_btnStr = str;
            if (this.m_textDisp != null) {
                this.m_textDisp.setText(str);
            }
        }
    }
    getText(): string {
        return this.m_btnStr;
    }
    getTextDisp(): TextBillboard3DEntity {
        return this.m_textDisp;
    }
    private initEvtBase(): void {
        this.m_dispatcher = new MouseEvt3DDispatcher();
        this.m_dispatcher.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
        this.m_dispatcher.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener);
        this.m_dispatcher.addEventListener(MouseEvent.MOUSE_OVER, this, this.mouseOverListener);
        this.m_dispatcher.addEventListener(MouseEvent.MOUSE_OUT, this, this.mouseOutListener);
        //this.m_dispatcher.addEventListener(MouseEvent.MOUSE_MOVE,this,this.mouseMoveListener);
        this.setEvtDispatcher(this.m_dispatcher);
        this.m_textDisp = new TextBillboard3DEntity();
        this.m_textDisp.alignLeftTop();
        this.m_textDisp.initialize(this.m_btnStr);

        this.m_textOffsetV.x = Math.floor(0.5 * (this.m_width - this.m_textDisp.getWidth()));
        this.m_textOffsetV.y = Math.floor(0.5 * (this.m_height - this.m_textDisp.getHeight())) - 2;
        if (this.m_textOffsetV.y < 0.0) {
            this.m_textOffsetV.y = 0.0;
        }
        this.getPosition(this.m_posV);
        this.m_posV.addBy(this.m_textOffsetV);
        this.m_textDisp.setPosition(this.m_posV);
        this.m_textDisp.update();
    }
    initialize(startX: number, startY: number, pwidth: number, pheight: number, texList: TextureProxy[] = null): void {
        if (this.m_dispatcher == null) {
            this.m_width = pwidth;
            this.m_height = pheight;
            super.initializeXOY(startX, startY, pwidth, pheight, texList);
            this.initEvtBase();
            this.mouseEnabled = true;
            let material: any = this.getMaterial();
            material.setRGBA4f(this.outColor.r, this.outColor.g, this.outColor.b, this.outColor.a);
        }
    }
    setXY(px: number, py: number): void {
        super.setXYZ(px, py, this.m_posZ);
        this.getPosition(this.m_posV);
        this.m_posV.addBy(this.m_textOffsetV);
        this.m_textDisp.setPosition(this.m_posV);
        this.m_textDisp.update();
        this.update();
    }
    setXYZ(px: number, py: number, pz: number): ColorTextImgButton {
        this.m_posZ = pz;
        super.setXYZ(px, py, pz);
        this.getPosition(this.m_posV);
        this.m_posV.addBy(this.m_textOffsetV);
        this.m_textDisp.setPosition(this.m_posV);
        this.m_textDisp.update();
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
        this.setColor(this.overColor);
    }
    protected mouseOutListener(evt: any): void {
        this.setColor(this.outColor);
    }
    protected mouseDownListener(evt: any): void {
        this.setColor(this.downColor);
    }
    protected mouseUpListener(evt: any): void {
    }
    setColor(color: Color4): void {
        let material: any = this.getMaterial();
        material.setRGBA4f(color.r, color.g, color.b, color.a);
    }
    destory(): void {
        super.destroy();
    }
    toString(): string {
        return "[ColorTextImgButton]";
    }
}
