<template lang="pug">
  b-field.table-filter(grouped)
    //- b-field.sort-fields
    //-   p.control
    //-     button.button
    //-       b-icon(icon="sort-amount-down" pack="fas")
    //-   p.control
    //-     button.button
    //-       b-icon(icon="sort-amount-up" pack="fas")
    //-   b-select(placeholder="By Field")
    //-     option(value="email") By Email
    //-     option(value="name") By Name
    //-     option(value="id") By ID
    b-field.search-field(expanded)
      b-select(v-if="f_list.length > 0" placeholder="Filter" :value="filter_set" @input="change_filter")
        option(v-for="(opt, ind) in f_list" :key="ind") {{ opt.title }}
      p.control.has-icons-right.is-expanded
        input.input(type="search" placeholder="Search" :value="s_txt" @input="change_s_txt")
        span.icon.is-right
          i.fas.fa-search
    b-field.grp_btns
      p.control(v-if="is_remove_btn")
        button.button.is-small(@click.prevent="$emit('remove_call', true)") Delete Notification
      template(v-if="is_read_unread_btns")
        p.control
          button.button.is-small(@click.prevent="$emit('read_call', true)") Read
        p.control
          button.button.is-small(@click.prevent="$emit('read_call', false)") Un-Read
      p.control
        b-dropdown(hoverable v-model="act_render_view" @change="change_act_view($event)")
          button.button.is-small(slot="trigger") View
          template(v-for="(item, key, ind) in act_v_data")
            b-dropdown-item(:value="key") {{ item }}
            hr.dropdown-divider(v-if="ind < (Object.keys(act_v_data).length-1)")
              
</template>

<script>
export default {
  props: {
    s_txt: {
      default: "",
      type: String
    },
    act_view: {
      default: "10",
      type: String
    },
    filter_set: {
      type: String,
      default: ""
    },
    f_list: {
      type: Array,
      default: () => []
    },
    is_remove_btn: {
      type: Boolean,
      default: false
    },
    is_read_unread_btns: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    act_view: function(val) {
      this.act_render_view = val;
    }
  },
  data() {
    return {
      act_v_data: {
        10: "Show 10 Results",
        20: "Show 20 Results",
        50: "Show 50 Results",
        100: "Show 100 Results"
      },
      act_render_view: '10'
    };
  },
  methods: {
    change_act_view: function(key) {
      this.$emit("change_act_view", key);
    },
    change_s_txt: function(event) {
      this.$emit("change_s_txt", event.target.value);
    },
    change_filter: function(event) {
      this.$emit("change_filter", event);
    }
  }
};
</script>

