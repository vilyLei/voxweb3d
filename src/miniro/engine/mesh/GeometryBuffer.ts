/*
 * GPU端几何数据块
 */
class GeometryBuffer {
	private mGL: any = null;
    // 内存数据
    private mVertices: Float32Array = new Float32Array([-0.8, -0.8, 0, 0.8, -0.8, 0, 0.8, 0.8, 0, -0.8, 0.8, 0]);
    private mIndices: Uint16Array = new Uint16Array([0, 1, 2, 0, 2, 3]);
    // GPU数据
    private mVertexBuffer: any = null;
    private mIndexBuffer: any = null;
    vtxOffset = 0;
    vtxCount = 6;
    constructor() { }

    setVertexs(vertexs: Float32Array): void {
        this.mVertices = vertexs;
    }
    setIndices(indices: Uint16Array): void {
        this.mIndices = indices;
    }
    buildGpuRes(gl: any): void {

        if (this.mVertexBuffer == null) {
			this.mGL = gl;
            this.mVertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.mVertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.mVertices, gl.STATIC_DRAW);

            this.mIndexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.mIndices, gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        }
    }
    use(gl: any): void {

        let attrid = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mVertexBuffer);
        gl.enableVertexAttribArray(attrid);
        gl.vertexAttribPointer(attrid, 3, gl.FLOAT, false, this.mVertices.length, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mIndexBuffer);

    }
	destroy(): void {
		if(this.mGL) {
			if(this.mVertexBuffer) {
				this.mGL.deleteBuffer(this.mVertexBuffer);
				this.mVertexBuffer = null;
			}
			if(this.mIndexBuffer) {
				this.mGL.deleteBuffer(this.mIndexBuffer);
				this.mIndexBuffer = null;
			}
			this.mGL = null;
		}
	}
}

export { GeometryBuffer };
