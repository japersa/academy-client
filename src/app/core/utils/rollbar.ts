import * as Rollbar from 'rollbar'; // When using Typescript < 3.6.0.
// `import Rollbar from 'rollbar';` is the required syntax for Typescript 3.6.x. 
import { environment } from '../../../environments/environment';

// However, it will only work when setting either `allowSyntheticDefaultImports` 
// or `esModuleInterop` in your Typescript options.

import {
    Injectable,
    Inject,
    InjectionToken,
    ErrorHandler
} from '@angular/core';

const rollbarConfig = environment.rollbarConfig;

export const RollbarService = new InjectionToken<Rollbar>('rollbar');

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
    constructor(@Inject(RollbarService) private rollbar: Rollbar) { }

    handleError(err: any): void {
        this.rollbar.error(err.originalError || err);
    }
}

export function rollbarFactory() {
    return new Rollbar(rollbarConfig);
}