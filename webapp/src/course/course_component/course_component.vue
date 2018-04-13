<template>
    <div>
        <button v-on:click="openCourseNavigation"
                class="show-canvas show-course-navigation button secondary hollow">
            <i class="fa fa-bars fa-fw"/>
        </button>
        <!--off canvas have to be siblings for push to work-->
        <course-navigation ref="courseNavigationPanel" :onClose="onCloseCourseNavigation"></course-navigation>
        <div class="off-canvas-content" data-off-canvas-content>
            <router-view></router-view>
        </div>
        <!--own off canvas wrapper so it doesn't affect training page-->
        <div class="off-canvas-wrapper">
            <training-panel ref="trainingPanel" :onClose="onCloseTrainingPanel"
                            ></training-panel>
        </div>
        <button v-on:click="openTrainingPanel" class="show-training-panel show-canvas button secondary hollow">
            <i class="fa fa-bars fa-fw"/>
        </button>
    </div>
</template>
<style lang="scss" scoped>
    .off-canvas-content {
        padding-left: 4em;
        padding-right: 4em
    }

    .show-canvas {
        top: $user-bar-height;
        position: absolute;
        bottom: 0;

        &.show-training-panel {
            right: 0;
        }

        &.show-course-navigation {
            left: 0;
        }
    }
</style>
<script lang="ts" src="./course_component.ts"></script>
