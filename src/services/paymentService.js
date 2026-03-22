import axios from 'axios';

const paymentApi = axios.create({
  baseURL: import.meta.env.VITE_PAYMENT_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
});

function getBearerToken() {
  return sessionStorage.getItem('authToken') || import.meta.env.VITE_FALLBACK_BEARER_TOKEN || 'demo-token';
}

function getAuthHeaders() {
  return {
    Authorization: `Bearer ${getBearerToken()}`,
  };
}

export async function createPayment(payload) {
  const response = await paymentApi.post('/payments', payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

export async function getPaymentStatus(bookingId) {
  const response = await paymentApi.get(`/payments/${bookingId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

export async function refundPayment(payload) {
  const response = await paymentApi.post('/payments/refund', payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

export async function getNotificationHistory(userId) {
  const response = await paymentApi.get('/notifications/history', {
    headers: getAuthHeaders(),
    params: userId ? { userId } : {},
  });
  return response.data;
}

export async function sendInternalNotification(payload) {
  const internalKey =
    import.meta.env.VITE_INTERNAL_SERVICE_KEY ||
    'replace-this-with-strong-random-value';

  const response = await paymentApi.post('/notifications/send', payload, {
    headers: {
      'x-internal-service-key': internalKey,
    },
  });
  return response.data;
}
