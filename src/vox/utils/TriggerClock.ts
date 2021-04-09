/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export namespace vox
{
    export namespace utils
    {
        export class TriggerClock
        {
            private m_ivs:Uint8Array = new Uint8Array(32);
            private m_time:number = 40;
            private m_period:number = 40;
            private m_lockTime:number = 20;
            constructor(){}
            setTriggerTimeAt(index:number, time:number):void
            {
                this.m_ivs[time] = index + 1;
            }
            getTriggerIndex():number
            {
                return this.m_ivs[this.m_time] - 1;
            }
            setPeriod(p:number):void
            {
                this.m_period = p > 5 ? p:5;
                if(this.m_ivs.length < this.m_period)
                {
                    this.m_ivs = new Uint8Array(this.m_period + 8);
                }
            }
            isLock():boolean
            {
                return this.m_time > this.m_lockTime;
            }
            isUnlock():boolean
            {
                return this.m_time <= this.m_lockTime;
            }
            run():void
            {
                if(this.m_time < 1)this.m_time = this.m_period;
                this.m_time--;
            }
        }
    }
}