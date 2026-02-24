import { factories } from '@strapi/strapi';

const uid = 'api::order.order';
const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

function sanitizeItems(input: unknown) {
  if (!Array.isArray(input)) return [];
  return input
    .map((row) => {
      const item = row as Record<string, unknown>;
      return {
        productHandle: String(item.productHandle || ''),
        name: String(item.name || ''),
        price: Number(item.price || 0),
        quantity: Math.max(1, Number(item.quantity || 1)),
        imageSrc: String(item.imageSrc || ''),
        imageAlt: String(item.imageAlt || 'Product image'),
        color: item.color ? String(item.color) : null,
        size: item.size ? String(item.size) : null,
      };
    })
    .filter((item) => item.productHandle && item.name);
}

function sanitizeStatus(input: unknown): OrderStatus {
  const value = typeof input === 'string' ? input.toLowerCase() : '';
  if ((ORDER_STATUSES as readonly string[]).includes(value)) {
    return value as OrderStatus;
  }
  return 'pending';
}

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
      sort: query.sort || 'createdAt:desc',
    });

    return this.transformResponse(data);
  },

  async findOne(ctx) {
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

    return this.transformResponse(current);
  },

  async create(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Authentication required');

    const payload = (ctx.request.body?.data || {}) as Record<string, unknown>;
    const items = sanitizeItems(payload.items);
    if (!items.length) {
      return ctx.badRequest('Order items are required');
    }

    const createdAt = new Date();
    const orderNumber = payload.orderNumber
      ? String(payload.orderNumber)
      : `AGP-${createdAt.getFullYear()}-${Date.now().toString().slice(-6)}`;

    const data = await strapi.documents(uid).create({
      data: {
        orderNumber,
        orderStatus: sanitizeStatus(payload.orderStatus ?? payload.status),
        email: String(payload.email || ''),
        phone: payload.phone ? String(payload.phone) : '',
        firstName: String(payload.firstName || ''),
        lastName: String(payload.lastName || ''),
        company: payload.company ? String(payload.company) : '',
        addressLine1: String(payload.addressLine1 || ''),
        addressLine2: payload.addressLine2 ? String(payload.addressLine2) : '',
        city: String(payload.city || ''),
        country: String(payload.country || ''),
        region: payload.region ? String(payload.region) : '',
        postalCode: String(payload.postalCode || ''),
        deliveryMethod: payload.deliveryMethod ? String(payload.deliveryMethod) : '',
        paymentMethod: payload.paymentMethod ? String(payload.paymentMethod) : '',
        subtotal: Number(payload.subtotal || 0),
        shipping: Number(payload.shipping || 0),
        tax: Number(payload.tax || 0),
        total: Number(payload.total || 0),
        items,
        user: user.id,
      },
    });

    return this.transformResponse(data);
  },
}));
