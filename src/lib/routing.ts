const routing = {
  defaultRoute: () => "/activities",
  loginRoute: () => "/login",
  profileRoute: () => "/profile",
  activityRoute: (id: string) => `/activities/${id}`,
}

export default routing
