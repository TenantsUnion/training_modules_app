export enum USER_ROUTES {
    availableCourses = 'user.availableCourses',
    enrolledCourses = 'user.enrolledCourses',
    adminCourses = 'user.adminCourses'
}

export enum ADMIN_COURSE_ROUTES {
    editCourse = 'adminCourse.editCourse',
    createModule = 'adminCourse.createModule',
    editModule = 'admin.editModule',
    createSection = 'adminCourse.createSection',
    editSection = 'course.editSection'
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
