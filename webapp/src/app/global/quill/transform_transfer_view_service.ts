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
    async populateTrainingEntityQuillData<T extends TrainingEntityPayload>(course: T): Promise<T> {
        try {

            let quillAsync = _.map(course.content, (quillData) => {
                return quillData.editorJson ? Promise.resolve(quillData) :
                    quillService.loadQuillData(quillData.id, moment(quillData.lastModified));
            });

            let content: QuillEditorData[] = await Promise.all(quillAsync);
            return _.extend({}, content, course);
        } catch (e) {
            console.log(`Error populating TrainingEntity ${course.id}\n${e}`);
            throw e;
        }
    }
}

export const transformTransferViewService = new TransformTransferViewService();