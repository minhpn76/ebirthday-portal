import Vue from 'vue'
import { result as resultData, filter, replace } from 'lodash'
export default ({ app, $moment }, inject) => {
  inject('myInjectedTime', {
    currentMonth: function(format = 'MMMM') {
      return $moment().format(format)
    },
    getNextMonth(format = 'MMMM') {
      return $moment()
        .add(1, 'M')
        .format(format)
    }
  })
}

Vue.mixin({
  methods: {
    /**
     * precise range date
     *
     * @param since
     * @param format
     * @returns {string}
     */
    getDataFormatDuration(since, format = 'YYYY-MM-DD') {
      return this.$nuxt
        .$moment(since)
        .preciseDiff(this.$nuxt.$moment(new Date()).format(format))
    },
    /**
     * Get date by format
     * @param birthday
     * @param format
     * @returns {string}
     */
    getDateFormat(birthday, format = 'DD MMM') {
      return this.$nuxt.$moment(birthday).format(format)
    },
    /**
     * Number to Month
     * @param num
     * @returns {string}
     */
    getMonthFromNumber(num) {
      return this.$nuxt
        .$moment()
        .month(parseInt(num) - 1)
        .format('MMM')
    },

    /**
     * Get current month
     * @param format
     * @returns {string}
     */
    getCurrentMonth(format = 'MMMM') {
      return this.$nuxt.$moment().format(format)
    },
    getCurrentDateMonth(format = 'DD MMM') {
      return this.$nuxt.$moment().format(format)
    },
    getCurrentMonthFormatMM(format = 'MM') {
      return this.$nuxt.$moment().format(format)
    },

    /**
     * Get Next month
     * @param format
     * @returns {string}
     */
    getNextMonth(format = 'MMMM') {
      return this.$nuxt
        .$moment()
        .add(1, 'M')
        .format(format)
    },
    /* get current year */
    getYearCurrent(format = 'YYYY') {
      return this.$nuxt.$moment().format(format)
    },
    /**
     * Get Last month current year
     * @return {string} */
    getLastMonthAndYearPercent(format = 'MMMM YYYY') {
      return (
        this.$nuxt
          .$moment()
          .subtract(1, 'month')
          .startOf('month')
          .format(format) + ' (%)'
      )
    },
    /**
     * Get Last month current year
     * @return {string} */
    getBefore2MonthAndYearPercent(format = 'MMMM YYYY') {
      return (
        this.$nuxt
          .$moment()
          .subtract(2, 'month')
          .startOf('month')
          .format(format) + ' (%)'
      )
    },
    getCurrentMonthAndYearPercent(format = 'MMMM YYYY') {
      return this.$nuxt.$moment().format(format) + ' (%)'
    },
    getNextMonthAndYearPercent(format = 'MMMM YYYY') {
      return (
        this.$nuxt
          .$moment()
          .add('1', 'months')
          .format(format) + ' (%)'
      )
    },
    getDateFormatSince(since, format = 'DD MMMM YYYY') {
      return this.$nuxt.$moment(since).format(format)
    },
    getDataFormatSinceTime(since, format = 'DD MMMM YYYY H:mm:ss') {
      return this.$nuxt.$moment(since).format(format)
    },
    // get 3 month return a value
    getQuater(params) {
      if (['01', '02', '03'].includes(params)) {
        return 1
      } else if (['04', '05', '06'].includes(params)) {
        return 2
      } else if (['07', '08', '09'].includes(params)) {
        return 3
      } else if (['10', '11', '12'].includes(params)) {
        return 4
      }
    },
    getQuaterPage(totalCount, limit) {
      if (totalCount % limit === 0) {
        const totalPage = totalCount / limit
        return totalPage
      } else {
        const totalPage = parseInt(totalCount / limit) + 1
        return totalPage
      }
    },
    compareBirthdays(day) {
      return this.$nuxt.$moment(day).isAfter(new Date(), 'month|day')
    },

    /**
     * Current quarter
     * @returns {*}
     */
    getCurrentQuarter() {
      const moment = this.$nuxt.$moment
      return moment().quarter()
    },
    /**
     *
     */
    getDropdownQuarterSelected(quarter = null) {
      if (quarter === null) {
        quarter = this.getCurrentQuarter()
      }
      return resultData(filter(this.getDropdownQuarter(), ['code', quarter]))
    },
    /**
     * Dropdown quarter
     * @returns {*[]}
     */
    getDropdownQuarter() {
      return [
        {
          label: 'Jan to March',
          code: 1
        },
        {
          label: 'April to June',
          code: 2
        },
        {
          label: 'July to Sept',
          code: 3
        },
        {
          label: 'Oct to Dec',
          code: 4
        }
      ]
    },
    /**
     * getLastMonthOfQuarter
     * @param quarter
     * @returns {string}
     */
    getTextLastMonthOfQuarter(quarter) {
      switch (quarter) {
        case 1:
          return 'March'
        case 2:
          return 'June'
        case 3:
          return 'September'
        case 4:
          return 'December'
        default:
          break
      }
    },
    /**
     * getBefore1MonthOfQuarter
     * @param quarter
     * @returns {string}
     */
    getTextBefore1MonthOfQuarter(quarter) {
      switch (quarter) {
        case 1:
          return 'February'
        case 2:
          return 'May'
        case 3:
          return 'August'
        case 4:
          return 'November'
        default:
          break
      }
    },
    /**
     * getBefore2MonthOfQuarter
     * @param quarter
     * @returns {string}
     */
    getTextBefore2MonthOfQuarter(quarter) {
      switch (quarter) {
        case 1:
          return 'January'
        case 2:
          return 'April'
        case 3:
          return 'July'
        case 4:
          return 'October'
        default:
          break
      }
    },
    /**
     * return array months
     */
    getDropdownMonths() {
      const monthsArray = this.$nuxt.$moment.months()
      return monthsArray.map((value, index) => {
        return {
          code: index + 1,
          label: value
        }
      })
    },
    /**
     * return month date
     * @param month
     * @returns {{code: number, label: *}}
     */
    getDropdownMonthsSelect(month = null) {
      if (month === '-1') {
        return null
      }
      if (month === null) {
        month = this.$nuxt.$moment().format('M')
      }
      const moment = this.$nuxt.$moment()
      const label = moment.month(month - 1).format('MMMM')
      return {
        code: month,
        label: label
      }
    },

    /**
     * Custom sort function by server
     *
     * link : https://bootstrap-vue.js.org/docs/components/table/#sort-compare-routine
     * @param aRow
     * @param bRow
     * @param key
     * @param sortDesc
     * @param formatter
     * @param compareOptions
     * @param compareLocale
     * @returns {boolean}
     */
    bootstrapTableSortBySever(
      aRow,
      bRow,
      key,
      sortDesc,
      formatter,
      compareOptions,
      compareLocale
    ) {
      return false
    },
    /**
     * replace text
     * @param text
     * @return {string}
     */
    replaceText(text = '') {
      return replace(text, new RegExp('<>', 'g'), '<br />')
    },
    /**
     * replace br
     * @param text
     * @return {string}
     */
    replaceBr(text = '') {
      return replace(text, new RegExp('\\n', 'g'), '<br />')
    }
  }
})
