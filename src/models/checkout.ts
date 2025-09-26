import mongoose from 'mongoose'

export interface ICheckoutItem {
  productId: string
  quantity: number
  price: number
  name: string
}

export interface ICheckout {
  _id?: string
  items: ICheckoutItem[]
  total: number
  tax: number
  shipping: number
  grandTotal: number
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED'
  customerInfo?: {
    name?: string
    email?: string
    address?: string
    city?: string
    zipCode?: string
  }
  createdAt?: Date
  updatedAt?: Date
}

const CheckoutItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  name: {
    type: String,
    required: true
  }
}, { _id: false })

const CheckoutSchema = new mongoose.Schema(
  {
    items: {
      type: [CheckoutItemSchema],
      required: true,
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    tax: {
      type: Number,
      required: true,
      min: 0
    },
    shipping: {
      type: Number,
      required: true,
      min: 0
    },
    grandTotal: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'PAID', 'CANCELLED', 'EXPIRED'],
      default: 'PENDING'
    },
    customerInfo: {
      name: String,
      email: String,
      address: String,
      city: String,
      zipCode: String
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Checkout || mongoose.model('Checkout', CheckoutSchema)