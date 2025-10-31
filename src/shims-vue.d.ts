declare module '*.vue' {
    import { defineComponent } from "vue";
    /* eslint-disable  @typescript-eslint/naming-convention */
    const Component: ReturnType<typeof defineComponent>;
    /* eslint-disable import/no-default-export */
    export default Component;
    /* eslint-enable import/no-default-export */
    /* eslint-enable  @typescript-eslint/naming-convention */
}

interface ImportMetaEnv {
    readonly VITE_BUILD_DATE: string;
    readonly VITE_BUILD_VERSION: string;
}
