<template>
    <div class="grid-container fluid">
        <loading v-show="loading"></loading>
        <div class="grid-x grid-margin-x align-middle align-left">
            <div class="cell grid-x">
                <div class="cell shrink">
                    <training-title/>
                </div>
            </div>
            <div class="cell grid-x">
                <div class="cell shrink">
                    <time-estimate :time-estimate="training.timeEstimate"></time-estimate>
                </div>
            </div>
            <div class="cell grid-x">
                <div class="cell shrink">
                    <training-description></training-description>
                </div>
            </div>
        </div>
    </div>
</template>
<script src="./training_component.ts" lang="ts"></script>
