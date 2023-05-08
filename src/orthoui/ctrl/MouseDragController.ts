
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export default class MouseDragController {

    private m_initX: number = 0.0;
    private m_initY: number = 0.0;
    private m_initMouseX: number = 0.0;
    private m_initMouseY: number = 0.0;
    private m_preMouseX: number = 0.0;
    private m_preMouseY: number = 0.0;
    private m_lockStatus: number = 0;

    private m_xRange: number[] = [-100, 100];
    private m_yRange: number[] = [-100, 100];
    x: number = 0.0;
    y: number = 0.0;
    constructor() { }

    attach(initTargetX: number, initTargetY: number, initMouseX: number, initMouseY: number): void {
        this.m_initX = initTargetX;
        this.m_initY = initTargetY;
        this.m_initMouseX = initMouseX;
        this.m_initMouseY = initMouseY;
        this.x = this.m_initX;
        this.y = this.m_initY;
    }
    detach(): void {
    }
    // move only in x-axis
    lockX(minX: number = -0xfffff, maxX: number = 0xfffff): void {
        this.m_lockStatus = 2;
        this.m_xRange[0] = minX;
        this.m_xRange[1] = maxX;
    }
    // move only in y-axis
    lockY(minY: number = -0xfffff, maxY: number = 0xfffff): void {
        this.m_lockStatus = 1;
        this.m_yRange[0] = minY;
        this.m_yRange[1] = maxY;
    }
    // move only in a rectangle
    lockXY(minX: number = -0xfffff, maxX: number = 0xfffff, minY: number = -0xfffff, maxY: number = 0xfffff): void {
        this.m_lockStatus = 3;
        this.m_xRange[0] = minX;
        this.m_xRange[1] = maxX;
        this.m_yRange[0] = minY;
        this.m_yRange[1] = maxY;
    }
    unlock(): void {
        this.m_lockStatus = 0;
    }
    test(mouseX: number, mouseY: number): boolean {
        return Math.abs(mouseX - this.m_preMouseX) > 0.001 || Math.abs(mouseY - this.m_preMouseY) > 0.001;
    }
    updateDrag(mouseX: number, mouseY: number): void {
        this.m_preMouseX = mouseX;
        this.m_preMouseY = mouseY;
        switch (this.m_lockStatus) {
            case 0:
                this.x = this.m_initX + (mouseX - this.m_initMouseX);
                this.y = this.m_initY + (mouseY - this.m_initMouseY);
                break;
            case 1:
                mouseY = this.m_initY + (mouseY - this.m_initMouseY);
                mouseY = mouseY < this.m_yRange[0] ? mouseY = this.m_yRange[0] : (mouseY > this.m_yRange[1] ? mouseY = this.m_yRange[1] : mouseY);
                this.y = mouseY;
                break;
            case 2:
                mouseX = this.m_initX + (mouseX - this.m_initMouseX);
                mouseX = mouseX < this.m_xRange[0] ? mouseX = this.m_xRange[0] : (mouseX > this.m_xRange[1] ? mouseX = this.m_xRange[1] : mouseX);
                this.x = mouseX;
                break;
            case 3:
                mouseX = this.m_initX + (mouseX - this.m_initMouseX);
                mouseY = this.m_initY + (mouseY - this.m_initMouseY);
                mouseX = mouseX < this.m_xRange[0] ? mouseX = this.m_xRange[0] : (mouseX > this.m_xRange[1] ? mouseX = this.m_xRange[1] : mouseX);
                mouseY = mouseY < this.m_yRange[0] ? mouseY = this.m_yRange[0] : (mouseY > this.m_yRange[1] ? mouseY = this.m_yRange[1] : mouseY);
                this.x = mouseX;
                this.y = mouseY;
                break;
            default:
                this.x = this.m_initX + (mouseX - this.m_initMouseX);
                this.y = this.m_initY + (mouseY - this.m_initMouseY);
                break;
        }
    }
}