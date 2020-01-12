import { Secrets } from './Secrets';

describe('Secrets', () => {

    it('get() one-arg works', () => {

        const secrets: Secrets = new Secrets();
        secrets.add('door', {
            value: true,
            defaultValue: true
        });

        expect(secrets.get('door')).toBeTruthy();
    });

    it('get() one-arg fails if unknown flag specified', () => {
        const secrets: Secrets = new Secrets();
        expect(() => { secrets.get('unknown'); }).toThrow();
    });

    it('get() two-arg works', () => {

        const secrets: Secrets = new Secrets();
        secrets.add('door', {
            value: true,
            defaultValue: true
        });

        expect(secrets.get('door', false)).toBeTruthy();
        expect(secrets.get('door')).toBeFalsy();
    });

    it('get() two-arg fails if unknown flag specified', () => {
        const secrets: Secrets = new Secrets();
        expect(() => { secrets.get('unknown', true); }).toThrow();
    });

    it('reset() works', () => {

        const secrets: Secrets = new Secrets();

        secrets.add('one', {
            value: true,
            defaultValue: false,
            transient: true
        });
        secrets.add('two', {
            value: true,
            defaultValue: false
        });

        secrets.reset();
        expect(secrets.get('one')).toBeFalsy(); //Secret 'one' transient but not reset
        expect(secrets.get('two')).toBeTruthy(); //Secret 'true' not transient but was reset
    });
});
