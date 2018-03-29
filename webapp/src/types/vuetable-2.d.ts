declare module "vuetable-2" {

    interface PaginationDataFormat {
        total: number,
        per_page: number,
        current_page: number,
        last_page: number,
        next_page_url: string,
        prev_page_url: string,
        from: number,
        to: number
    }

    interface DataFormat {
        links: {
            pagination: PaginationDataFormat
        }
        data: object[]
    }

    interface Field<N extends String = string> {
        /**
         * The name of the property on the row data object
         */
        name: N;
        title?: string;
    }

    interface VuetableConfig {
        /**
         * Points to array of data defaults to 'data'
         */
        dataPath: string;

        /**
         * Points to pagination information defaults to 'links.pagination'
         */
        paginationPath: string;
    }
}