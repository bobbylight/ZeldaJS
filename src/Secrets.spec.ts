import { Secrets } from './Secrets';
import * as chai from 'chai';

describe('Secrets', () => {

    it('get() one-arg works', () => {

        const secrets: Secrets = new Secrets();
        secrets.add('door', {
            value: true,
            defaultValue: true
        });

        chai.assert.equal(secrets.get('door'), true);
    });

    it('get() one-arg fails if unknown flag specified', () => {
        const secrets: Secrets = new Secrets();
        chai.assert.throws(() => { secrets.get('unknown'); });
    });

    it('get() two-arg works', () => {

        const secrets: Secrets = new Secrets();
        secrets.add('door', {
            value: true,
            defaultValue: true
        });

        chai.assert.equal(secrets.get('door', false), true);
        chai.assert.equal(secrets.get('door'), false);
    });

    it('get() two-arg fails if unknown flag specified', () => {
        const secrets: Secrets = new Secrets();
        chai.assert.throws(() => { secrets.get('unknown', true); });
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
        chai.assert.equal(secrets.get('one'), false, "Secret 'one' transient but not reset");
        chai.assert.equal(secrets.get('two'), true, "Secret 'true' not transient but was reset");
    });
});
