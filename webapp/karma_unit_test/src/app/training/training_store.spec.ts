import {expect} from 'chai';
import sinon from 'sinon';
import {storeConfig} from "@webapp/store/store";
import {Store} from "vuex";
import {
    TRAINING_MUTATIONS, TrainingAccessors, trainingActions, trainingMutations, trainingStoreConfig,
    TrainingType
} from "@webapp/training/training_store";
import {viewsHttpService} from "@webapp/views/views_http_service";
import {ViewCourseData} from "@shared/courses";
import {ViewModuleData} from "@shared/modules";
import {ViewSectionData} from "@shared/sections";
import {
    actionContextMutations, MutationCall, resetState, restoreStoreContext,
    spyActionContext
} from "@karma_unit_test/util/test_vuex_util";

describe('Training Store', function () {
    const courseId = 'CO1';
    const courseTrainingView: ViewCourseData = {
        id: courseId,
        title: 'A course of course',
        version: 0,
        modules: [],
        active: true,
        contentQuestions: []
    };

    const moduleId = 'MO1';
    const moduleTrainingView: ViewModuleData = {
        id: moduleId,
        title: 'module title',
        version: 0,
        sections: [],
        active: true,
        contentQuestions: []
    };

    const sectionId = 'SE1';
    const sectionTrainingView: ViewSectionData = {
        id: sectionId,
        title: 'section title',
        version: 0,
        active: true,
        contentQuestions: []
    };
    const store = new Store(storeConfig);

    afterEach(function () {
        restoreStoreContext(store);
        resetState(store);
    });

    describe('Mutations', function () {
        it('should set state for SET_TRAINING', function () {
            let state = trainingStoreConfig.initState();
            trainingMutations.SET_TRAINING(state, courseTrainingView);
            expect(state).to.deep.eq({
                currentTrainingId: null,
                requests: {},
                trainings: {
                    [courseId]: courseTrainingView
                }
            });
        });
        it('should set state for ADD_TRAINING_REQUEST', function () {
            let state = trainingStoreConfig.initState();
            trainingMutations.ADD_TRAINING_REQUEST(state, courseId);
            expect(state).to.deep.eq({
                currentTrainingId: null,
                requests: {[courseId]: true},
                trainings: {}
            });
        });

        it('should set state for REMOVE_TRAINING_REQUEST', function () {
            let state = trainingStoreConfig.initState();
            trainingMutations.REMOVE_TRAINING_REQUEST(state, courseId);
            // no change
            expect(state).to.deep.eq(trainingStoreConfig.initState());
            trainingMutations.ADD_TRAINING_REQUEST(state, moduleId);
            trainingMutations.REMOVE_TRAINING_REQUEST(state, moduleId);
            expect(state).to.deep.eq(trainingStoreConfig.initState());
        });
        it('should set state for SET_CURRENT_TRAINING', function () {
            let state = trainingStoreConfig.initState();
            trainingMutations.SET_CURRENT_TRAINING(state, moduleId);
            expect(state).to.deep.eq({
                currentTrainingId: moduleId,
                requests: {},
                trainings: {}
            })
        });
    });
    describe('Actions', function () {
        let viewsHttpServiceMock;
        beforeEach(function () {
            viewsHttpServiceMock = sinon.mock(viewsHttpService);
        });

        afterEach(function () {
            viewsHttpServiceMock.verify();
            viewsHttpServiceMock.restore();
        });
        it('should set and load a course training as the current training', async function () {
            viewsHttpServiceMock.expects('loadViews').once()
                .withArgs({courseTraining: true, courseId})
                .returns(Promise.resolve({courseTraining: courseTrainingView}));
            let context = spyActionContext(store, store.state.training);
            await trainingActions.SET_CURRENT_COURSE_TRAINING(context, courseId);
            expect(actionContextMutations(context)).to.deep.eq(<MutationCall[]> [
                {name: TRAINING_MUTATIONS.SET_CURRENT_TRAINING, payload: courseId},
                {name: TRAINING_MUTATIONS.ADD_TRAINING_REQUEST, payload: courseId},
                {name: TRAINING_MUTATIONS.REMOVE_TRAINING_REQUEST, payload: courseId},
                {name: TRAINING_MUTATIONS.SET_TRAINING, payload: courseTrainingView}
            ]);
        });

        it('should set an already loaded course training as the current training', async function () {
            store.commit(TRAINING_MUTATIONS.SET_TRAINING, courseTrainingView);
            viewsHttpServiceMock.expects('loadViews').never();

            let context = spyActionContext(store, store.state.training);
            await trainingActions.SET_CURRENT_COURSE_TRAINING(context, courseId);
            expect(actionContextMutations(context)).to.deep.eq(<MutationCall[]> [
                {name: TRAINING_MUTATIONS.SET_CURRENT_TRAINING, payload: courseId}
            ]);
        });

        it('should set and load a module training as the current training', async function () {
            viewsHttpServiceMock.expects('loadViews').once()
                .withArgs({moduleTraining: true, moduleId})
                .returns(Promise.resolve({moduleTraining: moduleTrainingView}));

            let context = spyActionContext(store, store.state.training);
            await trainingActions.SET_CURRENT_MODULE_TRAINING(context, moduleId);
            expect(actionContextMutations(context)).to.deep.eq(<MutationCall[]> [
                {name: TRAINING_MUTATIONS.SET_CURRENT_TRAINING, payload: moduleId},
                {name: TRAINING_MUTATIONS.ADD_TRAINING_REQUEST, payload: moduleId},
                {name: TRAINING_MUTATIONS.REMOVE_TRAINING_REQUEST, payload: moduleId},
                {name: TRAINING_MUTATIONS.SET_TRAINING, payload: moduleTrainingView}
            ]);
        });

        it('should set an already loaded module training as the current training', async function () {
            store.commit(TRAINING_MUTATIONS.SET_TRAINING, moduleTrainingView);
            viewsHttpServiceMock.expects('loadViews').never();

            let context = spyActionContext(store, store.state.training);
            await trainingActions.SET_CURRENT_MODULE_TRAINING(context, moduleId);
            expect(actionContextMutations(context)).to.deep.eq(<MutationCall[]> [
                {name: TRAINING_MUTATIONS.SET_CURRENT_TRAINING, payload: moduleId}
            ]);
        });

        it('should set and load a section training as the current training', async function () {
            viewsHttpServiceMock.expects('loadViews').once()
                .withArgs({sectionTraining: true, sectionId})
                .returns(Promise.resolve({sectionTraining: sectionTrainingView}));

            let context = spyActionContext(store, store.state.training);
            await trainingActions.SET_CURRENT_SECTION_TRAINING(context, sectionId);
            expect(actionContextMutations(context)).to.deep.eq(<MutationCall[]> [
                {name: TRAINING_MUTATIONS.SET_CURRENT_TRAINING, payload: sectionId},
                {name: TRAINING_MUTATIONS.ADD_TRAINING_REQUEST, payload: sectionId},
                {name: TRAINING_MUTATIONS.REMOVE_TRAINING_REQUEST, payload: sectionId},
                {name: TRAINING_MUTATIONS.SET_TRAINING, payload: sectionTrainingView}
            ]);

        });

        it('should set an already loaded section training as the current training', async function () {
            store.commit(TRAINING_MUTATIONS.SET_TRAINING, sectionTrainingView);
            viewsHttpServiceMock.expects('loadViews').never();

            let context = spyActionContext(store, store.state.training);
            await trainingActions.SET_CURRENT_SECTION_TRAINING(context, sectionId);
            expect(actionContextMutations(context)).to.deep.eq(<MutationCall[]> [
                {name: TRAINING_MUTATIONS.SET_CURRENT_TRAINING, payload: sectionId}
            ]);
        });
    });
    describe('Getters', function () {
        let getters: TrainingAccessors = store.getters;
        beforeEach(function () {
            store.commit(TRAINING_MUTATIONS.SET_TRAINING, courseTrainingView);
            store.commit(TRAINING_MUTATIONS.SET_TRAINING, moduleTrainingView);
            store.commit(TRAINING_MUTATIONS.SET_TRAINING, sectionTrainingView);
        });
        describe('currentTraining', function () {
            it('should return the course training corresponding to id \'CO1\'', function () {
                store.commit(TRAINING_MUTATIONS.SET_CURRENT_TRAINING, courseId);
                expect(getters.currentTraining).to.deep.eq(courseTrainingView);
            });
            it('should return the module training corresponding to id \'MO1\'', function () {
                store.commit(TRAINING_MUTATIONS.SET_CURRENT_TRAINING, moduleId);
                expect(getters.currentTraining).to.deep.eq(moduleTrainingView);
            });
            it('should return the section training corresponding to id \'SE1\'', function () {
                store.commit(TRAINING_MUTATIONS.SET_CURRENT_TRAINING, sectionId);
                expect(getters.currentTraining).to.deep.eq(sectionTrainingView);
            });
        });
        it('should return the currentTrainingType', function () {
            it('should return \'COURSE\' training type', function () {
                store.commit(TRAINING_MUTATIONS.SET_CURRENT_TRAINING, courseId);
                expect(getters.currentTrainingType).to.eq(TrainingType.course);
            });
            it('should return \'MODULE\' training type', function () {
                store.commit(TRAINING_MUTATIONS.SET_CURRENT_TRAINING, moduleId);
                expect(getters.currentTrainingType).to.eq(TrainingType.module);
            });
            it('should return \'SECTION\' training type', function () {
                store.commit(TRAINING_MUTATIONS.SET_CURRENT_TRAINING, sectionId);
                expect(getters.currentTrainingType).to.eq(TrainingType.section);
            });
        });
    });
});