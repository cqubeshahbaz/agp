export default {
  routes: [
    {
      method: 'GET',
      path: '/account/me',
      handler: 'account.me',
      config: { auth: false },
    },
    {
      method: 'PUT',
      path: '/account/me',
      handler: 'account.updateMe',
      config: { auth: false },
    },
  ],
}
