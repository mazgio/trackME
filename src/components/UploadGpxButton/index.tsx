"use client"

import { useRef } from "react"
import FileUploadIcon from "@mui/icons-material/FileUpload"
import { useUploadGpx } from "@/hooks/useUploadGpx"
import Spinner from "@/components/Spinner"
import styles from "./index.module.css"

export default function UploadGpxButton() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { upload, isUploading } = useUploadGpx()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) upload(file)
    e.target.value = ""
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".gpx"
        className={styles.input}
        onChange={handleChange}
      />
      <button
        className={styles.button}
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        {isUploading ? <Spinner /> : <FileUploadIcon fontSize="small" />}
        Upload GPX
      </button>
    </>
  )
}
