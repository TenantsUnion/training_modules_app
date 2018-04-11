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
                <td><router-link :to="courseLocation(course)">{{ course.title }}</router-link></td>
                <td>
                    <button class="enrolled-users-btn button primary"
                            @click="enrolledUsers(course)">Enrolled
                    </button>
                </td>
            </tr>
        </table>
    </div>
</template>
<script lang="ts" src="./user_admin_courses_component.ts"></script>
