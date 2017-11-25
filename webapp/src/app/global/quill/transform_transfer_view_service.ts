import {ViewCourseTransferData, ViewCourseQuillData, CourseEntity} from '../../../../../shared/courses';
import {quillService} from './quill_service';
import {ViewModuleTransferData, ViewModuleQuillData} from 'modules.ts';
import {ViewSectionQuillData, ViewSectionTransferData} from 'sections.ts';
import moment from 'moment';
import * as _ from 'underscore';
import {QuillEditorData} from 'quill_editor.ts';
import {ContentSegment} from '../../../../../shared/segment';
import {TrainingEntityPayload} from '../../../../../shared/training_entity';

function isViewCourseQuillData(arg: any): arg is ViewCourseQuillData {
    return arg.content;
}

function isViewModuleQuillData(arg: any): arg is ViewModuleQuillData {
    return arg.headerContent.eachLine;
}

function isViewSectionQuillData(arg: any): arg is ViewModuleQuillData {
    return arg.section;
}

/**
 * Transforms transfer data views to their quill data view format for display
 */
export class TransformTransferViewService {

    async transformTransferCourseView(course: ViewCourseTransferData): Promise<ViewCourseQuillData> {
        if (!course) {
            return null;
        }

        let courseContentAsync = course.orderedContentIds.map((id) => {
            return quillService.loadQuillData(id, moment(course.lastModifiedAt));
        });

        let courseContent: QuillEditorData[] = await Promise.all(courseContentAsync);
        let courseView: ViewCourseQuillData = _.extend({}, course, {
            content: <ContentSegment[]> courseContent.map((content) => _.extend({}, content, {type: 'CONTENT'})),
            lastModified: moment(course.lastModifiedAt)
        });
        return courseView;
    }

    async populateTrainingEntityQuillData(course: TrainingEntityPayload): Promise<TrainingEntityPayload> {
        try {

            let quillAsync = _.map(course.content, (quillData) => {
                return quillData.editorJson ? Promise.resolve(quillData) :
                    quillService.loadQuillData(quillData.id, moment(quillData.lastModified));
            });

            let content: QuillEditorData[] = await Promise.all(quillAsync);
            return {content, ...course};
        } catch (e) {
            console.log(`Error populating TrainingEntity ${course.id}\n${e}`);
            throw e;
        }
    }

    async transformTransferModuleView(module: ViewModuleTransferData): Promise<ViewModuleQuillData> {
        if (!module) {
            return null;
        }

        let headerContentId = module.headerContent;
        let moduleLastModified = moment(module.lastModifiedAt);
        let headerContent = await quillService.loadQuillData(headerContentId, moduleLastModified);
        let moduleView: ViewModuleQuillData = _.extend({}, module, {
            headerContent: headerContent,
            lastModified: moduleLastModified
        });
        return moduleView;
    }

    async transformTransferSectionView(section: ViewSectionTransferData): Promise<ViewSectionQuillData> {
        if (!section) {
            return null;
        }

        let sectionLastModified = moment(section.lastModifiedAt);
        let sectionContentAsync = section.orderedContentIds.map((id) => {
            return quillService.loadQuillData(id, sectionLastModified);
        });

        let sectionContent: QuillEditorData[] = await Promise.all(sectionContentAsync);
        let sectionView = _.extend({}, section, {
            content: sectionContent,
            lastModified: sectionLastModified
        });
        return sectionView;
    }
}

export const transformTransferViewService = new TransformTransferViewService();