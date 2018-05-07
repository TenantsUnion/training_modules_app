<template>
    <div class="off-canvas training-panel position-right">
        <div class="grid-x align-left">
            <div class="cell shrink">
                <button type="button" class="panel-close button secondary" v-on:click="close">
                    <bars-icon></bars-icon>
                </button>
            </div>
        </div>
        <ul class="accordion">
            <li class="accordion-item is-active" data-accordion-item>
                <a href="" class="accordion-title">Actions</a>
                <div class="accordion-content" data-tab-content>
                    <edit-actions></edit-actions>
                </div>
            </li>
            <!--edit training add/remove question/content actions-->
            <!--edit training info-->
            <!--edit training options(boolean flags)-->
        </ul>
    </div>
</template>
<script lang="ts" src="./training_panel_component.ts"></script>
<style lang="scss" scoped>
    .training-panel {
        top: $user-bar-height;
        background-color: white;

        button.button.panel-close {
            margin-bottom: 0;
        }
    }

</style>