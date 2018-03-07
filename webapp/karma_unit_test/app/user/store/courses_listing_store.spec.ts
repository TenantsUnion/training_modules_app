import {expect} from 'chai';
import Vuex, {Store} from 'vuex'
import Vue from 'vue';
import sinon from 'sinon';
import {storeConfig} from "@webapp_root/state_store";
import {USER_MUTATIONS} from "@user/store/user_store";
import {
    COURSES_LISTING_MUTATIONS,
    coursesListingActions
} from "@user/store/courses_listing_store";
import {userHttpService} from "@user/user_http_service";
import {AdminCourseDescription, EnrolledCourseDescription} from "@shared/courses";
import {
    actionContextMutations, MutationCall, resetState, restoreStoreContext, spyActionContext
} from "../../../util/test_vuex_util";

describe('Course listing store', function () {
    Vue.use(Vuex);
    let store = new Store(storeConfig);
    beforeEach(function () {
        store = new Store(storeConfig);
    });

    afterEach(function(){
       restoreStoreContext(store);
       resetState(store);
    });

    describe('LOAD_COURSE_LISTINGS action', function () {
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

            let context = spyActionContext(store, store.state.userCourses);
            await coursesListingActions.LOAD_COURSE_LISTINGS(context);
            expect(actionContextMutations(context)).to.deep.eq(<MutationCall[]>[
                {name: COURSES_LISTING_MUTATIONS.SET_COURSE_DESCRIPTIONS_LOADING, payload: true},
                {name: COURSES_LISTING_MUTATIONS.SET_USER_COURSES_LISTINGS_LOADED, payload: false},
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
                {name: COURSES_LISTING_MUTATIONS.SET_USER_COURSES_LISTINGS_LOADED, payload: true}
            ]);
        });

        it('should not load course listings when the user is not logged in', async function () {
            let spyContext = spyActionContext(store, store.state.userCourses);
            await coursesListingActions.LOAD_COURSE_LISTINGS(spyContext);
            userHttpServiceMock.expects('loadUserCourses').never();
        });

        it('should not load course listings when the listings are already loading', async function () {
            store.commit(COURSES_LISTING_MUTATIONS.SET_COURSE_DESCRIPTIONS_LOADING, true);
            store.commit(USER_MUTATIONS.USER_LOGIN, {id: userId, username: 'test_user'});

            let spyContext = spyActionContext(store, store.state.userCourses);
            await coursesListingActions.LOAD_COURSE_LISTINGS(spyContext);
            userHttpServiceMock.expects('loadUserCourses').never();
        });

        it('should not load course listings when the listings have already been loaded', async function () {
            // store.commit(USER_MUTATIONS.USER_LOGIN, {id: userId, username: 'test_user'});
            let spyContext = spyActionContext(store, store.state.userCourses);
            await coursesListingActions.LOAD_COURSE_LISTINGS(spyContext);
            userHttpServiceMock.expects('loadUserCourses').never();
        });
    });


});