<template>
    <div class="user-main">
        <div class="inner-narrow">
            <div class="row section-header">
                <h4>Enrolled in courses</h4>
                <button class="button primary"
                        @click="enrollInCourse">
                    Enroll in a Course
                </button>
            </div>
            <table v-if="courses.length"
                   class="content-list">
                <tr v-for="course in courses"
                    class="content-item">
                    <td>{{ course.title }}</td>
                    <td>
                        <button class="button primary"
                                @click="go(course.slug)">
                            Go to Course
                        </button>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script lang="ts" src="./user_enrolled_courses_component.ts"></script>
