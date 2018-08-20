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
                    p.page-result-txt Showing {{ ((currentPg-1)*10)+1 }} - {{ ((currentPg)*10 > total_record) ? total_record:(currentPg)*10 }} of {{ total_record }} results
                .level-right
                    b-pagination(:total="total_record" :per-page="10" :current.sync="currentPg" @change="pageChange")
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
      default: 0
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

