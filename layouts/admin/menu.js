export default {
  items: [
    {
      name: 'menu.dashboard',
      url: '/admin',
      icon: 'icon-speedometer'
    },
    {
      name: 'menu.resend_sms',
      url: '/admin/resend-sms',
      icon: 'icon-envelope'
    },
    {
      name: 'menu.personalised_greeting_stats',
      url: '/admin/personalised-greeting-stats',
      icon: 'fa fa-paper-plane'
    },
    {
      name: 'menu.birthdays',
      url: '/admin/birthdays',
      icon: 'fa fa-birthday-cake'
    },
    {
      name: 'menu.portal_setting',
      url: '#',
      icon: 'fa fa-cog',
      children: [
        {
          name: 'Roles',
          url: '/admin/roles',
          icon: 'fa fa-share'
        },
        {
          name: 'Functional ID',
          url: '#',
          icon: 'fa fa-bookmark',
          children: [
            {
              name: 'Create',
              url: '/admin/functional/create',
              icon: 'fa fa-plus'
            },
            {
              name: 'Modify',
              url: '/admin/functional/modify',
              icon: 'fa fa-edit'
            }
          ]
        }
      ]
    },
    {
      name: 'menu.templates',
      url: '#',
      icon: 'fa fa-file',
      children: [
        {
          name: 'Email',
          url: '/admin/document/email',
          icon: 'fa fa-envelope'
        },
        {
          name: 'SMS',
          url: '/admin/document/sms',
          icon: 'fa fa-comments'
        }
      ]
    }
  ]
}
