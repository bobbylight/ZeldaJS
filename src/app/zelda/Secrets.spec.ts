import { Secrets } from './Secrets';

describe('Secrets', () => {

    it('get() one-arg works', () => {

        const secrets: Secrets = new Secrets();
        secrets.add('door', {
            value: true,
            defaultValue: true
        });

        expect(secrets.get('door')).toBe(true);
    });

    it('get() two-arg works', () => {

        const secrets: Secrets = new Secrets();
        secrets.add('door', {
            value: true,
            defaultValue: true
        });

        expect(secrets.get('door', false)).toBe(true);
        expect(secrets.get('door')).toBe(false);
    });
});
