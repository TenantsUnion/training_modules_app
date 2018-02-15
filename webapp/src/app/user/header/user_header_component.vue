<template>
    <div class="user-header-wrapper">
        <nav class="row">
            <div class="menu-section columns">
                <ul class="menu menu-section__menu">
                    <li v-bind:class="{'is-active': adminCoursesActive}">
                        <router-link class="admin-courses-nav" :to="adminCourses">Admin Courses</router-link>
                    </li>
                    <li v-bind:class="{'is-active': enrolledCoursesActive}">
                        <router-link class="enrolled-courses-nav" :to="enrolledCourses">Enrolled Courses</router-link>
                    </li>
                </ul>
            </div>
            <div class="menu-section columns shrink user-actions">
                <span class="welcome-message">Welcome, {{ username }}!</span>
                <button class="logout-btn button secondary" @click="signout">Sign Out</button>
            </div>
        </nav>
    </div>
</template>

<style lang="scss" src="./user_header_component.scss"></style>

<script lang="ts" src="./user_header_component.ts"></script>