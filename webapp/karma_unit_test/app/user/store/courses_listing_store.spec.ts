import {expect} from 'chai';
import {Store} from 'vuex'
import sinon from 'sinon';
import {storeConfig} from "@webapp_root/state_store";
import {USER_MUTATIONS} from "@user/store/user_store";
import {
    COURSES_LISTING_MUTATIONS, CoursesListingAccessors,
    coursesListingActions} from "@user/store/courses_listing_store";
import {userHttpService} from "@user/user_http_service";
import {AdminCourseDescription, EnrolledCourseDescription} from "@shared/courses";
import {
    actionContextMutations, MutationCall, resetState, restoreStoreContext, spyActionContext
} from "../../../util/test_vuex_util";
import {CourseMode} from "@course/store/course_mutations";

describe('Course listing store', function () {
    const store = new Store(storeConfig);
    afterEach(function () {
        restoreStoreContext(store);
        resetState(store);
    });

    describe('actions', function () {
        describe('LOAD_COURSE_LISTINGS', function () {
            const userId = 'U1';
            let userHttpServiceMock;
            beforeEach(function () {
                userHttpServiceMock = sinon.mock(userHttpService);
            });

            afterEach(function () {
                userHttpServiceMock.verify();
                userHttpServiceMock.restore();
            });

            it('should load admin and enrolled course listings', async function () {
                const adminCourse: AdminCourseDescription = {id: 'CO1', title: 'admin course'};
                const enrolledCourse: EnrolledCourseDescription = {id: 'CO2', title: 'enrolled course'};

                userHttpServiceMock.expects('loadUserCourses').once()
                    .withArgs(userId)
                    .returns(Promise.resolve({
                        admin: [adminCourse],
                        enrolled: [enrolledCourse]
                    }));

                store.commit(USER_MUTATIONS.USER_LOGIN, {id: userId, username: 'test_user'});

                let context = spyActionContext(store, store.state.coursesListing);
                await coursesListingActions.LOAD_COURSE_LISTINGS(context);
                expect(actionContextMutations(context)).to.deep.eq(<MutationCall[]>[
                    {name: COURSES_LISTING_MUTATIONS.SET_COURSE_DESCRIPTIONS_LOADING, payload: true},
                    {name: COURSES_LISTING_MUTATIONS.SET_COURSES_LISTINGS_LOADED, payload: false},
                    {name: COURSES_LISTING_MUTATIONS.SET_COURSE_DESCRIPTIONS_LOADING, payload: false},
                    {
                        name: COURSES_LISTING_MUTATIONS.SET_ADMIN_COURSE_DESCRIPTIONS, payload: [{
                            id: "CO1",
                            title: "admin course"
                        }]
                    },
                    {
                        name: COURSES_LISTING_MUTATIONS.SET_ENROLLED_COURSE_DESCRIPTIONS, payload:
                            [{
                                id: "CO2",
                                title: "enrolled course"
                            }]
                    },
                    {name: COURSES_LISTING_MUTATIONS.SET_COURSES_LISTINGS_LOADED, payload: true}
                ]);
            });

            it('should not load course listings when the user is not logged in', async function () {
                let spyContext = spyActionContext(store, store.state.coursesListing);
                await coursesListingActions.LOAD_COURSE_LISTINGS(spyContext);
                userHttpServiceMock.expects('loadUserCourses').never();
            });

            it('should not load course listings when the listings are already loading', async function () {
                store.commit(COURSES_LISTING_MUTATIONS.SET_COURSE_DESCRIPTIONS_LOADING, true);
                store.commit(USER_MUTATIONS.USER_LOGIN, {id: userId, username: 'test_user'});

                let spyContext = spyActionContext(store, store.state.coursesListing);
                await coursesListingActions.LOAD_COURSE_LISTINGS(spyContext);
                userHttpServiceMock.expects('loadUserCourses').never();
            });

            it('should not load course listings when the listings have already been loaded', async function () {
                store.commit(USER_MUTATIONS.USER_LOGIN, {id: userId, username: 'test_user'});
                store.commit(COURSES_LISTING_MUTATIONS.SET_COURSES_LISTINGS_LOADED, true);
                let spyContext = spyActionContext(store, store.state.coursesListing);
                await coursesListingActions.LOAD_COURSE_LISTINGS(spyContext);
                userHttpServiceMock.expects('loadUserCourses').never();
            });
        });
    });

    describe('getters', function () {
        let getters: CoursesListingAccessors = store.getters;
        const duplicateTitle1 = 'duplicate title 1';
        const duplicateTitle2 = 'duplicate title 2';
        // valid state relies on precondition that ids are not the same
        const adminCourse = {
            id: 'CO1',
            title: 'admin title'
        };
        const duplicateTitle1AdminCourse1 = {
            id: 'CO2',
            title: duplicateTitle1
        };
        const duplicateTitle1AdminCourse2 = {
            id: 'CO3',
            title: duplicateTitle1
        };
        const duplicateTitle2AdminCourse = {
            id: 'CO4',
            title: duplicateTitle2
        };
        const enrolledCourse = {
            id: 'CO5',
            title: 'enrolled title'
        };
        const duplicateTitle1EnrolledCourse = {
            id: 'CO6',
            title: duplicateTitle1
        };
        const duplicateTitle2EnrolledCourse1 = {
            id: 'CO7',
            title: duplicateTitle2
        };
        const duplicateTitle2EnrolledCourse2 = {
            id: 'CO8',
            title: duplicateTitle2
        };
        let adminCourseDescriptions: AdminCourseDescription[] = [
            adminCourse, duplicateTitle1AdminCourse1, duplicateTitle1AdminCourse2, duplicateTitle2AdminCourse
        ];
        let enrolledCourseDescriptions: EnrolledCourseDescription[] = [
            enrolledCourse, duplicateTitle1EnrolledCourse, duplicateTitle2EnrolledCourse1, duplicateTitle2EnrolledCourse2
        ];

        beforeEach(function () {
            store.commit(COURSES_LISTING_MUTATIONS.SET_ADMIN_COURSE_DESCRIPTIONS, adminCourseDescriptions);
            store.commit(COURSES_LISTING_MUTATIONS.SET_ENROLLED_COURSE_DESCRIPTIONS, enrolledCourseDescriptions);
        });
        it('getCourseIdFromSlug ', function () {
            let {getCourseIdFromSlug} = getters;

            expect(getCourseIdFromSlug('admin(sp)title')).to.eq(adminCourse.id);
            expect(getCourseIdFromSlug('duplicate(sp)title(sp)1__CO2')).to.eq(duplicateTitle1AdminCourse1.id);
            expect(getCourseIdFromSlug('duplicate(sp)title(sp)1__CO3')).to.eq(duplicateTitle1AdminCourse2.id);
            expect(getCourseIdFromSlug('duplicate(sp)title(sp)2__CO4')).to.eq(duplicateTitle2AdminCourse.id);

            expect(getCourseIdFromSlug('enrolled(sp)title')).to.eq(enrolledCourse.id);
            expect(getCourseIdFromSlug('duplicate(sp)title(sp)1__CO6')).to.eq(duplicateTitle1EnrolledCourse.id);
            expect(getCourseIdFromSlug('duplicate(sp)title(sp)2__CO7')).to.eq(duplicateTitle2EnrolledCourse1.id);
            expect(getCourseIdFromSlug('duplicate(sp)title(sp)2__CO8')).to.eq(duplicateTitle2EnrolledCourse2.id);

        });
        it('getSlugFromCourseId', function () {
            let {getSlugFromCourseId} = getters;
            expect(getSlugFromCourseId(adminCourse.id)).to.eq('admin(sp)title');
            expect(getSlugFromCourseId(duplicateTitle1AdminCourse1.id)).to.eq('duplicate(sp)title(sp)1__CO2');
            expect(getSlugFromCourseId(duplicateTitle1AdminCourse2.id)).to.eq('duplicate(sp)title(sp)1__CO3');
            expect(getSlugFromCourseId(duplicateTitle2AdminCourse.id)).to.eq('duplicate(sp)title(sp)2__CO4');

            expect(getSlugFromCourseId(enrolledCourse.id)).to.eq('enrolled(sp)title');
            expect(getSlugFromCourseId(duplicateTitle1EnrolledCourse.id)).to.eq('duplicate(sp)title(sp)1__CO6');
            expect(getSlugFromCourseId(duplicateTitle2EnrolledCourse1.id)).to.eq('duplicate(sp)title(sp)2__CO7');
            expect(getSlugFromCourseId(duplicateTitle2EnrolledCourse2.id)).to.eq('duplicate(sp)title(sp)2__CO8');
        });

        it('getCourseModeFromId ', function () {
            let {getCourseModeFromId} = getters;
            expect(getCourseModeFromId(adminCourse.id)).to.eq(CourseMode.ADMIN);
            expect(getCourseModeFromId(duplicateTitle1AdminCourse1.id)).to.eq(CourseMode.ADMIN);
            expect(getCourseModeFromId(duplicateTitle1AdminCourse2.id)).to.eq(CourseMode.ADMIN);
            expect(getCourseModeFromId(duplicateTitle2AdminCourse.id)).to.eq(CourseMode.ADMIN);

            expect(getCourseModeFromId(enrolledCourse.id)).to.eq(CourseMode.ENROLLED);
            expect(getCourseModeFromId(duplicateTitle1EnrolledCourse.id)).to.eq(CourseMode.ENROLLED);
            expect(getCourseModeFromId(duplicateTitle2EnrolledCourse1.id)).to.eq(CourseMode.ENROLLED);
            expect(getCourseModeFromId(duplicateTitle2EnrolledCourse2.id)).to.eq(CourseMode.ENROLLED);

            expect(getCourseModeFromId('ZZ')).to.eq(CourseMode.PREVIEW);

        });
        it('getCourseModeFromSlug ', function () {
            let {getCourseModeFromSlug} = getters;
            expect(getCourseModeFromSlug('admin(sp)title')).to.eq(CourseMode.ADMIN);
            expect(getCourseModeFromSlug('duplicate(sp)title(sp)1__CO2')).to.eq(CourseMode.ADMIN);
            expect(getCourseModeFromSlug('duplicate(sp)title(sp)1__CO3')).to.eq(CourseMode.ADMIN);
            expect(getCourseModeFromSlug('duplicate(sp)title(sp)2__CO4')).to.eq(CourseMode.ADMIN);

            expect(getCourseModeFromSlug('enrolled(sp)title')).to.eq(CourseMode.ENROLLED);
            expect(getCourseModeFromSlug('duplicate(sp)title(sp)1__CO6')).to.eq(CourseMode.ENROLLED);
            expect(getCourseModeFromSlug('duplicate(sp)title(sp)2__CO7')).to.eq(CourseMode.ENROLLED);
            expect(getCourseModeFromSlug('duplicate(sp)title(sp)2__CO8')).to.eq(CourseMode.ENROLLED);

            expect(getCourseModeFromSlug('not(sp)enrolled(sp)or(admin)')).to.eq(CourseMode.PREVIEW);
        });

        it('adminCourseListingMap ', function () {
            let {adminCourseListingMap} = getters;
            expect(adminCourseListingMap).to.deep.eq({
                CO1: {
                    id: "CO1",
                    slug: "admin(sp)title",
                    title: "admin title"
                },
                CO2: {
                    id: "CO2",
                    slug: "duplicate(sp)title(sp)1__CO2",
                    title: "duplicate title 1"
                },
                CO3: {
                    id: "CO3",
                    slug: "duplicate(sp)title(sp)1__CO3",
                    title: "duplicate title 1"
                },
                CO4: {
                    id: "CO4",
                    slug: "duplicate(sp)title(sp)2__CO4",
                    title: "duplicate title 2"
                }
            });
        });
    });
});