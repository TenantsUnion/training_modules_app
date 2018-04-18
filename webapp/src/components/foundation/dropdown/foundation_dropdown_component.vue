<template>
    <div class="dropdown-pane" :id="dropdownId" ref="dropdownContent" data-dropdown>
        <slot/>
    </div>
</template>
<script lang="ts" src="./foundation_dropdown_component.ts"></script>