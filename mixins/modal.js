export default {
    props: {
        md_act: {
            type: Boolean,
            default: false
        },
    },
    mounted() {
        if(this.md_act !== this.modalAct) {
            this.modalAct = this.md_act;
        }
    },
    watch: {
        md_act: function (val) {
            if (val !== this.modalAct) {
                this.modalAct = val;
            }
        },
        modalAct: function (val) {
            if (val === true) {
                this.loadData();
            }
            if (val !== this.md_act) {
                this.$emit("closed", val);
            }
        }
    },
    data() {
        return {
            modalAct: false,
        }
    },
    methods: {
        loadData: function () {
            
        }
    }
}