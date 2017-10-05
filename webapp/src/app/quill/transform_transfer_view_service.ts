/**
 * Transforms transfer data views to their quill data view format for display
 */
import {ViewCourseTransferData, ViewCourseQuillData} from '../../../../shared/courses';
import {quillService} from './quill_service';
import {ViewModuleTransferData, ViewModuleQuillData} from 'modules';
import {ViewSectionQuillData, ViewSectionTransferData} from 'sections';
import {QuillEditorData} from '../../../../shared/quill';
import moment from 'moment';
import * as _ from 'underscore';

export class TransformTransferViewService {

    async transformTransferCourseView(course: ViewCourseTransferData): Promise<ViewCourseQuillData> {
        return (async () => {
            let courseContentAsync = course.contentIds.map((id) => {
                return quillService.loadQuillData(id, moment(course.lastModified));
            });

            let courseContent: QuillEditorData[] = await Promise.all(courseContentAsync);
            let courseView: ViewCourseQuillData = _.extend({}, course, {
                content: courseContent,
                lastModified: moment(course.lastModified)
            });
            return courseView;
        })();
    }

    async transformTransferModuleView(module: ViewModuleTransferData): Promise<ViewModuleQuillData> {
        return (async () => {
            let moduleLastModified = moment(module.lastModified);
            let moduleView: ViewModuleQuillData = _.extend({}, module, {
                headerContent: await quillService.loadQuillData(module.headerContent, moduleLastModified),
                lastModified: moduleLastModified
            });
            return moduleView;
        })();
    }

    async transformTransferSectionView(section: ViewSectionTransferData): Promise<ViewSectionQuillData> {
        return (async () => {
            let sectionLastModified = moment(section.lastModified);
            let sectionContentAsync = section.orderedContentIds.map((id) => {
                return quillService.loadQuillData(id, sectionLastModified);
            });

            let sectionContent: QuillEditorData[] = await Promise.all(sectionContentAsync);
            let sectionView = _.extend({}, section, {
                content: sectionContent,
                lastModified: sectionLastModified
            });
            return sectionView;
        })();
    }
}

export const tranformTransferViewService = new TransformTransferViewService();