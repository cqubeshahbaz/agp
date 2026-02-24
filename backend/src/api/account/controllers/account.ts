type AccountPayload = {
  id: number
  username: string
  email: string
  phone: string
  country?: string | null
}

async function getAuthenticatedUser(ctx: any) {
  try {
    const jwtService = strapi.plugin('users-permissions').service('jwt')
    const token = await jwtService.getToken(ctx)
    if (!token?.id) return null

    const userService = strapi.plugin('users-permissions').service('user')
    return userService.fetch(token.id)
  } catch {
    return null
  }
}

function toAccountPayload(user: Record<string, unknown>): AccountPayload {
  return {
    id: Number(user.id || 0),
    username: String(user.username || ''),
    email: String(user.email || ''),
    phone: String(user.phone || ''),
    country: user.country ? String(user.country) : '',
  }
}

export default {
  async me(ctx: any) {
    const authUser = await getAuthenticatedUser(ctx)
    if (!authUser) return ctx.unauthorized('Authentication required')

    ctx.send(toAccountPayload(authUser as Record<string, unknown>))
  },

  async updateMe(ctx: any) {
    const authUser = await getAuthenticatedUser(ctx)
    if (!authUser) return ctx.unauthorized('Authentication required')

    const body = (ctx.request.body || {}) as Record<string, unknown>
    const username = String(body.username || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const phone = String(body.phone || '')
      .replace(/\D/g, '')
      .slice(0, 10)

    if (!username || !email || phone.length !== 10) {
      return ctx.badRequest('username, email and a valid 10-digit phone are required')
    }

    const userService = strapi.plugin('users-permissions').service('user')
    const updated = await userService.edit(Number(authUser.id), {
      username,
      email,
      phone,
    })

    ctx.send(toAccountPayload(updated as Record<string, unknown>))
  },
}
