<template>
  <div class="animated fadeIn mr-bottom-cs1">
    <b-row>
      <b-col md="12">
        <b-form @submit="searchStaff">
          <table class="table table-borderless">
            <tbody class="border-0">
              <tr>
                <td width="20%">
                  <b>{{ $t('dashboard.staff.staffid_require') }}</b>
                  <b class="text-red">*</b>:
                </td>
                <td>
                  <b-form-input
                    ref="staff_id_input"
                    v-model="id"
                    v-validate="'required'"
                    placeholder="Enter Staff ID"
                    name="staffID"
                  ></b-form-input>
                  <span v-if="vErrors.has('staffID')" class="text-red">{{
                    $t('redemption.error.staffID')
                  }}</span>
                </td>
              </tr>
              <tr>
                <td width="20%">
                  <b>{{ $t('dashboard.staff.voucher_number_require') }}</b>
                  <b class="text-red">*</b>:
                </td>
                <td>
                  <b-form-input
                    v-model="number"
                    v-validate="'required'"
                    placeholder="Enter Voucher Number"
                    name="voucherID"
                  ></b-form-input>
                  <span v-if="vErrors.has('voucherID')" class="text-red">{{
                    $t('redemption.error.voucherNumber')
                  }}</span>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <b-button type="submit" variant="primary"
                    >{{ $t('dashboard.search') }}
                  </b-button>
                  <b-button type="button" variant="secondary" @click="reset"
                    >{{ $t('dashboard.clear') }}
                  </b-button>
                </td>
              </tr>
            </tbody>
          </table>
        </b-form>
      </b-col>
    </b-row>
    <hr />
    <b-row v-if="loading === true">
      <b-col class="text-center isLoading">
        <b-spinner class="align-middle"></b-spinner>
        <strong>Loading...</strong>
      </b-col>
    </b-row>
    <b-row v-if="show && loading === false">
      <b-col md="12" class="">
        <h4 v-if="staffPortal.staffDetail">
          <u>{{ $t('dashboard.staff.staffdetail') }}</u>
        </h4>
        <template v-if="staffPortal.staffDetail">
          <table class="table table-borderless table-custom">
            <thead>
              <tr>
                <th>{{ $t('roles.userId') }}</th>
                <th>{{ $t('dashboard.staff.name') }}</th>
                <th>{{ $t('profile.dob') }}</th>
                <th>{{ $t('profile.mobile_number') }}</th>
              </tr>
            </thead>
            <tbody>
              <td>
                {{
                  staffPortal.staffDetail.staffId
                    ? staffPortal.staffDetail.staffId
                    : ''
                }}
              </td>
              <td>
                {{
                  staffPortal.staffDetail.name
                    ? staffPortal.staffDetail.name
                    : ''
                }}
              </td>
              <td>
                {{
                  staffPortal.staffDetail.dateOfBirth
                    ? staffPortal.staffDetail.dateOfBirth
                    : ''
                }}
              </td>
              <td>
                {{
                  staffPortal.staffDetail.mobileNumber
                    ? staffPortal.staffDetail.mobileNumber
                    : ''
                }}
              </td>
            </tbody>
          </table>
        </template>
        <template v-if="!staffPortal.voucherDetail && !staffPortal.staffDetail">
          <h5>{{ $t('redemption.notification.not_found_staff') }}</h5>
        </template>
        <h4 v-if="staffPortal.voucherDetail">
          <u>{{ $t('dashboard.staff.voucher_detail') }}</u>
        </h4>
        <template v-if="staffPortal.voucherDetail">
          <table class="table table-borderless table-custom">
            <thead>
              <tr>
                <th>{{ this.$t('table.fields.voucher') }}</th>
                <th>{{ this.$t('table.fields.voucher_id') }}</th>
                <th>{{ this.$t('table.fields.expriy_date') }}</th>
                <th>{{ this.$t('table.fields.voucher_status') }}</th>
                <th>{{ this.$t('table.fields.description') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in staffPortal.voucherDetail"
                :key="index"
              >
                <td>{{ item.voucherName }}</td>
                <td>{{ item.voucherID }}</td>
                <td>
                  {{ item.expiryDate }}
                </td>
                <td>
                  {{ item.voucherStatus }}
                </td>
                <td>
                  <span>{{ $t('dashboard.term') }}</span>
                  <div class="pl-3">
                    <span v-html="replaceText(item.description)"></span>
                  </div>
                </td>
                <td>
                  <b-button
                    v-if="
                      item.statusRedeem &&
                        (dataRole.customsignuploc === true ||
                          dataRole.frontStaff === true ||
                          dataRole.outletName === true ||
                          dataRole.reporting_Manager === true ||
                          dataRole.staff_Member === true)
                    "
                    @click="getItemVoucherSelected(item)"
                    >{{ $t('dashboard.redeem') }}
                  </b-button>
                  <b-button
                    v-if="item.statusExtendVoucher"
                    v-b-modal.modal-extend-voucher
                    @click="voucherExtendSelected(item)"
                    >{{ $t('dashboard.extend_voucher') }}
                  </b-button>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </b-col>
      <b-modal
        id="modal-extend-voucher"
        ref="modal_extend_voucher"
        size="lg"
        title="Extend Voucher"
        ok-title="Save"
        no-close-on-backdrop
        no-close-on-esc
        no-enforce-focus
        @ok="handleOk"
      >
        <div>
          <form ref="form" @submit.stop.prevent="handleSubmit">
            <b-form-group
              label="Please enter the reason for extension"
              label-for="reason"
            >
              <b-form-textarea
                id="reason"
                v-model="extendVoucher.reason"
                rows="3"
                max-rows="6"
              ></b-form-textarea>
            </b-form-group>
            <b-form-group
              v-if="extendVoucher.voucherExpiryDate"
              label="New Expiry Date"
              label-for="expire_date"
            >
              <date-picker
                is-required
                :input="selectedDate"
                :value="
                  new Date(
                    $nuxt
                      .$moment(extendVoucher.voucherExpiryDate)
                      .add(1, 'months')
                      .format()
                  )
                "
                :min-date="
                  new Date(
                    $nuxt
                      .$moment(extendVoucher.voucherExpiryDate)
                      .add(1, 'days')
                      .format()
                  )
                "
              />
            </b-form-group>
          </form>
        </div>
      </b-modal>
    </b-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { clone, trim, attempt, isUndefined } from 'lodash'
import datePicker from '~/components/Date/DatePicker'

export default {
  layout: 'redemption',
  components: {
    datePicker
  },
  data() {
    return {
      formData: {
        staffID: '',
        voucherNumber: ''
      },
      id: '',
      number: '',
      itemVoucher: {},
      extendVoucher: {
        name: '',
        date: ''
      },
      show: false,
      loading: false
    }
  },
  computed: mapGetters({
    staffPortal: 'redemption/getVoucherStaff',
    postReedem: 'redemption/postVoucherRedemption',
    dataRole: 'ROLE_AUTH'
  }),
  watch: {
    id: function(val) {
      this.formData.staffID = val
      if (this.isJson(val)) {
        const QrScan = this.parseLodash(trim(val))
        if (!isUndefined(QrScan.staffid) && !isUndefined(QrScan.voucherid)) {
          this.formData.staffID = QrScan.staffid
          this.formData.voucherNumber = QrScan.voucherid
        }
      }
      return val
    },
    number: function(val) {
      this.formData.voucherNumber = val
      if (this.isJson(val)) {
        const QrScan = this.parseLodash(trim(val))
        if (!isUndefined(QrScan.staffid) && !isUndefined(QrScan.voucherid)) {
          this.formData.staffID = QrScan.staffid
          this.formData.voucherNumber = QrScan.voucherid
        }
      }
      return val
    },
    formData: {
      handler: function(val) {
        if (val.staffID) {
          this.id = val.staffID
        }
        if (val.voucherNumber) {
          this.number = val.voucherNumber
        }
        return val
      },
      deep: true
    }
  },
  mounted() {
    this.$refs.staff_id_input.focus()
  },
  methods: {
    isJson(str = '') {
      return /^[\],:{}\s]*$/.test(
        str
          .replace(/\\["\\\\/bfnrtu]/g, '@')
          .replace(
            /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\\-]?\d+)?/g,
            ']'
          )
          .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
      )
    },
    parseLodash(str) {
      return attempt(JSON.parse.bind(null, str))
    },
    reset(evt) {
      evt.preventDefault()
      this.formData.staffID = ''
      this.formData.voucherNumber = ''
      this.id = ''
      this.number = ''
      this.show = false
      this.$store.dispatch('redemption/resetVoucherStaff')
      this.$validator.reset()
    },
    resetModal() {},
    handleSubmit() {},
    searchStaff(evt) {
      evt.preventDefault()
      this.$validator.validate().then(valid => {
        if (valid) {
          this.getVoucherStaff()
          this.$nextTick(() => {
            this.show = true
          })
        }
      })
    },
    getVoucherStaff() {
      this.loading = true
      this.$store
        .dispatch('redemption/getVoucherStaff', {
          params: this.formData
        })
        .then(() => {
          this.loading = false
        })
    },
    getItemVoucherSelected(remdemption) {
      this.$swal
        .fire({
          title: this.$t('dashboard.modal.confirm'),
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: this.$t('dashboard.modal.ok')
        })
        .then(result => {
          if (result.value) {
            this.itemVoucher = {
              voucherName: remdemption.voucherName,
              voucherID: remdemption.voucherID,
              voucherExpiryDate: remdemption.voucherExpiryDate,
              validFrom: remdemption.validFrom,
              validTo: remdemption.validTo
            }

            const stateVoucherStaff = this.staffPortal
            const payload = {
              cardNo: stateVoucherStaff.staffDetail.cardNo,
              staffId: stateVoucherStaff.staffDetail.staffId,
              name: stateVoucherStaff.staffDetail.name,
              ...this.itemVoucher
            }

            this.$store
              .dispatch('redemption/postVoucherRedemption', payload)
              .then(() => {
                this.getVoucherStaff()
              })
          }
        })
    },
    voucherExtendSelected(voucherInfo) {
      this.extendVoucher = clone(voucherInfo)
    },
    selectedDate(date) {
      this.extendVoucher.expiryDate = date
    },
    async handleOk(event) {
      event.preventDefault()
      if (this.extendVoucher.expiryDate !== 'Invalid date') {
        await this.$store.dispatch(
          'redemption/extendVoucher',
          this.extendVoucher
        )
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.modal_extend_voucher.hide()
            this.searchStaff(event)
          }, 2000)
        })
      } else this.$toast.error(`Expiry date is required`)
    }
  }
}
</script>
