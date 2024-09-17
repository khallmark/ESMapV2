import { useHints } from '#app/utils/client-hints'
import { useRequestInfo } from '#app/utils/request-info'
import { useOptimisticThemeMode } from '#app/routes/resources+/theme-switch'
import type { Theme } from '#app/utils/theme.server'

export function useTheme(): Theme {
	const hints = useHints()
	const requestInfo = useRequestInfo()
	const optimisticMode = useOptimisticThemeMode()
	return (optimisticMode ?? requestInfo.userPrefs.theme ?? hints.theme ?? 'light') as Theme
}