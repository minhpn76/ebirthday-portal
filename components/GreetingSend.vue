<template>
  <div class="et-column-greeting">
    <div class="gr-sent">
      <span>
        {{ $t('messages.greeting_sent') }}
      </span>
    </div>
    <div class="gr-not-sent">
      <span>
        {{ $t('messages.greeting_not_sent') }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GreetingSend'
}
</script>

<style scoped></style>
