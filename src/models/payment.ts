import mongoose from 'mongoose'

export interface IPayment {
  _id?: string
  checkoutId: string
  xenditInvoiceId: string
  xenditInvoiceUrl?: string
  amount: number
  currency: string
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED' | 'CANCELLED'
  paymentMethod?: string
  paidAt?: Date
  xenditWebhookId?: string
  metadata?: Record<string, any>
  createdAt?: Date
  updatedAt?: Date
}

const PaymentSchema = new mongoose.Schema(
  {
    checkoutId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Checkout',
      required: true,
      unique: true
    },
    xenditInvoiceId: {
      type: String,
      required: true,
      unique: true
    },
    xenditInvoiceUrl: {
      type: String
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      required: true,
      default: 'IDR'
    },
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'PAID', 'EXPIRED', 'FAILED', 'CANCELLED'],
      default: 'PENDING'
    },
    paymentMethod: {
      type: String
    },
    paidAt: {
      type: Date
    },
    xenditWebhookId: {
      type: String
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema)