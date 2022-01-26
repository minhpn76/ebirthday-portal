<template>
  <div>
    <ul class="pagination">
      <li class="pagination-item">
        <b-button-group>
          <b-button
            type="button"
            :disabled="isInFirstPage"
            aria-label="Go to first page"
            @click="onClickFirstPage"
            >⏮
          </b-button>
          <b-button
            type="button"
            :disabled="isInFirstPage"
            aria-label="Go to previous page"
            @click="onClickPreviousPage"
            >⏪
          </b-button>
        </b-button-group>
      </li>
      <li class="pagination-item">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text"><b>Page</b></span>
          </div>
          <input
            id="input-page"
            v-model="stateCurrentPage"
            type="number"
            :max="totalPages"
            class="form-control"
            @keyup.enter="submit"
          />
          <div class="input-group-append">
            <span class="input-group-text"
              ><b>of {{ totalPages }}</b></span
            >
          </div>
        </div>
      </li>
      <li class="pagination-item">
        <b-button-group>
          <b-button
            type="button"
            :disabled="isInLastPage"
            aria-label="Go to next page"
            @click="onClickNextPage"
            >⏩
          </b-button>
          <b-button
            type="button"
            :disabled="isInLastPage"
            aria-label="Go to last page"
            @click="onClickLastPage"
            >⏭
          </b-button>
        </b-button-group>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'Pagination',
  props: {
    maxVisibleButtons: {
      type: Number,
      required: false,
      default: 3
    },
    totalPages: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    perPage: {
      type: [Number, String],
      required: true
    },
    currentPage: {
      type: [Number, String],
      default: () => {
        return 1
      }
    }
  },
  data() {
    return {
      stateCurrentPage: '1'
    }
  },
  computed: {
    startPage() {
      if (parseInt(this.stateCurrentPage) === 1) {
        return 1
      }
      if (parseInt(this.stateCurrentPage) === this.totalPages) {
        return this.totalPages - this.maxVisibleButtons + 1
      }

      return parseInt(this.stateCurrentPage) - 1
    },
    endPage() {
      return Math.min(
        this.startPage + this.maxVisibleButtons - 1,
        this.totalPages
      )
    },
    isInFirstPage() {
      return parseInt(this.stateCurrentPage) === 1
    },
    isInLastPage() {
      return parseInt(this.stateCurrentPage) === this.totalPages
    }
  },
  watch: {
    stateCurrentPage: function(value) {
      const page = parseInt(value)
      if (page > this.totalPages) {
        return this.totalPages
      }
      return page
    },
    currentPage: {
      handler: function(value) {
        if (value === '' || isNaN(value)) {
          this.stateCurrentPage = 1
        } else if (value === 0) {
          this.stateCurrentPage = 1
        } else if (parseInt(value) > this.totalPages) {
          this.stateCurrentPage = parseInt(this.totalPages)
        } else {
          this.stateCurrentPage = parseInt(value)
        }
      }
    }
  },
  methods: {
    submit() {
      const page = parseInt(this.stateCurrentPage)
      if (page > this.totalPages) {
        return this.totalPages
      }
      this.$emit('pagechanged', page)
    },
    onClickFirstPage() {
      if (this.stateCurrentPage === '') {
        this.$emit('pagechanged', 1)
      }
      this.$emit('pagechanged', 1)
    },
    onClickPreviousPage() {
      if (this.stateCurrentPage === '') {
        return
      }
      this.$emit('pagechanged', parseInt(this.stateCurrentPage) - 1)
    },
    onClickPage(page) {
      if (this.stateCurrentPage === '') {
        this.$emit('pagechanged', 1)
      }
      this.$emit('pagechanged', page)
    },
    onClickNextPage() {
      if (this.stateCurrentPage === '') {
        this.$emit('pagechanged', 1)
      }
      this.$emit('pagechanged', parseInt(this.stateCurrentPage) + 1)
    },
    onClickLastPage() {
      if (this.stateCurrentPage === '') {
        this.$emit('pagechanged', 1)
      }
      this.$emit('pagechanged', this.totalPages)
    },
    isPageActive(page) {
      return parseInt(this.stateCurrentPage) === page
    },
    keyDownFunction: function(evt) {
      if (
        (evt.keyCode >= 48 && evt.keyCode <= 57) ||
        [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 13, 8].includes(evt.keyCode)
      ) {
        if (evt.keyCode === 13 && parseInt(this.stateCurrentPage)) {
          this.onClickPage(parseInt(this.stateCurrentPage))
          evt.preventDefault()
        }
      } else {
        evt.preventDefault()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  list-style-type: none;
  max-width: 350px;
  padding: 5px 0px;
  background: #fff;
}

.pagination-item {
  display: inline-block;
}

.active {
  background-color: #4aae9b;
  color: #ffffff;
}

.pagination-item button {
  background: #fff0;
  border: none;
}

.input-group .input-group-text {
  background: #fff0;
  border: none;
}

#input-page {
  max-width: 50px;
}
</style>
