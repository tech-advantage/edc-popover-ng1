import { mock as angularMock } from 'angular';
import { Helper, Article, Link } from 'edc-client-js';

export function mockService(provide: string, methods?: string[], useClass?: any) {
    return {
        provide,
        methods,
        useClass
    };
}
export function mockServices(services: any): void {
    if (!services || !services.length) {
        return;
    }
    const provider = {};
    services
        .filter(Boolean)
        .forEach(service => {
        const MockService = service.useClass || {};
        if (!service.useClass && service.methods && service.methods.length) {
            service.methods.forEach(method => {
                MockService[method] = () => {};
            });
        }
        provider[service.provide] = MockService;
    });
    angularMock.module(provider);
}

export function mock<T>(type: new(...args: any[]) => T, object: any = {}): T {
    const entity: T = new type();
    Object.assign(entity, object);
    return entity;
}

/**
 * Mock a documentation helper
 *
 */
export function mockHelper(): Helper {
    return mock(Helper, {
        label: 'MyTitle',
        description: 'MyDescription',
        articles: [
            mock(Article, {
                label: 'articleLabel1',
                url: 'articleUrl1'
            })
        ],
        links: [
            mock(Link, {
                id: 7,
                label: 'linkLabel1',
                url: 'linkUrl1'
            })
        ],
        language: 'en',
        exportId: 'resolvedPluginId'
    });
}
