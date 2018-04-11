<template>
    <div>
        <div>
            <div class="grid-x align-left">
                <span class="button hollow secondary" v-on:click="open"><i class="fa fa-bars fa-fw"/></span>
            </div>
        </div>
        <div class="off-canvas training-panel">
            <div class="grid-x align-left">
                <span class="button hollow secondary" v-on:click="close"><i class="fa fa-bars fa-fw"/></span>
            </div>
            <p>Hello from training panel component</p>
            <!-- Menu -->
            <ul class="vertical menu">
                <li><a href="#">Foundation</a></li>
                <li><a href="#">Dot</a></li>
                <li><a href="#">ZURB</a></li>
                <li><a href="#">Com</a></li>
                <li><a href="#">Slash</a></li>
                <li><a href="#">Sites</a></li>
            </ul>
        </div>
    </div>
</template>
<script lang="ts" src="./training_panel_component.ts"></script>
<style lang="scss" scoped>
    .training-panel {
        border: dashed #0a0a0a;
    }
</style>