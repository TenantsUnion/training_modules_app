import {ViewCourseQuillData} from '@shared/courses';
import {quillService} from './quill_service';
import {ViewModuleQuillData} from '@shared/modules';
import moment from 'moment';
import * as _ from 'underscore';
import {QuillEditorData} from '@shared/quill_editor';
import {ContentSegment} from '@shared/segment';
import {
    ViewTrainingEntityQuillData,
    ViewTrainingEntityTransferData
} from '@shared/training_entity';

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
    async populateTrainingEntityQuillData<Q extends ViewTrainingEntityQuillData>(course: ViewTrainingEntityTransferData): Promise<Q> {
        try {
            let quillAsync = _.map(course.orderedContentIds, (contentId) => {
                return quillService.loadQuillData(contentId, moment(course.lastModifiedAt));
            });

            // todo load quill ids for questions
            // todo add remove callbacks for segments

            let content: QuillEditorData[] = await Promise.all(quillAsync);
            let contentSegments:ContentSegment[] = content.map((quillEditor) => {
                return _.extend({}, quillEditor, {type: 'CONTENT'});
            });
            return _.extend({}, {content: contentSegments}, course);
        } catch (e) {
            console.log(`Error populating TrainingEntity ${course.id}\n${e}`);
            throw e;
        }
    }
}

export const transformTransferViewService = new TransformTransferViewService();