"use client"

import * as React from "react"

const ThemeContext = React.createContext<{
  theme: "light" | "dark" | "system"
  setTheme: (theme: "light" | "dark" | "system") => void
} | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<"light" | "dark" | "system">("system")

  React.useEffect(() => {
    // Load theme from localStorage or system
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null
    if (saved === "light" || saved === "dark" || saved === "system") {
      setThemeState(saved)
    }
  }, [])

  React.useEffect(() => {
    const root = window.document.documentElement
    const apply = (t: "light" | "dark" | "system") => {
      if (t === "system") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        root.classList.toggle("dark", isDark)
      } else {
        root.classList.toggle("dark", t === "dark")
      }
    }
    apply(theme)
    if (theme !== "system") {
      localStorage.setItem("theme", theme)
    } else {
      localStorage.removeItem("theme")
    }
    // Listen for system changes if system mode
    if (theme === "system") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)")
      const handler = (e: MediaQueryListEvent) => {
        root.classList.toggle("dark", e.matches)
      }
      mql.addEventListener("change", handler)
      return () => mql.removeEventListener("change", handler)
    }
  }, [theme])

  const setTheme = (t: "light" | "dark" | "system") => setThemeState(t)

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
} 