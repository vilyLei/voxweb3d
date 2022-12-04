/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
export default class BitConst {
    static readonly BIT_ZERO: number = 0;
    static readonly BIT_ONE_0: number = 1;      //0b1
    static readonly BIT_ONE_1: number = 1 << 1;   //0b10
    static readonly BIT_ONE_2: number = 1 << 2;   //0b100
    static readonly BIT_ONE_3: number = 1 << 3;   //0b1000
    static readonly BIT_ONE_4: number = 1 << 4;   //0b10000
    static readonly BIT_ONE_5: number = 1 << 5;   //0b100000
    static readonly BIT_ONE_6: number = 1 << 6;   //0b1000000
    static readonly BIT_ONE_7: number = 1 << 7;   //0b10000000
    static readonly BIT_ONE_8: number = 1 << 8;   //0b100000000
    static readonly BIT_ONE_9: number = 1 << 9;   //0b1000000000
    static readonly BIT_ONE_10: number = 1 << 10; //0b10000000000
    static readonly BIT_ONE_11: number = 1 << 11; //0b100000000000

    static value: number = 0;
    static PushThreeBitValueToInt(target: number, value: number): number {
        return (target << 3) + value;
    }
    static PopThreeBitValueFromInt(target: number): number {
        BitConst.value = 7 & target;
        return (target >> 3);
    }

    static ContainsBit(target: number, bit: number): boolean {
        return (bit & target) > 0;
    }
    static RemoveBit(target: number, bit: number): number {
        return (~bit & target);
    }
    static AddBit(target: number, bit: number): number {
        return bit | target;
    }
    
    static AssembleFromIntArray(intArray: number[]): number {
        let bit = 0x0;
        let len = intArray.length;
        for (let i = 0; i < len; ++i) {
            if (intArray[i] > 0) {
                bit |= 1 << i;
            }
        }
        return bit;
    }
}