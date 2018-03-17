<template>
    <div class="main">
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
                    <button class="enrolled-users-btn button primary"
                            @click="enrolledUsers(course)">Enrolled
                    </button>
                </td>
                <td>
                    <button class="edit-course-btn button primary"
                            @click="editCourse(course)">
                        Edit
                    </button>
                </td>
            </tr>
        </table>
    </div>
</template>
<script lang="ts" src="./user_admin_courses_component.ts"></script>
