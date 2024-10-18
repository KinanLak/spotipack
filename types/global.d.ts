import Router from '../src/ts/Router';

declare global {
    interface Window {
        router: Router;
    }
}