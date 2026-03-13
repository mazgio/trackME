"use client"

import type { ButtonHTMLAttributes, ReactNode } from "react"
import styles from "./index.module.css"

type Variant = "primary" | "secondary" | "icon"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}

export default function Button({ variant = "primary", children, className, ...props }: Props) {
  const variantClass = styles[variant]

  return (
    <button className={`${styles.button} ${variantClass} ${className ?? ""}`} {...props}>
      {children}
    </button>
  )
}
