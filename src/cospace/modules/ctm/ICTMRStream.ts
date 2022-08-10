// thanks for threejs ctm module

interface ICTMRStream {
    /**
     * uint8 array
     */
    data: Uint8Array | string;
    offset: number;
	// size: number;
    readByte(): number;
    readInt32(): number;
    readFloat32(): number;
    readString(): string;
    readArrayInt32(array: Uint16Array | Uint32Array): Uint16Array | Uint32Array;
    readArrayFloat32(array: Float32Array): Float32Array;

}
export { ICTMRStream }
