<template>
  <div class="app flex-row align-items-center">
    <b-container>
      <b-row class="justify-content-center">
        <b-col md="6">
          <div class="clearfix">
            <h1 class="float-left display-3 mr-4">404</h1>
            <h4 class="pt-3">You're lost.</h4>
            <p class="text-muted">
              The page you are looking for was not found.
            </p>
          </div>
          <div class="input-prepend input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-search"></i>
              </span>
            </div>
            <b-form-input
              size="16"
              placeholder="What are you looking for?"
            ></b-form-input>
            <span class="input-group-append">
              <button class="btn btn-info" type="button">Search</button>
            </span>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
export default {
  props: {
    message: {
      type: String,
      default: ''
    }
  },
  layout: 'errors'
}
</script>
