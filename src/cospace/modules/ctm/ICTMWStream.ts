// thanks for threejs ctm module

interface ICTMWStream {
    /**
     * uint8 array
     */
	data: Uint8Array | string;
    offset: number;
    count: number;
    len: number;
    writeByte(value: number): void;

}
export { ICTMWStream }
