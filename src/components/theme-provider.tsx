"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"

type ThemeProviderProps = React.PropsWithChildren<{
  attribute?: string
  defaultTheme?: Theme
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}>

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: "light" | "dark"
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return
  const resolvedTheme = theme === "system" ? getSystemTheme() : theme
  document.documentElement.classList.toggle("dark", resolvedTheme === "dark")
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme
    return (window.localStorage.getItem("theme") as Theme | null) ?? defaultTheme
  })

  React.useEffect(() => {
    applyTheme(theme)

    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", theme)
    }

    if (!enableSystem || theme !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => applyTheme("system")

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, enableSystem])

  const resolvedTheme = theme === "system" ? getSystemTheme() : theme

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }

  return context
}