import { Link } from './Link';
import * as chai from 'chai';

describe('Link', () => {

    it('constructor initializes Link properly', () => {

        const link: Link = new Link();

        chai.assert.equal(link.getHealth(), 6);
        chai.assert.equal(link.getBombCount(), 99);
    });
});
