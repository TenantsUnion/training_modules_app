<template>
    <div class="grid-x grid-padding-x align-left align-middle">
        <div class="cell shrink">
            <div class="grid-x grid-padding-x align-middle align-justify">
                <div class="cell auto">
                    <h2>{{training.title}}</h2>
                </div>
                <div class="cell small-12 medium-shrink">
                    <time-estimate :time-estimate="training.timeEstimate"/>
                </div>
            </div>
            <div class="grid-x">
                <div class="cell small-12">
                    <p v-if="training.description">{{training.description}}</p>
                    <p class="subheader" v-if="!training.description">No description</p>
                </div>
            </div>
        </div>
        <div class="cell shrink">
            <button class="button" type="button"></button>
        </div>
    </div>
</template>
<script lang="ts" src="./training_header_component.ts"></script>
