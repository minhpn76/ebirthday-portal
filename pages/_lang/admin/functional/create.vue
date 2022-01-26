<template>
  <div class="animated fadeIn mr-bottom-cs1">
    <b-row>
      <b-col>
        <h1>{{ $t('menu.create_functional_id') }}</h1>
      </b-col>
      <b-col md="12" class="mb-3">
        <hr />
        <b-form @submit="searchStaff">
          <table class="table table-borderless">
            <tbody class="border-0">
              <tr>
                <td width="20%">
                  <b>{{ $t('roles.create_name') }}</b>
                  <b class="text-red">*</b>:
                </td>
                <td>
                  <b-form-input
                    v-model="formSearch.name"
                    v-validate="'required'"
                    placeholder="Enter Name"
                    name="name"
                  ></b-form-input>
                  <span class="text-red">{{ vErrors.first('name') }}</span>
                </td>
              </tr>
              <tr>
                <td width="20%">
                  <b>{{ $t('roles.create_email') }}</b>
                  <b class="text-red">*</b>:
                </td>
                <td>
                  <b-form-input
                    v-model="formSearch.email"
                    v-validate="'required|email'"
                    placeholder="Enter Email"
                    name="Email"
                  ></b-form-input>
                  <span class="text-red">{{ vErrors.first('Email') }}</span>
                </td>
              </tr>
              <tr>
                <td width="20%">
                  <b>{{ $t('roles.outlets') }}:</b>
                </td>
                <td>
                  <v-select
                    v-model="outLetSelected"
                    class="mr-1 md-12"
                    style="width: 100%"
                    :options="dataOutLets"
                    placeholder="Select Outlets"
                    label="outletName"
                    @input="onChange()"
                  ></v-select>
                </td>
              </tr>
              <tr>
                <td width="20%"></td>
                <td>
                  <b-form-group>
                    <b-form-checkbox-group
                      id="checkbox-group-2"
                      v-model="selected"
                      name="flavour-2"
                      @change="updateStaff"
                    >
                      <b-form-checkbox value="finance">Finance</b-form-checkbox
                      ><br />
                      <b-form-checkbox value="frontStaff"
                        >F&B Outlets / Hotel</b-form-checkbox
                      ><br />
                    </b-form-checkbox-group>
                  </b-form-group>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <b-button type="submit" variant="primary">{{
                    $t('dashboard.save')
                  }}</b-button>
                </td>
              </tr>
            </tbody>
          </table>
        </b-form>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'
import vSelect from 'vue-select'
Vue.component('v-select', vSelect)

export default {
  layout: 'admin',
  name: 'CreateFunctinal',
  data() {
    return {
      formSearch: {
        name: '',
        email: '',
        finance: false,
        frontStaff: false,
        outletCode: '',
        outletName: ''
      },
      outLetSelected: '',
      loading: false,
      show: false,
      selected: []
    }
  },
  computed: mapGetters({
    createFunctionalId: 'admin/createFunctionalId',
    dataOutLets: 'admin/getOutLets'
  }),
  async fetch({ store }) {
    await store.dispatch('admin/getOutLets')
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()

      setTimeout(() => this.$nuxt.$loading.finish(), 1000)
    })
  },
  created() {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  },
  methods: {
    createUser(payload) {
      if (this.selected.length === 0) {
        return
      }
      this.$store
        .dispatch('admin/createFunctionalId', {
          payload: payload
        })
        .then(() => {
          setTimeout(() => {
            this.formSearch = {
              name: '',
              email: '',
              finance: false,
              frontStaff: false,
              outletCode: '',
              outletName: ''
            }
            this.outLetSelected = ''
            this.selected = []
            this.$validator.reset()
          }, 1000)
        })
    },
    searchStaff(evt) {
      evt.preventDefault()
      this.$validator.validate().then(valid => {
        if (valid) {
          this.createUser(this.formSearch)
          this.$nextTick(() => {
            this.show = true
          })
        }
      })
    },
    onChange() {
      if (this.outLetSelected) {
        this.formSearch.outletCode = this.outLetSelected.outletCode
        this.formSearch.outletName = this.outLetSelected.outletName
      } else {
        this.formSearch.outletCode = ''
        this.formSearch.outletName = ''
      }
    },
    updateStaff(listRoles) {
      if (listRoles.includes('frontStaff')) {
        this.formSearch.frontStaff = true
      }
      if (listRoles.includes('finance')) {
        this.formSearch.finance = true
      }
    }
  }
}
</script>
