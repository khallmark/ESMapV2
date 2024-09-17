import { createCookieSessionStorage } from '@remix-run/node'

export type Theme = 'light' | 'dark'

const themeStorage = createCookieSessionStorage({
	cookie: {
		name: 'theme',
		secure: true,
		secrets: ['s3cr3t'],
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
	},
})

export async function getTheme(request: Request): Promise<Theme | null> {
	const session = await themeStorage.getSession(request.headers.get('Cookie'))
	const theme = session.get('theme')
	if (theme === 'light' || theme === 'dark') {
		return theme
	}
	return null // This will indicate that the system preference should be used
}

export async function setTheme(theme: Theme | null) {
	const session = await themeStorage.getSession()
	if (theme) {
		session.set('theme', theme)
	} else {
		session.unset('theme')
	}
	return themeStorage.commitSession(session, {
		expires: new Date('2100-01-01'),
	})
}
