import { ref } from "vue"

export const isLoggedIn = ref(false)
export const user = ref(null)

export function login(userData) {
  isLoggedIn.value = true
  user.value = userData
}  

export function logout() {
  isLoggedIn.value = false
  user.value = null
}
