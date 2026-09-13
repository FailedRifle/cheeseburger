/*global Ultraviolet*/
self.__uv$config = {
    prefix: '/glass/service/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/glass/glassJS.handler.js',
    client: '/glass/glassJS.client.js',
    bundle: '/glass/glassJS.bundle.js',
    config: '/glass/glassJS.config.js',
    sw: '/glass/glassJS.sw.js',
};
