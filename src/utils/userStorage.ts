export function saveUserToLocalStorage(user: any) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function getUserFromLocalStorage() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function removeUserFromLocalStorage() {
  localStorage.removeItem('user');
} 