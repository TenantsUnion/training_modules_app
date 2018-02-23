<template>
    <div class="user-main">
        <div class="inner-narrow">
            <div class="grid-x section-header">
                <h4>Admin Courses</h4>
                <button class="create-course-btn button primary"
                        @click="createCourse">Create a Course
                </button>
            </div>
            <table v-if="courses.length"
                   class="content-list">
                <tr v-for="course in courses"
                    class="content-item">
                    <td>{{ course.title }}</td>
                    <td>
                        <button class="edit-course-btn button primary"
                                @click="go(course)">
                            Edit
                        </button>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script lang="ts" src="./user_admin_courses_component.ts"></script>
