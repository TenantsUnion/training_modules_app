<template>
    <div id="wrapper" class="wrapper">
        <div id="sidebar-wrapper" class="sidebar-wrapper">
            <div class="menu-icon-container grid-x align-right">
                <a class="menu-icon" id="menu-toggle"></a>
            </div>
            <loading v-if="currentCourseLoading"></loading>
            <course-navigation v-if="currentCourse"></course-navigation>
        </div>
        <div id="page-content-wrapper" class="page-content-wrapper">
            <router-view></router-view>
        </div>
    </div>
</template>

<style lang="scss" src="./course_component.scss"></style>
<script lang="ts" src="./course_component.ts"></script>
