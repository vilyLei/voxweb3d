# voxweb3d
TypeScript WebGL 3d engine system(High Performence for very many times drawcalls(10000+), Support WebGL1 and WebGL2,WebAssembly and Multi Thread Tasks System, env: pc/web/mobile) , and code style like c++/java.

Feature:

    1.Multi-Thread renderer core support.

    2.Multiple Gpu Context support.

    3.Independent Renderer rendering runtime, for runtime high performence.

    4.Auto resource management: system memory resource and Gpu memory resource, and one system memory resource for Multiple Gpu context memory resource.

    5.Asynchronous and convenient resource data management strategy(system memory to gpu memory), for runtime high performence. Inclde: update, new, delete, share those system memory or gpu memory resource.

    6.Wasm(WebAssembly) support.

    7.Multiple methods to render a renderable entity, enhance rendering control flexibility.


Engine code in src\vox\

installation:

    step 1, install global nodejs(https://nodejs.org/en/),auto include npm already.
    
    step 2, install yarn(console run: npm install -g yarn)
    
    step 3, enter this dir, console run: yarn install
    
    step 4, enter this dir, console run: yarn dev, you will see success 3d display
    
    step 5, enter this dir, console run: yarn build, build package js

about:

    1. You can find some demos in the src/main.ts file.
