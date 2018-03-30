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
        sortField?: string;
        direction?: 'desc' | 'asc'
    }

    interface VuetableConfig {
        /**
         * Points to array of data defaults to 'data'
         */
        dataPath?: string;

        /**
         * Points to pagination information defaults to 'links.pagination'
         */
        paginationPath?: string;


        httpFetch?: HttpFetchFn;

        css: CssConfig
    }


    export interface CssConfig {
          tableClass: string,
          loadingClass: string,
          ascendingIcon: string,
          descendingIcon: string,
          ascendingClass: string,
          descendingClass: string,
          sortableIcon: string,
          detailRowClass: string,
          handleIcon: string,
          tableBodyClass: string,
          tableHeaderClass: string
    }

    type HttpFetchFn = (apiUrl: string, httpOptions: HttpOptions) => Promise<{ data: any[] }>;

    type HttpOptions = {
        params: {
           [index: string]: any
        }
    };

    type TransformFn<A, B = DataFormat> = (input: A) => B
}