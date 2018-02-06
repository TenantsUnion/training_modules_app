<template>
    <div class="user-main">
        <div class="inner-narrow">
            <div class="row section-header">
                <h4>Available Courses</h4>
            </div>
            <table v-if="courses.length"
                   class="content-list">
                <tr v-for="course in courses"
                    class="content-item">
                    <td>{{ course.title }}</td>
                    <td>{{course.description}}</td>
                    <td>
                        <button class="button primary"
                                @click="preview(course)">
                            Preview
                        </button>
                    </td>
                    <td v-if="enrolling">
                        <button class="button primary"
                                @click="enroll(course)">
                            Enroll
                        </button>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script lang="ts" src="./available_courses_component.ts"></script>
