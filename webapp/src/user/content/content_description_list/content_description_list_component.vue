<template>
    <div class="user-main">

        <div id="page-content-wrapper">
            <div class="main">
                <div class="grid-x">
                    <div class="small-12 cell">
                        <h4>Your Content
                            <button class="button primary"
                                    @click="createNewContent">
                                New
                            </button>
                        </h4>
                        <ul class="">
                            <li v-for="content in contentDescriptionList"
                                class="content-item">
                                <span>{{ content.title }}</span>
                                <button class="button primary"
                                        @click="edit(content)">Edit
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" src="./content_description_list_component.ts"></script>
