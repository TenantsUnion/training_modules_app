<template>
    <div class="grid-container fluid">
        <loading v-show="loading"></loading>
        <div class="grid-x grid-margin-x align-middle align-left">
            <div class="cell large-shrink medium-8">
                <training-title/>
            </div>
            <div class="cell large-shrink large-offset-1 medium-8">
                <time-estimate :time-estimate="training.timeEstimate"></time-estimate>
            </div>
        </div>
        <div class="grid-x">
            <div class="cell shrink">
                <training-description></training-description>
            </div>
        </div>
    </div>
</template>
<script src="./training_component.ts" lang="ts"></script>
