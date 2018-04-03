<template>
    <div>
        <div class="grid-x">
            <div v-for="(searchField) in searchFields" class="cell small-12 medium-6 large-3">
                <search-field :search-field="searchField" :trigger-search="triggerSearch"
                              ref="searchFields"></search-field>
            </div>
        </div>
        <div>
            <vuetable ref="vuetable" :multi-sort="true" multi-sort-key="ctrl"
                      :sort-order="sortOrder"
                      :fields="fields" api-url="" :http-fetch="fetchHttp" :css="cssConfig"></vuetable>
        </div>
    </div>
</template>
<script src="./search_table_component.ts" lang="ts"></script>