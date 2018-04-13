<template>
    <div class="course-navigation-panel off-canvas position-left">
        <div class="grid-x align-right">
            <div class="cell shrink">
                <button type="button" class="panel-close button" v-on:click="close">
                    <i class="fa fa-bars fa-fw"/>
                </button>
            </div>
        </div>
        <nav class="sidebar-nav">
            <div class="grid-x menu-section__row menu-header">
                <div class="cell auto menu-section__course-title">
                    <router-link :to="courseRoute()"
                                 v-bind:class="{'router-link-active': activeNavigation.course}">
                        {{course.title}}
                    </router-link>
                </div>
            </div>
            <div>
                <ul class="menu-section__inner">
                    <li class="menu-section__item" v-for="module in course.modules">
                        <div class="grid-x menu-section__row">
                        <span class="menu-section__module-title"
                              v-bind:class="{'is-active': activeNavigation.module === module.title}">
                            <router-link :to="moduleRoute(module.slug)">{{module.title}}</router-link>
                        </span>
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
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>

            </div>
        </nav>
    </div>
</template>
<style lang="scss" src="./course_navigation_component.scss" scoped></style>

<script src="./course_navigation_component.ts" lang="ts"></script>
