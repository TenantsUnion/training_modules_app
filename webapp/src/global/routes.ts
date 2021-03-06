export enum USER_ROUTES {
    availableCourses = 'user.availableCourses',
    enrolledCourses = 'user.enrolledCourses',
    adminCourses = 'user.adminCourses'
}

export enum ADMIN_COURSE_ROUTES {
    editCourse = 'adminCourse.editCourse',
    createModule = 'adminCourse.createModule',
    editModule = 'adminCourse.editModule',
    createSection = 'adminCourse.createSection',
    editSection = 'adminCourse.editSection',
    enrolledUsers = 'adminCourse.enrolledUsers'
}

export enum ENROLLED_COURSE_ROUTES {
    enrolledCourse = 'enrolled.course',
    enrolledModule = 'enrolled.Module',
    enrolledSection = 'enrolled.Section'
}

export enum PREVIEW_COURSE_ROUTES {
    coursePreview = 'preview.coursePreview',
    modulePreview = 'preview.modulePreview',
    sectionPreview = 'preview.sectionDetails'
}
