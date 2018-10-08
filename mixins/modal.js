export default {
    props: {
        md_act: {
            type: Boolean,
            default: false
        },
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