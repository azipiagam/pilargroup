import { useEffect } from 'react'

const APP_TITLE = 'Pilargroup'

export function usePageTitle() {
  useEffect(() => {
    document.title = APP_TITLE
  }, [])
}
