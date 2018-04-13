<template>
    <div>
        <loading v-show="loading"></loading>
        <training-header v-if="training"></training-header>
    </div>
</template>
<script src="./training_component.ts" lang="ts"></script>
