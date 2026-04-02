export function useTheme() {
  const isDark = useState('theme', () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('theme')
      if (saved === 'dark') return true
      if (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) return true
    }
    return false
  })

  const toggleDark = () => {
    isDark.value = !isDark.value
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', isDark.value)
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    }
  }

  return { isDark, toggleDark }
}
