import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addOrder } from '../API/OrderApi';
import { clearCart } from '../store/slices/ShoppingCartSlice';

function Payment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.cart);

  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildOrderData = () => ({
    items: cart?.items?.map((item) => ({
      product: item.product?._id || item.productId,
      quantity: item.quantity,
      size: item.size || '',
    })) || [],
    shippingAddress: {
      fullName: formData.fullName,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      zipCode: formData.zipCode,
    },
    orderDate: new Date(),
    status: 'pending',
    note: 'Card',
  });

  const submitOrder = async () => {
    if (!cart || !cart.items?.length) {
      alert('העגלה ריקה');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.address || !formData.city || !formData.zipCode) {
      alert('מלא את פרטי המשלוח');
      return;
    }

    setIsProcessing(true);

    try {
      const order = buildOrderData();
      const createdOrder = await addOrder(order);

      // אם ניקוי הסל נכשל — ההזמנה כבר נוצרה, לכן לא מפילים את כל התהליך
      try {
        await dispatch(clearCart()).unwrap();
      } catch (clearErr) {
        console.error("Clear cart after order failed:", clearErr);
      }

      const orderId = createdOrder?._id || createdOrder?.id || createdOrder?.order?._id || '';

      navigate('/payment/success', {
        state: {
          orderId,
        },
      });
    } catch (err) {
      console.error(err?.response?.data || err);
      alert('שגיאה ביצירת ההזמנה');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    await submitOrder();
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '24px', direction: 'rtl' }}>
      <h2 style={{ marginBottom: '20px' }}>תשלום ומשלוח</h2>

      <form onSubmit={handleCardSubmit} style={{ display: 'grid', gap: '20px' }}>
        <section style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '12px' }}>פרטי אשראי</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <input name="cardName" value={formData.cardName} onChange={handleChange} placeholder="שם בעל הכרטיס" required style={inputStyle} />
            <input name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="מספר כרטיס" required style={inputStyle} />
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input name="expiry" value={formData.expiry} onChange={handleChange} placeholder="תוקף (MM/YY)" required style={{ ...inputStyle, flex: 1 }} />
              <input name="cvv" value={formData.cvv} onChange={handleChange} placeholder="CVV" required style={{ ...inputStyle, flex: 1 }} />
            </div>
          </div>
        </section>

        <section style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '12px' }}>כתובת למשלוח</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="שם מלא" required style={inputStyle} />
            <input name="email" value={formData.email} onChange={handleChange} placeholder="כתובת מייל" required style={inputStyle} />
            <input name="address" value={formData.address} onChange={handleChange} placeholder="כתובת" required style={inputStyle} />
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input name="city" value={formData.city} onChange={handleChange} placeholder="עיר" required style={{ ...inputStyle, flex: 1 }} />
              <input name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="מיקוד" required style={{ ...inputStyle, flex: 1 }} />
            </div>
          </div>
        </section>

        <button type="submit" disabled={isProcessing} style={{ padding: '12px 18px', background: '#111', color: 'white', border: 'none', borderRadius: '8px', cursor: isProcessing ? 'wait' : 'pointer', fontWeight: '700' }}>
          {isProcessing ? 'מעבד...' : 'שלח הזמנה'}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '14px',
};

export default Payment;
