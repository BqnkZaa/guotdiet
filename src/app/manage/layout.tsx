import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AdminLoginForm } from './login-form'

export default async function ManageLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  const isAuthenticated = token === process.env.ADMIN_PASSWORD

  // If not authenticated, we just render the login form instead of children
  // This avoids redirects and flashes
  if (!isAuthenticated) {
    return <AdminLoginForm />
  }

  return <>{children}</>
}
