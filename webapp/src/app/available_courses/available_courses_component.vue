<template>
    <div class="user-main">
        <div class="inner">
            <div class="row section-header">
                <h4>Available Courses</h4>
            </div>
            <table v-if="courses.length"
                   class="content-list">
                <thead>
                <th>Title</th>
                <th>Description</th>
                <th>Time Estimate</th>
                <th>Admins</th>
                <th></th>
                </thead>
                <tbody>
                <tr v-for="course in courses"
                    class="content-item">
                    <td>{{ course.title }}</td>
                    <td>{{course.description}}</td>
                    <td>
                        <time-estimate :time-estimate="course.timeEstimate"/>
                    </td>
                    <td>{{course.admins.join(', ')}}</td>
                    <td>
                        <button class="button primary"
                                @click="preview(course)">
                            Preview
                        </button>
                        <button v-if="enrolling" class="button primary"
                                @click="enroll(course)">
                            Enroll
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script lang="ts" src="./available_courses_component.ts"></script>
