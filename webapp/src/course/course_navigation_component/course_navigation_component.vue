<template>
    <nav class="sidebar-nav">
        <div class="grid-x menu-section__row menu-header">
        <span class="menu-section__course-title">
            <router-link :to="courseRoute()" v-bind:class="{'router-link-active': activeNavigation.course}">
                {{course.title}}
            </router-link>
        </span>
            <div v-if="isAdmin" class="buttons">
                <router-link :to="coursePreview">
                    <button title="Preview" class="button button__icon">
                        <i class="fa fa-eye fa-fw "></i>
                        <span class="sr-only">Preview</span>
                    </button>
                </router-link>
                <router-link :to="createModule">
                    <button title="Create Module" v-if="isAdmin" class="button button__icon">
                        <i class="fa fa-plus fa-fw "></i>
                        <span class="sr-only">Create Module</span>
                    </button>
                </router-link>
            </div>
        </div>
        <div class="menu-section">
            <ul class="menu-section__inner">
                <li class="menu-section__item" v-for="module in course.modules">
                    <div class="grid-x menu-section__row">
                        <span class="menu-section__module-title"
                              v-bind:class="{'is-active': activeNavigation.module === module.title}">
                            <router-link :to="moduleRoute(module.slug)">{{module.title}}</router-link>
                        </span>
                        <div v-if="isAdmin" class="buttons">
                            <router-link :to="previewModule(module.slug)">
                                <button title="Preview" class="button button__icon">
                                    <i class="fa fa-eye fa-fw "></i>
                                    <span class="sr-only">Preview</span>
                                </button>
                            </router-link>
                            <router-link :to="createSection(module.slug)">
                                <button title="Add Section" class="button button__icon">
                                    <i class="fa fa-plus fa-fw "></i>
                                    <span class="sr-only">Add section</span>
                                </button>
                            </router-link>
                        </div>
                    </div>
                    <ul>
                        <li class="menu-section__item" v-for="section in module.sections">
                            <div class="grid-x menu-section__row">
                                <span class="menu-section__section-title"
                                      v-bind:class="{'is-active': isActiveSection(module.slug, section.slug)}">
                                    <router-link :to="sectionRoute(module.slug, section.slug)">
                                        {{section.title}}
                                    </router-link>
                                </span>
                                <div v-if="isAdmin" class="buttons">
                                    <router-link :to="previewSection(module.slug, section.slug)">
                                        <button title="Preview" class="button button__icon">
                                            <i class="fa fa-eye fa-fw "></i>
                                            <span class="sr-only">Edit section</span>
                                        </button>
                                    </router-link>
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
