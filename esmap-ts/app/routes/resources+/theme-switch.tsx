import { useForm, getFormProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import { json, type ActionFunctionArgs } from '@remix-run/node'
import { redirect, useFetcher, useFetchers } from '@remix-run/react'
import { ServerOnly } from 'remix-utils/server-only'
import { z } from 'zod'
import { Icon } from '#app/components/ui/icon.tsx'
import { useRequestInfo } from '#app/utils/request-info.ts'
import { type Theme, setTheme } from '#app/utils/theme.server.ts'
import { useHints } from '#app/utils/client-hints.tsx'

const ThemeFormSchema = z.object({
	theme: z.enum(['light', 'dark', 'system']),
	redirectTo: z.string().optional(),
})

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData()
	const submission = parseWithZod(formData, {
		schema: ThemeFormSchema,
	})

	invariantResponse(submission.status === 'success', 'Invalid theme received')

	const { theme, redirectTo } = submission.value

	const responseInit = {
		headers: { 'set-cookie': await setTheme(theme === 'system' ? null : theme) },
	}
	if (redirectTo) {
		return redirect(redirectTo, responseInit)
	} else {
		return json({ result: submission.reply() }, responseInit)
	}
}

export function ThemeSwitch({
	userPreference,
}: {
	userPreference: Theme | null
}) {
	const fetcher = useFetcher<typeof action>()
	const requestInfo = useRequestInfo()

	const [form] = useForm({
		id: 'theme-switch',
		lastResult: fetcher.data?.result,
	})

	const optimisticMode = useOptimisticThemeMode()
	const mode = optimisticMode ?? userPreference ?? 'system'
	const nextMode = mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system'

	const modeLabel = {
		light: (
			<Icon name="sun">
				<span className="sr-only">Light</span>
			</Icon>
		),
		dark: (
			<Icon name="moon">
				<span className="sr-only">Dark</span>
			</Icon>
		),
		system: (
			<Icon name="laptop">
				<span className="sr-only">System</span>
			</Icon>
		),
	}

	return (
		<fetcher.Form
			method="POST"
			{...getFormProps(form)}
			action="/resources/theme-switch"
		>
			<ServerOnly>
				{() => (
					<input type="hidden" name="redirectTo" value={requestInfo.path} />
				)}
			</ServerOnly>
			<input type="hidden" name="theme" value={nextMode} />
			<div className="flex gap-2">
				<button
					type="submit"
					className="flex h-8 w-8 cursor-pointer items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
				>
					{modeLabel[mode]}
				</button>
			</div>
		</fetcher.Form>
	)
}

export function useOptimisticThemeMode(): Theme | null {
	const fetchers = useFetchers()
	const themeFetcher = fetchers.find(
		(f) => f.formAction === '/resources/theme-switch',
	)

	const hints = useHints()
	if (themeFetcher && themeFetcher.formData) {
		const submission = parseWithZod(themeFetcher.formData, {
			schema: ThemeFormSchema,
		})
		
		if (submission.status === 'success') {
			return submission.value.theme === 'system' ? hints.theme : submission.value.theme
		}
	}
	return hints.theme
}
