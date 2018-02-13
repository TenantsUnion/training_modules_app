import {expect} from 'chai';
import {slugToId, slugToTitle, titleToSlug} from '@shared/slug/title_slug_transformations';

describe('title slug transformation', function () {

    it('should encode slugs in lowercase', function () {
        let title = 'TiTLe';
        let slug = 'title';
        expect(titleToSlug(title)).to.equal(slug);
        expect(slugToTitle(slug)).to.equal(title.toLowerCase());
    });

    it('should encode and decode \' \' as \'sp\'', function () {
        let title = 'A Course Title';
        let slug = 'a(sp)course(sp)title';
        expect(titleToSlug(title)).to.equal(slug);
        expect(slugToTitle(slug)).to.equal(title.toLowerCase());
    });

    it('should encode and decode \'/\' as \'fs\'', function () {
        let title = 'A/Course/Title';
        let slug = 'a(fs)course(fs)title';
        expect(titleToSlug(title)).to.equal(slug);
        expect(slugToTitle(slug)).to.equal(title.toLowerCase());
    });

    it('should encode and decode \'?\' as \'qm\'', function () {
        let title = 'A?Course?Title';
        let slug = 'a(qm)course(qm)title';
        expect(titleToSlug(title)).to.equal(slug);
        expect(slugToTitle(slug)).to.equal(title.toLowerCase());
    });

    it('should encode and decode \'@\' as \'at\'', function () {
        let title = 'A@Course@Title';
        let slug = 'a(at)course(at)title';
        expect(titleToSlug(title)).to.equal(slug);
        expect(slugToTitle(slug)).to.equal(title.toLowerCase());
    });

    it('should encode and decode \'&\' as \'as\'', function () {
        let title = 'A&Course&Title';
        let slug = 'a(as)course(as)title';
        expect(titleToSlug(title)).to.equal(slug);
        expect(slugToTitle(slug)).to.equal(title.toLowerCase());
    });

    it('should encode and decode \'#\' as \'hs\'', function () {
        let title = 'A#Course#Title';
        let slug = 'a(hs)course(hs)title';
        expect(titleToSlug(title)).to.equal(slug);
        expect(slugToTitle(slug)).to.equal(title.toLowerCase());
    });

    it('should encode multiple characters in a row', function () {
        let title = 'A  Course Title/2--2017@5pm';
        let slug = 'a(spsp)course(sp)title(fs)2--2017(at)5pm';
        expect(titleToSlug(title)).to.equal(slug);
        expect(slugToTitle(slug)).to.equal(title.toLowerCase());
    });

    it('should return a slug from a non unique course title that has the course id in it', function () {
        let title = 'A Course Title';
        let slug = 'a(sp)course(sp)title__2';
        let id = '2';
        expect(titleToSlug(title, true, id)).to.equal(slug);
        expect(slugToTitle(slug)).to.equal(title.toLowerCase());
        expect(slugToId(slug)).to.equal(id);
    });

    it('should return null as the embedded id when there is no id in the slug', function () {
        expect(slugToId('no_id')).to.equal(null);
    });
});
