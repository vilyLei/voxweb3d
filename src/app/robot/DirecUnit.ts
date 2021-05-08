/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export default class DirecUnit
{
    // 整个循环进度系数
    progress:number = 1.0;
    // 半个完整循环的系数因子
    factor:number = 1.0;
    // 一个完整循环的时间段
    duration:number = 40.0;
    private m_originTime:number = 10.0;
    private m_biasTime:number = 0.3;
    private m_flag:number = 1.0;
    private m_preFactor:number = 1.0;
    private m_biasFactor:number = 1.03;
    constructor(){}
    initialize():void
    {
        this.m_originTime = Math.floor(0.25 * this.duration);
        let bias:number = (1.0 - Math.sqrt(0.5/this.m_biasFactor));
        this.m_biasTime = bias * 2.0 * this.m_originTime;
    }
    toPositive():void
    {
        this.m_preFactor = 1.0;
    }
    toNegative():void
    {
        this.m_preFactor = -1.0;
    }
    reset():void
    {
        this.m_flag = 1.0;
        this.m_preFactor = 1.0;
    }
    getOriginTime():number
    {
        return this.m_originTime;
    }
    getBiasTime():number
    {
        return this.m_biasTime;
    }
    getNextOriginTime(time:number):number
    {
        let k:number = Math.ceil(0.25 * Math.floor(time/(this.m_originTime)));
        return (4.0 * k) * this.m_originTime + this.m_biasTime;
    }
    calc(time:number):void
    {
        let k:number = time/this.duration;
        // 获取整个循环进度系数
        this.progress = k - Math.floor(k);
        //console.log("k: ",k,time,);
        // 获取半个循环所需的时间系数
        k *= 2.0;
        k = k - Math.floor(k);
        if(this.m_preFactor > k)
        {
            this.m_flag *= -1.0;
        }
        this.m_preFactor = k;
        k = 1.0 - k;
        k = k * k * this.m_biasFactor;

        k = this.m_flag * (k - 0.5);

        this.factor = k;
    }
    
    calcAngleEEE(time:number):void
    {
        let k:number = time/this.duration;
        k = k - Math.floor(k);
        k = this.m_flag * (k - 0.5);
        if(this.m_preFactor < k && this.m_flag < 0.0)
        {
            this.m_flag *= -1.0;
        }
        else if(this.m_preFactor > k && this.m_flag > 0.0)
        {
            this.m_flag *= -1.0;
        }
        this.m_preFactor = k;

    }
}