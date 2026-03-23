let logoutFn = null;

export const setLogoutHandler = (fn) => {
  logoutFn = fn;
};

export const triggerLogout = () => {
  if (logoutFn) logoutFn();
};