'use server'

import { createClient } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function signUp(
  username: string,
  email: string,
  password: string,
) {
  const supabase = await createClient()

  // Hash the password
  const passwordHash = await bcrypt.hash(password, 10)

  // Create the user
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        username,
        email,
        password_hash: passwordHash,
        role: 'customer',
      },
    ])
    .select()

  if (error) {
    return { error: error.message }
  }

  const cookieStore = await cookies()
  cookieStore.set('user_role', 'customer', { path: '/', httpOnly: true })
  cookieStore.set('user_id', data[0].id, { path: '/', httpOnly: true })

  return { success: true, user: data[0] }
}

export async function login(username: string, password: string) {
  const supabase = await createClient()

  // Get the user
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single()

  if (error || !user) {
    return { error: 'Invalid username or password' }
  }

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password_hash)

  if (!isPasswordValid) {
    return { error: 'Invalid username or password' }
  }

  // Set cookies for middleware authentication
  const cookieStore = await cookies()
  cookieStore.set('user_role', user.role, { path: '/', httpOnly: true })
  cookieStore.set('user_id', user.id, { path: '/', httpOnly: true })

  return { success: true, user }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('user_role')
  cookieStore.delete('user_id')
  redirect('/auth/login')
}

