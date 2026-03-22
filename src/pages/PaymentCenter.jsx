import { useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import {
  createPayment,
  getNotificationHistory,
  getPaymentStatus,
  refundPayment,
  sendInternalNotification,
} from '../services/paymentService';
import { confirmBooking } from '../services/bookingApi';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

function PaymentCenterContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stripe = useStripe();
  const elements = useElements();

  const flow = searchParams.get('flow') || '';
  const bookingIdFromQuery = searchParams.get('bookingId') || '';
  const amountFromQuery = searchParams.get('amount') || '';
  const currencyFromQuery = (searchParams.get('currency') || '').toUpperCase();
  const returnTo = searchParams.get('returnTo') || '/booking-service/my-bookings';
  const token = sessionStorage.getItem('authToken') || '';

  let tokenUserId = '';
  if (token) {
    try {
      const decoded = jwtDecode(token);
      tokenUserId = decoded?.id || decoded?.userId || decoded?.sub || '';
    } catch (_error) {
      tokenUserId = '';
    }
  }

  const [bookingId, setBookingId] = useState(bookingIdFromQuery || '');
  const [userId, setUserId] = useState(tokenUserId || '');
  const [amount, setAmount] = useState(amountFromQuery || '');
  const [currency, setCurrency] = useState(currencyFromQuery || 'USD');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [channel, setChannel] = useState('email');
  const [destination, setDestination] = useState('user@example.com');
  const [message, setMessage] = useState('Frontend integration notification');
  const [refundReason, setRefundReason] = useState('Customer requested cancellation');
  const [apiResult, setApiResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cardReady, setCardReady] = useState(false);

  const cardStyle = useMemo(
    () => ({
      background: '#ffffff',
      borderRadius: 12,
      boxShadow: '0 6px 24px rgba(15, 23, 42, 0.12)',
      padding: 20,
      marginBottom: 18,
    }),
    []
  );

  const inputStyle = {
    width: '100%',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    marginBottom: 10,
    fontSize: 14,
  };

  const buttonStyle = {
    border: 'none',
    borderRadius: 8,
    padding: '10px 14px',
    background: '#0f766e',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    marginRight: 8,
    marginTop: 6,
  };

  const cardElementContainerStyle = {
    width: '100%',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    padding: 12,
    marginTop: 6,
    marginBottom: 10,
    background: '#fff',
  };

  async function runAction(action) {
    setLoading(true);
    setError('');
    setApiResult(null);
    try {
      const data = await action();
      setApiResult(data);
    } catch (apiError) {
      setError(apiError?.response?.data?.message || apiError.message || 'Request failed');
      if (apiError?.response?.data) {
        setApiResult(apiError.response.data);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCreatePayment() {
    await runAction(async () => {
      let resolvedPaymentMethodId = paymentMethodId;

      if (!resolvedPaymentMethodId && stripe && elements) {
        const card = elements.getElement(CardElement);
        if (!card) {
          throw new Error('Card input is not ready yet');
        }

        const result = await stripe.createPaymentMethod({
          type: 'card',
          card,
          billing_details: {
            email: channel === 'email' ? destination : undefined,
          },
        });

        if (result.error) {
          throw new Error(result.error.message || 'Failed to create Stripe payment method');
        }

        resolvedPaymentMethodId = result.paymentMethod?.id || '';
        setPaymentMethodId(resolvedPaymentMethodId);
      }

      if (!resolvedPaymentMethodId) {
        throw new Error('Provide Payment Method ID or enter card details to generate one');
      }

      return createPayment({
        bookingId,
        userId,
        amount: Number(amount),
        currency,
        paymentMethodId: resolvedPaymentMethodId,
        contact: { channel, destination },
      });
    });
  }

  async function handlePayAndConfirmBooking() {
    await runAction(async () => {
      if (!bookingId) {
        throw new Error('Booking ID is required to complete payment confirmation flow');
      }

      if (!userId) {
        throw new Error('User ID is required. Please log in again to refresh your token.');
      }

      let resolvedPaymentMethodId = paymentMethodId;

      if (!resolvedPaymentMethodId && stripe && elements) {
        const card = elements.getElement(CardElement);
        if (!card) {
          throw new Error('Card input is not ready yet');
        }

        const result = await stripe.createPaymentMethod({
          type: 'card',
          card,
          billing_details: {
            email: channel === 'email' ? destination : undefined,
          },
        });

        if (result.error) {
          throw new Error(result.error.message || 'Failed to create Stripe payment method');
        }

        resolvedPaymentMethodId = result.paymentMethod?.id || '';
        setPaymentMethodId(resolvedPaymentMethodId);
      }

      if (!resolvedPaymentMethodId) {
        throw new Error('Provide Payment Method ID or card details to continue');
      }

      const paymentResponse = await createPayment({
        bookingId,
        userId,
        amount: Number(amount),
        currency,
        paymentMethodId: resolvedPaymentMethodId,
        contact: { channel, destination },
      });

      const paymentStatus = paymentResponse?.data?.status || paymentResponse?.status;
      if (String(paymentStatus || '').toLowerCase() !== 'success') {
        throw new Error('Payment was not successful. Booking confirmation was not completed.');
      }

      const confirmResponse = await confirmBooking(bookingId);

      setTimeout(() => {
        const separator = returnTo.includes('?') ? '&' : '?';
        navigate(`${returnTo}${separator}paymentSuccess=1`);
      }, 900);

      return {
        payment: paymentResponse,
        booking: confirmResponse,
      };
    });
  }

  return (
    <div style={{ minHeight: '100vh', background: '#e2e8f0' }}>
      <Navbar />
      <main style={{ maxWidth: 980, margin: '0 auto', padding: '24px 16px 36px' }}>
        <h1 style={{ margin: 0, color: '#0f172a' }}>Payment Service Integration Center</h1>
        <p style={{ color: '#334155' }}>
          Use this page to test your Payment and Notification microservice directly from the frontend.
        </p>

        <section style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Shared Inputs</h3>
          <label>
            Booking ID
            <input style={inputStyle} value={bookingId} onChange={(e) => setBookingId(e.target.value)} />
          </label>
          <label>
            User ID
            <input style={inputStyle} value={userId} onChange={(e) => setUserId(e.target.value)} />
          </label>
          <label>
            Amount
            <input style={inputStyle} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
          <label>
            Currency
            <input style={inputStyle} value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} />
          </label>
          {stripePublishableKey && (
            <label>
              Stripe Card Details
              <div style={cardElementContainerStyle}>
                <CardElement
                  onReady={() => setCardReady(true)}
                  options={{
                    hidePostalCode: true,
                    style: {
                      base: {
                        fontSize: '14px',
                        color: '#0f172a',
                        '::placeholder': {
                          color: '#94a3b8',
                        },
                      },
                    },
                  }}
                />
              </div>
            </label>
          )}
          <label>
            Payment Method ID (Optional Manual Override)
            <input style={inputStyle} value={paymentMethodId} onChange={(e) => setPaymentMethodId(e.target.value)} />
          </label>
          {!stripePublishableKey && (
            <p style={{ color: '#b45309', fontWeight: 700 }}>
              Set VITE_STRIPE_PUBLISHABLE_KEY in frontend .env to enable card payment method generation.
            </p>
          )}
          {stripePublishableKey && !cardReady && <p style={{ color: '#334155' }}>Loading Stripe card input...</p>}
          <label>
            Contact Channel
            <select style={inputStyle} value={channel} onChange={(e) => setChannel(e.target.value)}>
              <option value="email">email</option>
              <option value="sms">sms</option>
            </select>
          </label>
          <label>
            Contact Destination
            <input style={inputStyle} value={destination} onChange={(e) => setDestination(e.target.value)} />
          </label>
        </section>

        <section style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Payment Actions</h3>
          {flow === 'booking-confirm' && (
            <p style={{ color: '#155e75', fontWeight: 700 }}>
              Booking confirm flow detected. Complete payment below, then booking will be confirmed automatically.
            </p>
          )}
          <button
            style={buttonStyle}
            disabled={loading || (stripePublishableKey && !cardReady)}
            onClick={handleCreatePayment}
          >
            Create Payment
          </button>
          {flow === 'booking-confirm' && (
            <button
              style={{ ...buttonStyle, background: '#1d4ed8' }}
              disabled={loading || !bookingId || !amount || !userId || (stripePublishableKey && !cardReady)}
              onClick={handlePayAndConfirmBooking}
            >
              Pay And Confirm Booking
            </button>
          )}
          <button
            style={buttonStyle}
            disabled={loading}
            onClick={() => runAction(() => getPaymentStatus(bookingId))}
          >
            Get Payment Status
          </button>

          <label>
            Refund Reason
            <input
              style={inputStyle}
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
            />
          </label>
          <button
            style={buttonStyle}
            disabled={loading}
            onClick={() => runAction(() => refundPayment({ bookingId, reason: refundReason }))}
          >
            Refund Payment
          </button>
        </section>

        <section style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Notification Actions</h3>
          <label>
            Message
            <input style={inputStyle} value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>
          <button
            style={buttonStyle}
            disabled={loading}
            onClick={() =>
              runAction(() =>
                sendInternalNotification({
                  userId,
                  bookingId,
                  paymentId: 'frontend-manual-payment-id',
                  channel,
                  destination,
                  message,
                })
              )
            }
          >
            Send Internal Notification
          </button>
          <button
            style={buttonStyle}
            disabled={loading}
            onClick={() => runAction(() => getNotificationHistory(userId))}
          >
            Get Notification History
          </button>
        </section>

        {loading && <p style={{ color: '#1d4ed8' }}>Processing request...</p>}
        {error && <p style={{ color: '#b91c1c', fontWeight: 700 }}>Error: {error}</p>}

        <section style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Latest API Response</h3>
          <pre
            style={{
              background: '#0f172a',
              color: '#e2e8f0',
              padding: 14,
              borderRadius: 8,
              overflowX: 'auto',
              minHeight: 120,
            }}
          >
            {apiResult ? JSON.stringify(apiResult, null, 2) : 'No requests executed yet.'}
          </pre>
        </section>
      </main>
    </div>
  );
}

export default function PaymentCenter() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentCenterContent />
    </Elements>
  );
}
