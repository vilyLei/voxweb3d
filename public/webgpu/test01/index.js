// thanks(WEBGPU所有核心): https://surma.dev/things/webgpu/
// thanks: https://surma.dev/things/webgpu/step3/

const t = document.querySelector("canvas").getContext("2d");
function g(e) {
	throw document.body.innerHTML = `<pre>${e}</pre>`, Error(e)
}
"gpu" in navigator || g("WebGPU not supported. Please enable it in about:flags in Chrome or in about:config in Firefox.");

const y = await navigator.gpu.requestAdapter();
y || g("Couldn\u2019t request WebGPU adapter.");
const r = await y.requestDevice();
r || g("Couldn\u2019t request WebGPU device.");
const M = r.createShaderModule({
	code: `
    struct Ball {
      radius: f32,
      position: vec2<f32>,
      velocity: vec2<f32>,
    }

    @group(0) @binding(0)
    var<storage, read> input: array<Ball>;

    @group(0) @binding(1)
    var<storage, read_write> output: array<Ball>;

    const TIME_STEP: f32 = 0.016;

    @compute @workgroup_size(64)
    fn main(
      @builtin(global_invocation_id)
      global_id : vec3<u32>,
    ) {
      let num_balls = arrayLength(&output);
      if(global_id.x >= num_balls) {
        return;
      }
      let src_ball = input[global_id.x];
      let dst_ball = &output[global_id.x];

      (*dst_ball) = src_ball;
      (*dst_ball).position = (*dst_ball).position + (*dst_ball).velocity * TIME_STEP;
    }
`});

let h = r.createBindGroupLayout({
	entries: [
		{
			binding: 0,
			visibility: GPUShaderStage.COMPUTE,
			buffer: { type: "read-only-storage" }
		},
		{
			binding: 1,
			visibility: GPUShaderStage.COMPUTE,
			buffer: { type: "storage" }
		}]
});
let E = r.createComputePipeline(
	{
		layout: r.createPipelineLayout({ bindGroupLayouts: [h] }),
		compute: {
			module: M, entryPoint: "main"
		}
	});
let b = 100, o = b * 6 * Float32Array.BYTES_PER_ELEMENT;
let B = r.createBuffer({ size: o, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC });
let d = r.createBuffer({ size: o, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST })
let b01 = r.createBuffer({ size: o, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
let U = r.createBindGroup({ layout: h, entries: [{ binding: 0, resource: { buffer: b01 } }, { binding: 1, resource: { buffer: B } }] });
function w() { return new Promise(e => requestAnimationFrame(e)) };
let n = new Float32Array(new ArrayBuffer(o));
for (let e = 0; e < b; e++) {
	n[e * 6 + 0] = l(2, 10);
	n[e * 6 + 1] = 0;
	n[e * 6 + 2] = l(0, t.canvas.width);
	n[e * 6 + 3] = l(0, t.canvas.height), n[e * 6 + 4] = l(-100, 100), n[e * 6 + 5] = l(-100, 100);
}
let p;
for (; ;) {
	performance.mark("webgpu start");
	r.queue.writeBuffer(b01, 0, n);
	const e = r.createCommandEncoder();
	let a = e.beginComputePass(); a.setPipeline(E), a.setBindGroup(0, U);
	const i = Math.ceil(b / 64);
	a.dispatchWorkgroups(i);
	a.end();
	e.copyBufferToBuffer(B, 0, d, 0, o);
	const u = e.finish();
	r.queue.submit([u]);
	await d.mapAsync(GPUMapMode.READ, 0, o);
	const s = d.getMappedRange(0, o).slice();
	p = new Float32Array(s);
	d.unmap();
	performance.mark("webgpu end");
	performance.measure("webgpu", "webgpu start", "webgpu end");
	G(p);
	n = p;
	await w();
}
function G(e) {
	t.save();
	t.scale(1, -1);
	t.translate(0, -t.canvas.height);
	t.clearRect(0, 0, t.canvas.width, t.canvas.height);

	// t.fillStyle = "red";
	t.fillStyle = "#550055";

	for (let a = 0; a < e.length; a += 6) {
		const i = e[a + 0], u = e[a + 2], f = e[a + 3], s = e[a + 4], v = e[a + 5];
		let c = Math.atan(v / (s === 0 ? Number.EPSILON : s));
		s < 0 && (c += Math.PI);
		const P = u + Math.cos(c) * Math.sqrt(2) * i;
		const m = f + Math.sin(c) * Math.sqrt(2) * i;
		t.beginPath();
		t.arc(u, f, i, 0, 2 * Math.PI, !0);
		t.moveTo(P, m);
		t.arc(u, f, i, c - Math.PI / 4, c + Math.PI / 4, !0);
		t.lineTo(P, m), t.closePath(), t.fill();
	}
	t.restore();
}
function l(e, a) {
	return Math.random() * (a - e) + e;
}
