// src/lib/useSchemaMarkup.ts
import { useEffect } from 'react'

export function useSchemaMarkup(schema: object) {
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(schema)
    script.id = 'schema-markup'
    // Replace existing schema if present
    document.getElementById('schema-markup')?.remove()
    document.head.appendChild(script)
    return () => { document.getElementById('schema-markup')?.remove() }
  }, [JSON.stringify(schema)])
}