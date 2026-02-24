import { factories } from '@strapi/strapi';

const uid = 'api::cart-item.cart-item';

export default factories.createCoreController(uid, ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Authentication required');

    const query = ctx.query || {};
    const filters =
      query.filters && typeof query.filters === 'object' && !Array.isArray(query.filters)
        ? (query.filters as Record<string, unknown>)
        : {};
    const mergedFilters = { ...filters, user: { id: { $eq: user.id } } };

    const data = await strapi.documents(uid).findMany({
      ...query,
      filters: mergedFilters,
    });

    return this.transformResponse(data);
  },

  async create(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Authentication required');

    const payload = ctx.request.body?.data || {};
    const data = await strapi.documents(uid).create({
      data: {
        ...payload,
        user: user.id,
      },
    });

    return this.transformResponse(data);
  },

  async update(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Authentication required');

    const documentId = ctx.params.documentId || ctx.params.id;
    const current = await strapi.documents(uid).findOne({
      documentId,
      populate: { user: true },
    });

    const ownerId = typeof current?.user === 'object' ? current.user?.id : current?.user;
    if (!current || ownerId !== user.id) {
      return ctx.forbidden('Not allowed');
    }

    const payload = ctx.request.body?.data || {};
    const data = await strapi.documents(uid).update({
      documentId,
      data: payload,
    });

    return this.transformResponse(data);
  },

  async delete(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Authentication required');

    const documentId = ctx.params.documentId || ctx.params.id;
    const current = await strapi.documents(uid).findOne({
      documentId,
      populate: { user: true },
    });

    const ownerId = typeof current?.user === 'object' ? current.user?.id : current?.user;
    if (!current || ownerId !== user.id) {
      return ctx.forbidden('Not allowed');
    }

    const data = await strapi.documents(uid).delete({ documentId });
    return this.transformResponse(data);
  },
}));
