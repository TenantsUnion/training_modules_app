<template>
    <div>
        <div id="training-container">
            <div>
                <h2>{{training.title}}</h2>
                <p>{{training.description}}</p>
                <time-estimate v-if="training.timeEstimate !== 0" :time-estimate="training.timeEstimate"/>
            </div>
        </div>
        <training-panel content-id="training-container"></training-panel>
    </div>
</template>
<script src="./training_component.ts" lang="ts"></script>
