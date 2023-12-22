/// <reference types="vite/client" />
declare module 'tcplayer.js' {
    function TCPlayer(
        elementId: string,
        options: {
            sources: { src: string }[],
            licenseUrl: string
        }
    ): any;
}
