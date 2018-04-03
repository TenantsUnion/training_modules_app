<template>
    <div>
        <search-table :fetch-data="fetchTableData" :fields="fields"
                      :search-fields="searchFields" :sort-order="sortOrder"
                      :transform="transform"></search-table>
    </div>
</template>
<script lang="ts" src="./course_enrolled_table_component.ts"></script>
