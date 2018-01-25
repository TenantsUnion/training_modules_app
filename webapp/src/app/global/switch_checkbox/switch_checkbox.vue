<template>
    <div class="grid-x grid-padding-x">
        <div class="cell small-3 switch success tiny">
            <input class="switch-input" :id="id" type="checkbox" name="checkboxSwitch" ref="checkbox"
                   v-model="vmChecked"/>
            <label class="switch-paddle" :for="id">
                <span class="show-for-sr">{{switchText}}</span>
            </label>
        </div>
        <div class="small-9">
            <p class="text-center">
                {{switchText}}
            </p>
        </div>
    </div>
</template>

<script lang="ts" src="./switch_checkbox.ts"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import '../../scss/variables';

    @mixin colored-switches($checked-color) {
        input:checked ~ .switch-paddle {
            background: $checked-color;
        }
    }

    .switch {
        &.primary {
            @include colored-switches(map-get($foundation-palette, primary))
        }

        &.secondary {
            @include colored-switches(map-get($foundation-palette, secondary))
        }

        &.success {
            @include colored-switches(map-get($foundation-palette, success))
        }

        &.alert {
            @include colored-switches(map-get($foundation-palette, alert))
        }

        &.warning {
            @include colored-switches(map-get($foundation-palette, warning))
        }
    }
</style>
