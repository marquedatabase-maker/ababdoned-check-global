import Lead from '../models/Lead.js';
import User from '../models/User.js';

export const handleWebhook = async (req, res) => {
  try {
    const data = req.body;
    const headers = req.headers;

    let store_id = req.params.store_id || data.merchant_id || data.store_id || '';
    if (!store_id && headers['x-shopify-shop-domain']) {
      store_id = headers['x-shopify-shop-domain'].split('.')[0];
    }

    if (!store_id) return res.status(400).json({ message: 'Store ID missing' });

    const user = await User.findOne({ store_id: store_id.toLowerCase().trim() });
    if (!user) return res.status(200).json({ message: 'Store not registered' });

    let normalizedData = {};
    let source = headers['x-shopify-shop-domain'] ? 'shopify' : 'gokwik';

    if (source === 'shopify') {
      const uniqueId = data.token || data.cart_token || data.id || Date.now().toString();
      const addr = data.shipping_address || data.billing_address || {};
      const fullAddress = `${addr.address1 || ''}, ${addr.address2 || ''}, ${addr.city || ''}, ${addr.province || ''}, ${addr.zip || ''}`.replace(/^, |, $/g, '').trim();
      const shopDomain = headers['x-shopify-shop-domain'];

      // Extract items with links if possible
      const items = (data.line_items || []).map(item => ({
        title: item.title || 'Unknown Product',
        quantity: item.quantity || 1,
        price: parseFloat(item.price || 0),
        url: item.product_id ? `https://${shopDomain}/products/${item.handle || item.product_id}` : null
      }));

      normalizedData = {
        name: `${data.customer?.first_name || ''} ${data.customer?.last_name || ''}`.trim() || 'Shopify Customer',
        phone: data.customer?.phone || addr.phone || data.phone || '',
        email: data.customer?.email || data.email || '',
        address: fullAddress || 'No Address Provided',
        items: items,
        recovery_url: data.abandon_checkout_url || null,
        amount: parseFloat(data.total_price || 0),
        status: data.cancelled_at ? 'failed' : (data.completed_at ? 'success' : 'abandoned'),
        external_id: `shopify_${uniqueId}`,
      };
    } else {
      const items = (data.line_items || data.products || []).map(item => ({
        title: item.product_name || item.title || 'Unknown Product',
        quantity: item.quantity || 1,
        price: parseFloat(item.price || 0),
        url: item.product_url || null
      }));

      normalizedData = {
        name: data.customer_name || 'GoKwik Customer',
        phone: data.customer_phone || '',
        email: data.customer_email || '',
        address: data.customer_address || 'No Address Provided',
        items: items,
        recovery_url: data.checkout_url || null,
        amount: parseFloat(data.total_amount || data.amount || 0),
        status: data.status === 'success' ? 'success' : (data.status === 'abandoned' ? 'abandoned' : 'failed'),
        external_id: `gokwik_${data.order_id || data.id || Date.now().toString()}`,
      };
    }

    if (!normalizedData.phone) {
      console.log(`[Webhook] IGNORED: Lead "${normalizedData.name}" has no phone number.`);
      return res.status(200).json({ message: 'Lead ignored: No phone' });
    }

    const existingLead = await Lead.findOne({ external_id: normalizedData.external_id });
    if (existingLead) {
      existingLead.status = normalizedData.status;
      existingLead.items = normalizedData.items;
      existingLead.recovery_url = normalizedData.recovery_url;
      await existingLead.save();
      return res.status(200).json({ message: 'Lead updated' });
    }

    const newLead = new Lead({
      ...normalizedData,
      store_id: user.store_id,
      user_id: user._id,
      source: source,
      raw_data: data
    });

    await newLead.save();
    console.log(`[Webhook] SUCCESS: Lead saved with recovery URL for ${user.store_name}`);
    res.status(201).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('[Webhook] FATAL ERROR:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
