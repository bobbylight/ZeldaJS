import { Link } from './Link';

describe('Link', () => {
    it('constructor initializes Link properly', () => {
        const link: Link = new Link();

        expect(link.getHealth()).toStrictEqual(6);
        expect(link.getBombCount()).toStrictEqual(99);
    });
});
