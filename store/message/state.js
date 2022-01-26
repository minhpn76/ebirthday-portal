export default () => ({
  StaffBirthDate: {
    todayDisplayDate: '',
    birthdayThisMonth: 0,
    birthdayNextMonth: 0,
    thisMonth: '',
    nextMonth: '',
    birthdayGreetings: []
  },
  StaffPending: {},
  StaffSent: {},
  StaffList: {},
  /* data send_personalised_greetings */
  sendPersonalisedGreetingsPending: {
    totalCount: 0,
    pending: 0,
    sendPersonalisedGreetingsPending: []
  },
  sendPersonalisedGreetingsSent: {
    totalCount: 0,
    sent: 0,
    sendPersonalisedGreetingsSent: []
  },
  DataReadySendSMS: [],
  StaffBirthDateOfMonth: {
    currentPage: '',
    lastPage: '',
    perPage: '',
    totalCount: '',
    birthdays: []
  },
  Info_User: {},
  authToken: '',
  authRole: {},
  isLoading: false,
  isLoadingSms: false,
  isLoadingSmsPending: false,
  staffForward: [],
  staffSmsData: {},
  pageStage: false
})
