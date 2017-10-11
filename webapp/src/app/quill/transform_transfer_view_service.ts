import {ViewCourseTransferData, ViewCourseQuillData} from '../../../../shared/courses';
import {quillService} from './quill_service';
import {ViewModuleTransferData, ViewModuleQuillData} from 'modules';
import {ViewSectionQuillData, ViewSectionTransferData} from 'sections';
import {QuillEditorData} from '../../../../shared/quill';
import moment from 'moment';
import * as _ from 'underscore';

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
        if(!course){
            return null;
        }

        let contentIds = course.contentIds;
        let courseContentAsync = contentIds.map((id) => {
            return quillService.loadQuillData(id, moment(course.lastModifiedAt));
        });

        let courseContent: QuillEditorData[] = await Promise.all(courseContentAsync);
        let courseView: ViewCourseQuillData = _.extend({}, course, {
            content: courseContent,
            lastModified: moment(course.lastModifiedAt)
        });
        return courseView;
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