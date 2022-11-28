export function setAuthentication(isAuthenticated) {
  sessionStorage.setItem("isAuthenticated", isAuthenticated);
}

export function getAuthentication() {
  return sessionStorage.getItem("isAuthenticated");
}
