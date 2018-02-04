<template>
    <nav class="sidebar-nav">
        <div class="row menu-section__row menu-header">
        <span class="menu-section__course-title" v-bind:class="{'is-active': activeNavigation.course}">
            <router-link :to="courseDetails">{{course.title}}</router-link>
        </span>
            <div class="buttons">
                <button title="Edit Course" v-if="isCourseAdmin" class="button button__icon"
                        v-on:click="editCourse">
                    <i class="fa fa-pencil fa-fw "></i>
                    <span class="sr-only">Edit course</span>
                </button>
                <button title="Add Module" v-if="isCourseAdmin" class="button button__icon" v-on:click="createModule">
                    <i class="fa fa-plus fa-fw "></i>
                    <span class="sr-only">Add module</span>
                </button>
            </div>
        </div>
        <div class="menu-section">
            <ul class="menu-section__inner">
                <li class="menu-section__item" v-for="module in course.modules">
                    <div class="row menu-section__row">
                        <span class="menu-section__module-title"
                              v-bind:class="{'is-active': activeNavigation.module === module.title}">
                            <router-link :to="moduleDetailsRoute(module.slug)">{{module.title}}</router-link>
                        </span>
                        <div class="buttons">
                            <button title="Edit Module" v-if="isCourseAdmin" class="button button__icon"
                                    v-on:click="editModule(module.slug)">
                                <i class="fa fa-pencil fa-fw "></i>
                                <span class="sr-only">Edit section</span>
                            </button>
                            <button title="Add Section" v-if="isCourseAdmin" class="button button__icon"
                                    v-on:click="createSection(module.slug)">
                                <i class="fa fa-plus fa-fw "></i>
                                <span class="sr-only">Add section</span>
                            </button>
                        </div>
                    </div>
                    <ul>
                        <li class="menu-section__item" v-for="section in module.sections">
                            <div class="row menu-section__row">
                                <span class="menu-section__section-title"
                                      v-bind:class="{'is-active': isActiveSection(module.title, section.title)}">
                                    <router-link :to="sectionRoute(module.slug, section.slug)">
                                        {{section.title}}
                                    </router-link>
                                </span>
                                <div class="buttons">
                                    <button title="Edit Section" v-if="isCourseAdmin" class="button button__icon"
                                            v-on:click="editSection(module.slug, section.slug)">
                                        <i class="fa fa-pencil fa-fw "></i>
                                        <span class="sr-only">Edit section</span>
                                    </button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>

        </div>
    </nav>
</template>
<style lang="scss" src="./course_navigation_component.scss"></style>

<script src="./course_navigation_component.ts" lang="ts"></script>
