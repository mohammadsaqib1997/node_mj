import _ from "lodash";

export default {
    async mounted() {
        await this.loadData()
    },
    computed: {
        filter_val: function () {
            return _.find(this.tbl_list_filters, {
                value: this.load_params.filter
            }).title;
        }
    },
    data() {
        return {
            loading: false,
            l_data: [],
            num_rows: 1,
            load_params: {
                limit: "10",
                search: "",
                page: 1,
                filter: ''
            },
            tbl_list_filters: []
        }
    },
    methods: {
        resetParams() {
            this.load_params = {
                limit: "10",
                search: "",
                page: 1,
                filter: ''
            }
        },
        change_filter_tr: function (val) {
            this.update_params("filter", _.find(this.tbl_list_filters, {
                title: val
            }).value);
        },
        async update_params(param, val) {
            const self = this;
            let new_params = _.cloneDeep(self.load_params)
            if (new_params[param] !== val) {
                if (param !== 'page') {
                    new_params['page'] = 1
                }
                new_params[param] = val
                self.load_params = new_params
                self.loading = true
                self.after_f_settle(async function () {
                    self.loadData()
                    self.loading = false
                })

            }
        },
        after_f_settle: _.debounce(function (cb) {
            cb()
        }, 1000),
    }
}