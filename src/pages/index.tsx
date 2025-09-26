import { useState } from 'react'

// Types
interface Product {
  id: string
  name: string
  price: number
  category: 'Food' | 'Drinks' | 'Snacks'
  image: string
  description: string
}

interface CartItem extends Product {
  quantity: number
}

// Sample products data
const products: Product[] = [
  { id: '1', name: 'Burger Deluxe', price: 12.99, category: 'Food', image: '🍔', description: 'Juicy beef burger with cheese' },
  { id: '2', name: 'Pizza Margherita', price: 15.99, category: 'Food', image: '🍕', description: 'Classic Italian pizza' },
  { id: '3', name: 'Caesar Salad', price: 8.99, category: 'Food', image: '🥗', description: 'Fresh caesar salad' },
  { id: '4', name: 'Coca Cola', price: 2.99, category: 'Drinks', image: '🥤', description: 'Refreshing cola' },
  { id: '5', name: 'Coffee', price: 4.99, category: 'Drinks', image: '☕', description: 'Premium coffee' },
  { id: '6', name: 'Chips', price: 3.49, category: 'Snacks', image: '🍟', description: 'Crispy chips' },
  { id: '7', name: 'Sushi Roll', price: 18.99, category: 'Food', image: '🍣', description: 'Fresh salmon sushi roll' },
  { id: '8', name: 'Orange Juice', price: 3.99, category: 'Drinks', image: '🍊', description: 'Fresh orange juice' }
]

export default function FoodStore() {
  const [currentPage, setCurrentPage] = useState<'products' | 'checkout' | 'payment'>('products')
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Food' | 'Drinks' | 'Snacks'>('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.id !== productId))
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0)
  const getTotalPrice = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0)

  const categories = ['All', 'Food', 'Drinks', 'Snacks'] as const
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const tax = getTotalPrice() * 0.1
  const total = getTotalPrice() + tax
  const shipping = 5.00

  // Products Page
  if (currentPage === 'products') {
    return (
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e5e5e5',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '400px',
          height: 'fit-content'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e5e5e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fafafa'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>☰</button>
              <span style={{ fontWeight: '600', fontSize: '16px' }}>FoodStore</span>
            </div>
            <button 
              onClick={() => setCurrentPage('checkout')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '6px',
                color: '#333',
                position: 'relative',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              🛒
              {getTotalItems() > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '20px' }}>
            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 32px 8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666',
                fontSize: '14px'
              }}>🔍</span>
            </div>

            {/* Category Tabs */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: '6px 12px',
                    border: 'none',
                    backgroundColor: selectedCategory === category ? '#007bff' : '#f8f9fa',
                    color: selectedCategory === category ? 'white' : '#666',
                    borderRadius: '16px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Products */}
            <div>
              {filteredProducts.map((product) => (
                <div key={product.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  marginBottom: '10px',
                  backgroundColor: '#fafafa'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    {product.image}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>{product.name}</div>
                    <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>${product.price.toFixed(2)}</div>
                    <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.3' }}>{product.description}</div>
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Add +
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Checkout Page
  if (currentPage === 'checkout') {
    return (
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e5e5e5',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '400px',
          height: 'fit-content'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e5e5e5',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#fafafa'
          }}>
            <button 
              onClick={() => setCurrentPage('products')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#007bff', 
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Back
            </button>
            <span style={{ fontWeight: '600', fontSize: '16px' }}>Checkout</span>
          </div>

          {/* Body */}
          <div style={{ padding: '20px' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
                <div style={{ fontSize: '16px', color: '#666' }}>Your cart is empty</div>
              </div>
            ) : (
              <>
                {/* Checkout Items */}
                {cart.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 0',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px'
                    }}>
                      {item.image}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>${item.price.toFixed(2)} each</div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      padding: '2px',
                      border: '1px solid #ddd'
                    }}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          background: 'white',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        −
                      </button>
                      <span style={{ fontSize: '13px', fontWeight: '600', minWidth: '16px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          background: 'white',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        +
                      </button>
                    </div>
                    <div style={{ fontWeight: '600', fontSize: '13px', minWidth: '50px', textAlign: 'right' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}

                {/* Price Summary */}
                <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '12px', marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                    <span>Subtotal</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontWeight: '700', 
                    fontSize: '14px',
                    paddingTop: '6px',
                    borderTop: '1px solid #e5e5e5'
                  }}>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setCurrentPage('payment')}
                  style={{
                    width: '100%',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '16px'
                  }}
                >
                  Continue to Payment →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Payment Page
  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e5e5e5',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '400px',
        height: 'fit-content'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e5e5e5',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: '#fafafa'
        }}>
          <button 
            onClick={() => setCurrentPage('checkout')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#007bff', 
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Back
          </button>
          <span style={{ fontWeight: '600', fontSize: '16px' }}>Secure Checkout</span>
        </div>

        {/* Body */}
        <div style={{ padding: '20px' }}>
          {/* Shipping Address */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Shipping Address</div>
            <input 
              type="text" 
              placeholder="Full Name"
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ddd', 
                borderRadius: '4px', 
                marginBottom: '6px',
                boxSizing: 'border-box'
              }} 
            />
            <input 
              type="text" 
              placeholder="Street Address"
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ddd', 
                borderRadius: '4px', 
                marginBottom: '6px',
                boxSizing: 'border-box'
              }} 
            />
            <div style={{ display: 'flex', gap: '6px' }}>
              <input 
                type="text" 
                placeholder="City"
                style={{ 
                  flex: 1, 
                  padding: '8px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }} 
              />
              <input 
                type="text" 
                placeholder="ZIP"
                style={{ 
                  width: '80px', 
                  padding: '8px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }} 
              />
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Payment Method</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                <input type="radio" name="payment" defaultChecked style={{ width: '14px', height: '14px' }} />
                Credit/Debit Card
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                <input type="radio" name="payment" style={{ width: '14px', height: '14px' }} />
                PayPal
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                <input type="radio" name="payment" style={{ width: '14px', height: '14px' }} />
                Xendit (E-Wallet, Bank Transfer)
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{
            background: '#f8f9fa',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '16px'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Order Summary</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666', marginBottom: '3px' }}>
              <span>Items ({getTotalItems()})</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666', marginBottom: '3px' }}>
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666', marginBottom: '3px' }}>
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '13px', 
              fontWeight: '700',
              paddingTop: '6px',
              borderTop: '1px solid #ddd'
            }}>
              <span>Total</span>
              <span>${(total + shipping).toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={() => {
              alert('Payment processing... This would integrate with Xendit payment gateway!')
              setCart([])
              setCurrentPage('products')
            }}
            style={{
              width: '100%',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Confirm & Pay ${(total + shipping).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  )
}