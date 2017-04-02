// Workaround for @types/angular not defining angular as global "properly"
// http://stackoverflow.com/questions/40664298/angular-1-x-with-typescript-2-x-types-and-systemjs-using-global-typings
declare global {
    const angular: ng.IAngularStatic;
}
export {};
