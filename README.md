# voxweb3d
TypeScript WebGL 3d engine system(High Performence for very many times drawcalls(10000+), Support WebGL1 and WebGL2,WebAssembly and Multi-Threads Tasks System, env: pc/web/mobile) , and code style like c++/java.
about the "VOX": I(Vily) love(O) my family(X: it is the first letter from their names).

Feature:

    1. 精简的代码量, 例如渲染器核心代码Gzipped大小小于56KiB。
       The amount of code is very few, for example: the renderer core code Gzipped size: less 56KiB
       [Demo](http://www.artvily.com/renderCase?sample=distributedRenderer2)

    2. 多线程渲染器功能支持。
       Multi-Thread renderer core support.
       [Demo](http://www.artvily.com/renderCase?sample=wasmMultiThead)

    3. 共享内存情况下, 多GPU(上下文)支持。
       Shared CPU Memory, Multiple Gpu Context support.
       [Demo](http://www.artvily.com/renderCase?sample=multiGpu2>)

    4. 面向高性能的渲染运行时(高频执行的渲染过程控制管理)， 支持大规模实时渲染和长时运行稳定性。
       Independent Renderer rendering runtime, for runtime high performence.

    5. 支持分布式运行时代码功能。
       Distributed-Runtime strategy support.
       [Demo](http://www.artvily.com/renderCase?sample=distributedRuntime)

    6. 自动化的内存显存等资源管理。
       Auto resource management: system memory resource and Gpu memory resource, and one system memory resource for Multiple Gpu context memory resource.

    7. 简洁易用的异步数据管理策略, 并且保持数据更新等过程中的运行时性能。
       Asynchronous and convenient resource data management strategy(system memory to gpu memory), for runtime high performence. Inclde: update, new, delete, share those system memory or gpu memory resource.

    8. WebAssembly 支持。
       Wasm(WebAssembly) support.
       [Demo](http://www.artvily.com/renderCase?sample=wasmMultiThead)

    9. 支持多重方式去渲染一个可渲染对象, 渲染过程可灵活控制，也可以使用既定流程。
       Multiple methods to render a renderable entity, enhance rendering control flexibility.

    10.2D UI 系统支持。
       2D UI System support.

    11.PC鼠标和移动端(包括Pad)touch事件支持。
       pc web clinet mouse event and mobile(pad) touch event support.

Engine code under the path: "src\vox\"

installation:

    step 1, install global git(https://git-scm.com/downloads).
    
    step 2, install global nodejs(https://nodejs.org/en/),auto include npm already.
    
    step 3, install yarn(console run: npm install -g yarn)
    
    step 4, enter this dir, console run: yarn install
    
    step 5, enter this dir, console run: yarn dev, you will see success 3d display
    
    step 6, enter this dir, console run: yarn build, build package js

about:

    1. You can find some demos in the src/main.ts file.
