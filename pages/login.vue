<template>
  <div class="p-3">
    <div class="screen-login text-center">
      <img src="/img/logo.png" alt="" />
    </div>
    <b-form @submit="onSubmit">
      <b-form-group label="Email:" label-for="email">
        <b-form-input
          id="email"
          v-model="formData.email"
          v-validate="'required|max:250'"
          type="email"
          name="email"
          placeholder="Enter Email"
        >
        </b-form-input>
        <small class="form-text text-danger">{{
          vErrors.first('email')
        }}</small>
      </b-form-group>
      <b-form-group label="Password:" label-for="password">
        <b-form-input
          id="password"
          v-model="formData.password"
          v-validate="'required'"
          type="password"
          placeholder="Enter Password"
          name="password"
        >
        </b-form-input>
        <small class="form-text text-danger">{{
          vErrors.first('password')
        }}</small>
      </b-form-group>
      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
  </div>
</template>
<script>
export default {
  name: 'Login',
  layout: 'login',
  data() {
    return {
      formData: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault()
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.$router.push('selectportal')
        }
      })
    }
  }
}
</script>
