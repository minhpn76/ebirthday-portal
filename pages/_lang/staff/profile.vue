<template>
  <b-card>
    <h5>
      <u>{{ $t('profile.your_detail') }}</u>
    </h5>
    <div class="info_staff mt-3">
      <span
        >{{ $t('profile.staff_id') }}
        {{
          dataStaff.staffDetail.staffId ? dataStaff.staffDetail.staffId : ''
        }}</span
      ><br />
      <span
        >{{ $t('profile.name') }}
        {{ dataStaff.staffDetail.name ? dataStaff.staffDetail.name : '' }}</span
      ><br />
      <span
        >{{ $t('profile.dob') }}
        {{
          dataStaff.staffDetail.dateOfBirth
            ? dataStaff.staffDetail.dateOfBirth
            : ''
        }}</span
      ><br />
      <span
        >{{ $t('profile.mobile_number') }}
        {{
          dataStaff.staffDetail.mobileNumber
            ? dataStaff.staffDetail.mobileNumber
            : ''
        }}</span
      ><br />
    </div>
    <b-tabs
      active-nav-item-class="bg-primary text-white"
      content-class="mt-3 mb-3"
      justified
      is-margin-bottom
    >
      <b-tab title="Active" active>
        <p v-if="!dataStaff.voucherActive">
          {{ $t('staff.isNothingVoucher') }}
        </p>
        <b-carousel
          v-if="dataStaff.voucherActive"
          id="carousel-1"
          v-model="slide"
          :interval="4000"
          :controls="false"
          indicators
          background="#fff"
          label-prev
          label-next
          @sliding-start="onSlideStart"
          @sliding-end="onSlideEnd"
        >
          <!-- Text slides with image -->
          <b-carousel-slide
            v-for="(voucherActive, index) in dataStaff.voucherActive"
            :key="index"
            img-blank
          >
            <div class="qr-code">
              <qrcode-vue
                :value="
                  jsonQr(dataStaff.staffDetail.staffId, voucherActive.voucherID)
                "
                :size="size"
                class-name="text-center"
              ></qrcode-vue>
            </div>
            <div class="detail-tab-staff">
              <!--              <span class="pt-3 pb-3">-->
              <!--                {{-->
              <!--                  voucherActive.voucherName ? voucherActive.voucherName : ''-->
              <!--                }}</span-->
              <!--              >-->
              <span
                >{{ $t('profile.voucher_id') }}
                {{
                  voucherActive.voucherID ? voucherActive.voucherID : ''
                }}</span
              >
              <span
                >{{ $t('profile.expiry_date') }}
                {{
                  voucherActive.expiryDate ? voucherActive.expiryDate : ''
                }}</span
              >
              <span class="pt-3">{{ $t('profile.terms') }}</span>
              <div
                class="text-left pl-3 decimal-list"
                v-html="replaceText(voucherActive.description)"
              ></div>
            </div>
            <b-button
              :ref="'btn-qrcode-' + voucherActive.voucherID"
              variant="outline-info"
              @click="passVoucherID(voucherActive.voucherID)"
              >Redeem</b-button
            >
            <b-modal
              :id="'zoom-qrcode-' + voucherActive.voucherID"
              :ref="'zoom-qrcode-' + voucherActive.voucherID"
              centered
              hide-header
              hide-footer
            >
              <i
                class="fa fa-2x fa-close float-right bt-close text-center"
                @click="closeModal(voucherActive.voucherID)"
              ></i>
              <qrcode-vue
                :value="jsonQr(dataStaff.staffDetail.staffId, voucherID)"
                class-name="text-center auto-canvas"
              ></qrcode-vue>
            </b-modal>
          </b-carousel-slide>
        </b-carousel>
      </b-tab>
      <b-tab title="Redeemed">
        <p v-if="!dataStaff.voucherRedeemed">
          {{ $t('staff.isNothingVoucher') }}
        </p>
        <b-carousel
          v-if="dataStaff.voucherRedeemed"
          id="carousel-1"
          v-model="slide"
          :interval="4000"
          :controls="false"
          indicators
          background="#fff"
          label-prev
          label-next
          @sliding-start="onSlideStart"
          @sliding-end="onSlideEnd"
        >
          <!-- Text slides with image -->
          <b-carousel-slide
            v-for="(voucherRedeemed, index) in dataStaff.voucherRedeemed"
            :key="index"
            img-blank
          >
            <div>
              <qrcode-vue
                :value="
                  jsonQr(
                    dataStaff.staffDetail.staffId,
                    voucherRedeemed.voucherID
                  )
                "
                :size="size"
                class-name="text-center"
              ></qrcode-vue>
            </div>
            <div class="detail-tab-staff">
              <!--              <span class="pt-3 pb-3">-->
              <!--                {{-->
              <!--                  voucherRedeemed.voucherName ? voucherRedeemed.voucherName : ''-->
              <!--                }}</span-->
              <!--              >-->
              <span
                >{{ $t('profile.voucher_id') }}
                {{
                  voucherRedeemed.voucherID ? voucherRedeemed.voucherID : ''
                }}</span
              >
              <span
                >{{ $t('profile.expiry_date') }}
                {{
                  voucherRedeemed.expiryDate ? voucherRedeemed.expiryDate : ''
                }}</span
              >
              <span class="pt-3">{{ $t('profile.terms') }}</span>
              <div
                class="text-left pl-3 decimal-list"
                v-html="replaceText(voucherRedeemed.description)"
              ></div>
            </div>
            <!-- <b-button
              v-b-modal.zoom-qrcode
              variant="outline-info"
              @click="passVoucherID(voucherRedeemed.voucherID)"
              >Redeemed</b-button
            > -->
            <!-- <b-modal id="zoom-qrcode" centered hide-header hide-footer>
              <i
                class="fa fa-2x fa-close float-right bt-close text-center"
                @click="$bvModal.hide('zoom-qrcode')"
              ></i>
              <qrcode-vue
                :value="voucherID"
                class-name="text-center auto-canvas"
              ></qrcode-vue>
            </b-modal> -->
          </b-carousel-slide>
        </b-carousel>
      </b-tab>
      <b-tab title="Expired">
        <p v-if="!dataStaff.voucherExpired">
          {{ $t('staff.isNothingVoucher') }}
        </p>
        <b-carousel
          v-if="dataStaff.voucherExpired"
          id="carousel-1"
          v-model="slide"
          :interval="4000"
          :controls="false"
          indicators
          background="#fff"
          label-prev
          label-next
          @sliding-start="onSlideStart"
          @sliding-end="onSlideEnd"
        >
          <!-- Text slides with image -->
          <b-carousel-slide
            v-for="(voucherExpired, index) in dataStaff.voucherExpired"
            :key="index"
            img-blank
          >
            <div>
              <qrcode-vue
                :value="
                  jsonQr(
                    dataStaff.staffDetail.staffId,
                    voucherExpired.voucherID
                  )
                "
                :size="size"
                class-name="text-center"
              ></qrcode-vue>
            </div>
            <div class="detail-tab-staff">
              <!--              <span class="pt-3 pb-3">-->
              <!--                {{-->
              <!--                  voucherExpired.voucherName ? voucherExpired.voucherName : ''-->
              <!--                }}</span-->
              <!--              >-->
              <span
                >{{ $t('profile.voucher_id') }}
                {{
                  voucherExpired.voucherID ? voucherExpired.voucherID : ''
                }}</span
              >
              <span
                >{{ $t('profile.expiry_date') }}
                {{
                  voucherExpired.expiryDate ? voucherExpired.expiryDate : ''
                }}</span
              >
              <span class="pt-3">{{ $t('profile.terms') }}</span>
              <div
                class="text-left pl-3 decimal-list"
                v-html="replaceText(voucherExpired.description)"
              ></div>
            </div>
            <!-- <b-button
              v-b-modal.zoom-qrcode
              variant="outline-info"
              @click="passVoucherID(voucherExpired.voucherID)"
              >Redeemed</b-button
            >
            <b-modal id="zoom-qrcode" centered hide-header hide-footer>
              <i
                class="fa fa-2x fa-close float-right bt-close text-center"
                @click="$bvModal.hide('zoom-qrcode')"
              ></i>
              <qrcode-vue
                :value="voucherID"
                class-name="text-center auto-canvas"
              ></qrcode-vue>
            </b-modal> -->
          </b-carousel-slide>
        </b-carousel>
      </b-tab>
    </b-tabs>
  </b-card>
</template>
<script>
import QrcodeVue from 'qrcode.vue'
import { mapGetters } from 'vuex'
export default {
  layout: 'staff',
  name: 'Profile',
  components: {
    QrcodeVue
  },
  data() {
    return {
      size: 200,
      voucherID: '',
      slide: 0,
      sliding: null
    }
  },
  computed: mapGetters({
    dataStaff: 'staff/staffdetail'
  }),
  methods: {
    passVoucherID(voucher) {
      this.voucherID = voucher
      this.$root.$emit(
        'bv::show::modal',
        'zoom-qrcode-' + voucher,
        '#btn-qrcode-' + voucher
      )
      // this.$refs['zoom-qrcode-' + voucher].hide()
    },
    onSlideStart(slide) {
      this.sliding = true
    },
    onSlideEnd(slide) {
      this.sliding = false
    },
    closeModal(voucher) {
      this.$root.$emit(
        'bv::hide::modal',
        'zoom-qrcode-' + voucher,
        '#btn-qrcode-' + voucher
      )
    },
    jsonQr(staffid = '', voucherid = '') {
      const obQr = {
        staffid: staffid,
        voucherid: voucherid
      }
      return JSON.stringify(obQr)
    }
  }
}
</script>
