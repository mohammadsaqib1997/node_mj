<template lang="pug">
    .table-des-1
        template(v-if="arr.length > 0")
            table.table.is-fullwidth.is-bordered(:class="{'is-striped': striped}")
                thead
                    slot(name="thead")
                tbody
                    slot(name="tbody")
            .level(v-if="paginate")
                .level-left
                    p.page-result-txt Showing {{ ((currentPg-1)*per_page)+1 }} - {{ ((currentPg)*per_page > total_record) ? total_record:(currentPg)*per_page }} of {{ total_record }} results
                .level-right
                    b-pagination(:total="total_record" :per-page="per_page" :current.sync="currentPg" @change="pageChange")
        section.section.em-sec(v-else)
            .content.has-text-grey.has-text-centered
                p
                    b-icon(icon="frown" pack="far" size="is-large")
                p Nothing here.
        b-loading(:is-full-page="false" :active="loading" :can-cancel="false")
</template>

<script>
export default {
  props: {
    total_record: {
      type: Number,
      default: 1
    },
    per_page: {
      type: Number,
      default: 10
    },
    striped: {
      type: Boolean,
      default: false
    },
    arr: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: true
    },
    paginate: {
      type: Boolean,
      default: true
    },
    page_set: {
      default: 1,
      type: Number
    }
  },
  watch: {
    page_set: function(val) {
      this.currentPg = val;
    }
  },
  data() {
    return {
      currentPg: 1
    };
  },
  methods: {
    pageChange: function(val) {
      this.$emit("page_change", val);
    }
  }
};
</script>

