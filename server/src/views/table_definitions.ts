import {Column, ColumnDefinition, Columns, Table, TableDefinition} from "sql";
import sql from 'sql';

export const schema = 'tu';
export const dialect = 'postgres';
// based on course table sql

type Cols<Row> = {[CName in keyof Row]: ColumnDefinition<CName, Row[CName]>};
export type TrainingRow = {
    id: string,
    version: number,
    active: boolean,
    title: string,
    description: string,
    time_estimate: number,
    header_data_id: string,
    submit_individually: boolean,
    //references id pk column of tu.quill_data
    ordered_content_ids: string[],
    //references id pk column of tu.question
    ordered_question_ids: string[],
    //ordering of content and questions together -- ids from ordered_module_ids and ordered_content_ids
    ordered_content_question_ids: string[],
    last_modified_at: string,
    created_at: string,
}

const trainingColumns: Cols<TrainingRow> = {
    id: {dataType: 'text'},
    version: {dataType: 'int'},
    active: {dataType: 'boolean'},
    title: {dataType: 'text'},
    description: {dataType: 'text'},
    time_estimate: {dataType: 'int'},
    header_data_id: {dataType: 'text'},
    submit_individually: {dataType: 'boolean'},
    //references id pk column of tu.quill_data
    ordered_content_ids: {dataType: 'text[]'},
    //references id pk column of tu.question
    ordered_question_ids: {dataType: 'text[]'},
    //ordering of content and questions together -- ids from ordered_module_ids and ordered_content_ids
    ordered_content_question_ids: {dataType: 'text[]'},
    last_modified_at: {dataType: 'timestamptz'},
    created_at: {dataType: 'timestamptz'},
};

export type TrainingProgressRow = {
    version: number,
    user_id: string,
    id: string,
    //key references pk of viewed_content row, timestamptz
    viewed_content_ids: { [index: string]: string },
    //key references pk of question row, timestamptz
    completed_question_ids: { [index: string]: string },
    //key references pk of question row, timestamptz
    submitted_question_ids: { [index: string]: string },
    questions_completed: string,
    content_viewed: string,
    last_viewed_at: string,
    last_modified_at: string,
    created_at: string,
};

export const trainingProgressColumns: Cols<TrainingProgressRow> = {
    version: {dataType: 'int'},
    user_id: {dataType: 'text'},
    id: {dataType: 'text'},
    //key references pk of viewed_content row, timestamptz
    viewed_content_ids: {dataType: 'jsonb'},
    //key references pk of question row, timestamptz
    completed_question_ids: {dataType: 'jsonb'},
    //key references pk of question row, timestamptz
    submitted_question_ids: {dataType: 'jsonb'},
    questions_completed: {dataType: 'timestamptz'},
    content_viewed: {dataType: 'timestamptz'},
    last_viewed_at: {dataType: 'timestamptz'},
    last_modified_at: {dataType: 'timestamptz'},
    created_at: {dataType: 'timestamptz'}
};

export type CourseProgressRow = { course_completed: string } & TrainingProgressRow;

export const courseProgressTableDef: TableDefinition<'course_progress', CourseProgressRow> = {
    schema, dialect,
    name: <'course_progress'> 'course_progress',
    columns: {
        ...trainingProgressColumns,
        course_completed: {dataType: 'timestamptz'}
    }
};

export const courseProgressTable = sql.define(courseProgressTableDef).as('cp');

export type ModuleProgressRow = { module_completed: string } & TrainingProgressRow;

export const moduleProgressTableDef: TableDefinition<'module_progress', ModuleProgressRow> = {
    schema, dialect,
    name: <'module_progress'>  'module_progress',
    columns: {
        ...trainingProgressColumns,
        module_completed: {dataType: 'timestamptz'}
    }
};

export type CourseRow = TrainingRow & {
    open_enrollment: boolean,
    //references id pk column of tu.module
    ordered_module_ids: string[],
}

export const courseTableDef: TableDefinition<'course', CourseRow> = {
    schema, dialect,
    name: <'course'>'course',
    columns: {
        ...trainingColumns,
        open_enrollment: {dataType: 'boolean'},
        //references id pk column of tu.modules
        ordered_module_ids: {dataType: 'text[]'},
    }
};

export const courseTable = sql.define(courseTableDef).as('c');

export type ModuleRow = TrainingRow & {
    //references id pk column of tu.section
    ordered_section_ids: string[],
}

export const moduleTableDef: TableDefinition<'module', ModuleRow> = {
    schema, dialect,
    name: <'module'>'module',
    columns: {
        ...trainingColumns,
        //references id pk column of tu.section
        ordered_section_ids: {dataType: 'text[]'},
    }
};

export const moduleTable = sql.define(moduleTableDef).as('m');

export const sectionTableDef: TableDefinition<'section', TrainingRow> = {
    schema, dialect,
    name: <'section'>'section',
    columns: {...trainingColumns}
};

export const sectionTable = sql.define(sectionTableDef).as('s');

export type UserRow = {
    id: string,
    version: number,
    username: string,
    first_name: string,
    last_name: string,
    admin_of_course_ids: string[],
    enrolled_in_course_ids: string[],
    completed_course_ids: string[],
    created_content_ids: string[]
}

export const userTableDefinition: TableDefinition<'user', UserRow> = {
    schema, dialect,
    name: <'user'> 'user',
    columns: {
        id: {dataType: 'text'},
        version: {dataType: 'int'},
        username: {dataType: 'text'},
        first_name: {dataType: 'text'},
        last_name: {dataType: 'text'},
        admin_of_course_ids: {dataType: 'text[]'},
        enrolled_in_course_ids: {dataType: 'text[]'},
        completed_course_ids: {dataType: 'text[]'},
        created_content_ids: {dataType: 'text[]'}
    }
};

export const userTable = sql.define(userTableDefinition).as('u');

export const getColumns = <Row>(t: Table<string, Row>): Columns<Row> => {
    return (<Column<any, any>[]> t.columns).reduce((acc, col) => {
        acc[col.name] = col;
        return acc;
    }, <Columns<Row>> {})
};
