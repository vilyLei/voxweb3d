/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export namespace app
{
    export namespace robot
    {
        export class DirecUnit
        {
            // 整个循环进度系数
            progress:number = 1.0;
            // 半个完整循环的系数因子
            factor:number = 1.0;
            // 一个完整循环的时间段
            duration:number = 40.0;

            private m_timeScale:number = 0.7;
            private m_flag:number = 1.0;
            private m_preFactor:number = 1.0;
            constructor(){}
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
            getInitedTime():number
            {
                return Math.round(0.25 * this.duration) - 1;
            }
            calc(time:number):void
            {
                time *= this.m_timeScale;

                let k:number = time/this.duration;
                // 获取整个循环进度系数
                this.progress = k - Math.floor(k);
                // 获取半个循环所需的时间系数
                k *= 2.0;
                k = k - Math.floor(k);
                if(this.m_preFactor > k)
                {
                    this.m_flag *= -1.0;
                }
                this.m_preFactor = k;
                k = 1.0 - k;
                k = k * k * 1.03;

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
    }
}