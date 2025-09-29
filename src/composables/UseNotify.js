// notify.js
import { Notify } from 'quasar'

const positiveNotify = (message) => {
  return Notify.create({
    message,
    color: 'positive', // cores padrão: positive, negative, warning, info
    textColor: 'white', // cor do texto
    icon: 'check_circle', // pode usar ícones do material ou fontawesome
    position: 'bottom', // top, top-right, bottom, etc
    timeout: 3000, // tempo em ms (3s)
  })
}

const negativeNotify = (message) => {
  return Notify.create({
    message,
    color: 'negative',
    textColor: 'white',
    icon: 'error',
    position: 'bottom',
    timeout: 4000,
  })
}

const warningNotify = (message) => {
  return Notify.create({
    message,
    color: 'warning',
    textColor: 'black',
    icon: 'warning',
    position: 'bottom',
  })
}

export { positiveNotify, negativeNotify, warningNotify }
