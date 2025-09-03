declare module '*.vue' {
    import { defineComponent } from "vue";
    /* eslint-disable  @typescript-eslint/naming-convention */
    const Component: ReturnType<typeof defineComponent>;
    export default Component;
    /* eslint-enable  @typescript-eslint/naming-convention */
}

interface ImportMetaEnv {
    readonly VITE_BUILD_DATE: string;
    readonly VITE_BUILD_VERSION: string;
}
