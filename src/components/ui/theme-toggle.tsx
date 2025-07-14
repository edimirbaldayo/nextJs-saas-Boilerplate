"use client"

import { useTheme } from "@/components/providers/theme-provider"
import { Sun, Moon, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Toggle theme">
          {theme === "dark" ? <Moon className="h-5 w-5" /> : theme === "light" ? <Sun className="h-5 w-5" /> : <Laptop className="h-5 w-5" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}> <Sun className="mr-2 h-4 w-4" /> Light </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}> <Moon className="mr-2 h-4 w-4" /> Dark </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}> <Laptop className="mr-2 h-4 w-4" /> System </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 