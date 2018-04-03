<template>
    <div class="grid-container grid-padding-x">
        <div class="grid-x">
            <div class="cell small-12">
                <h3>{{course.title}}</h3>
            </div>
        </div>
        <div class="grid-x">
            <div class="cell small-12">
                <course-progress-summary></course-progress-summary>
            </div>
        </div>
        <h5>Enrolled Users</h5>
        <course-enrolled-table></course-enrolled-table>
    </div>
</template>
<script lang="ts" src="./course_enrolled_page_component.ts"></script>