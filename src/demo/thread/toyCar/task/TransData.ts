/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

class TransData {
    sx: number = 0.06;
    sy: number = 0.06;
    sz: number = 0.06;
    //
    rx: number = 0;
    ry: number = 0;
    rz: number = 0;
    //
    x: number = 0;
    y: number = 0;
    z: number = 0;
    //
    spd_rx: number = 0;
    spd_ry: number = 1.0;
    spd_rz: number = 0;
    
    constructor() {
    }

    initialize(): void {
        this.x = Math.random() * 600.0 - 300.0;
        //this.y = Math.random() * 10.0;
        this.z = Math.random() * 600.0 - 300.0;

        this.ry = Math.random() * 360.0;
        this.spd_rx = Math.random() * 2.0 - 1.0;
        this.spd_ry = Math.random() * 2.0 - 1.0;
        this.spd_rz = Math.random() * 2.0 - 1.0;
    }
    update(): void {
        this.rx += this.spd_rx;
        this.ry += this.spd_ry;
        this.rz += this.spd_rz;

    }
}
export { TransData };