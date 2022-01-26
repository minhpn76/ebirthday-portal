<template>
  <div>
    <b-card
      :class="['rounded-0 border-left-not-greeting card-accent-left-danger']"
    >
      <div class="d-flex align-items-center flex-flow-row">
        <h2 class="display-4 pr-2">{{ notPersonalised }}</h2>
        <div>{{ $t('textfield.greeting_not_personalised') }}</div>
      </div>
    </b-card>
    <b-card
      :class="['rounded-0 border-left-greeting card-accent-left-success']"
    >
      <div class="d-flex align-items-center flex-flow-row">
        <h2 class="display-4 pr-2">
          <nuxt-link
            class="remover-link"
            :to="{
              path: 'admin/resend-sms',
              query: { month: month }
            }"
            >{{ personalised }}</nuxt-link
          >
        </h2>
        <div>{{ $t('textfield.greeting_personalised') }}</div>
      </div>
    </b-card>
  </div>
</template>

<script>
export default {
  props: {
    // items: {
    //   type: Object,
    //   default: function() {
    //     return {
    //       greeting_not_personalised: 0,
    //       greeting_personalised: 0,
    //       total: 0
    //     }
    //   }
    // }

    notPersonalised: {
      type: Number,
      default: function() {
        return 0
      }
    },
    personalised: {
      type: Number,
      default: function() {
        return 0
      }
    },
    month: {
      type: Number,
      default: () => {
        return 0
      }
    }
  }
}
</script>
