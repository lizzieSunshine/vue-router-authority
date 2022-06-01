export default {
  get: {
    name: "get",
    url: "/api/enums/get",
    method: "get"
  },

  getByName: {
    name: "getByName",
    url: "/api/enums/getByName",
    method: "get"
  },

  add: {
    name: "add",
    url: "/api/router/add",
    method: "post"
  },

  edit: {
    name: "edit",
    url: "/api/router/edit",
    method: "post"
  },

  delete: {
    name: "delete",
    url: "/api/router/delete",
    method: "post"
  },

  auth: {
    name: "auth",
    url: "/api/router/auth",
    method: "post"
  },

  authFromRoutes: {
    name: "authFromRoutes",
    url: "/api/router/authFromRoutes",
    method: "post"
  },

  save: {
    name: "save",
    url: "/api/enums/save",
    method: "post"
  },

  validateUniqueness: {
    name: "validateUniqueness",
    url: "/api/router/validateUniqueness",
    method: "post"
  },

  getRouteNames: {
    name: "getRouteNames",
    url: "/api/router/getRouteNames",
    method: "post"
  }
};
