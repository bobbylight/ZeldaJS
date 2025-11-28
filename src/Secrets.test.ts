import { describe, expect, it } from 'vitest';
import { Secrets } from './Secrets';

describe('Secrets', () => {
    it('get() one-arg works', () => {
        const secrets: Secrets = new Secrets();
        secrets.add('door', {
            value: true,
            defaultValue: true,
        });

        expect(secrets.get('door')).toEqual(true);
    });

    it('get() one-arg fails if unknown flag specified', () => {
        const secrets: Secrets = new Secrets();
        expect(() => {
            secrets.get('unknown');
        }).toThrow();
    });

    it('get() two-arg works', () => {
        const secrets: Secrets = new Secrets();
        secrets.add('door', {
            value: true,
            defaultValue: true,
        });

        expect(secrets.get('door', false)).toEqual(true);
        expect(secrets.get('door')).toEqual(false);
    });

    it('get() two-arg fails if unknown flag specified', () => {
        const secrets: Secrets = new Secrets();
        expect(() => {
            secrets.get('unknown', true);
        }).toThrow();
    });

    it('reset() works', () => {
        const secrets: Secrets = new Secrets();

        secrets.add('one', {
            value: true,
            defaultValue: false,
            transient: true,
        });
        secrets.add('two', {
            value: true,
            defaultValue: false,
        });

        secrets.reset();
        expect(secrets.get('one')).toEqual(false); // Secret 'one' transient but not reset
        expect(secrets.get('two')).toEqual(true); // Secret 'true' not transient but was reset
    });
});
