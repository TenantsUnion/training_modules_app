import * as _ from "underscore";
import {ViewSectionTransferData} from '../../../shared/sections';
import {ViewModuleTransferData} from '../../../shared/modules';
import {ViewCourseTransferData} from '../../../shared/courses';

export const processRow = (row): ViewCourseTransferData => {
    return _.extend({}, row, {
        id: '' + row.id,
        // modules aren't pulled out in order since results are narrowed down via 'WHERE'
        // clause and then automatically joined with ON TRUE. Have to manually order according
        // to orderedModuleIds property
        timeEstimate: '' + row.timeEstimate,
        modules: _.chain(<ViewModuleTransferData[]> row.modules)
            .map((module) => {
                // fixme better way to convert integer ids to strings
                return _.extend({}, module, {
                    id: module.id + '',
                    headerContent: module.headerContent + '',
                    timeEstimate: '' + module.timeEstimate
                })
            })
            .reduce((ordered, module, index, modules) => {
                    if (!Object.keys(ordered.moduleIndex).length) {
                        // initialize lookup
                        ordered.moduleIndex = _.reduce(row.orderedModuleIds, (moduleIndex, moduleId, index) => {
                            moduleIndex[moduleId + ''] = index;
                            return moduleIndex;
                        }, {});
                    }

                    module.sections = _.chain(<ViewSectionTransferData[]> module.sections)
                        .map((section) => {
                            return _.extend({}, section, {
                                id: section.id + '',
                                timeEstimate: '' + section.timeEstimate
                            });
                        })
                        .reduce((ordered, section: ViewSectionTransferData) => {
                            if (!Object.keys(ordered.sectionIndex).length) {
                                // initialize lookup
                                ordered.sectionIndex = _.reduce(module.orderedSectionIds, (sectionIndex, sectionId, index) => {
                                    sectionIndex[sectionId + ''] = index;
                                    return sectionIndex;
                                }, {});
                            }
                            let sectionIndex = ordered.sectionIndex[section.id + ''];
                            ordered.sections[parseInt(sectionIndex)] = section;
                            return ordered;
                        }, {
                            sectionIndex: {},
                            sections: []
                        }).value().sections;

                    let moduleIndex = ordered.moduleIndex[module.id + ''];
                    ordered.modules[parseInt(moduleIndex)] = module;

                    return ordered;
                },
                {
                    moduleIndex: {},
                    modules: []
                }
            ).value().modules
    });
};
