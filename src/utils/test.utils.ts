import { mock as angularMock } from 'angular';

export function mockService(provide: string, methods?: string[]) {
    return {
        provide,
        methods
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
        const MockService = {};
        if (service.methods && service.methods.length) {
            service.methods.forEach(method => {
                MockService[method] = () => {};
            });
        }
        provider[service.provide] = MockService;
    });
    angularMock.module(provider);
}
