import { Divider } from '@/components/divider'
import { Description, Field, Fieldset, Label } from '@/components/fieldset'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { Text } from '@/components/text'
import AuthGate from '@/components/auth-gate'
import { Metadata } from 'next'
import DeliveryRadio from './delivery-radio'
import CheckoutSummary from './checkout-summary'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Secure Stripe checkout for your order.',
  keywords: ['checkout', 'stripe', 'secure payment', 'ecommerce'],
}

export default function Page() {
  return (
    <AuthGate>
      <div className="container">
        <div className="mx-auto max-w-7xl pt-16 pb-24">
          <h2 className="sr-only">Checkout</h2>

          <form id="checkout-form" className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16 2xl:gap-x-20">
            <div>
              {/* Contact */}
              <div>
                <Heading fontSize="text-2xl font-medium text-zinc-950" level={3}>
                  <span data-slot="italic">Contact</span> information
                </Heading>

                <Field className="mt-10">
                  <Label>Email address</Label>
                  <Input type="email" name="email" required />
                  <Description>We&apos;ll send you a confirmation email when your order has shipped.</Description>
                </Field>
              </div>

              {/* Shipping */}
              <div className="mt-10 border-t border-zinc-200 pt-10">
                <Heading fontSize="text-2xl font-medium text-zinc-950" level={3}>
                  <span data-slot="italic">Shipping</span> information
                </Heading>
                <div className="mt-10 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <Field>
                    <Label>First name</Label>
                    <Input type="text" name="first-name" required />
                  </Field>

                  <Field>
                    <Label>Last name</Label>
                    <Input type="text" name="last-name" required />
                  </Field>

                  <Field className="sm:col-span-2">
                    <Label>Company (optional)</Label>
                    <Input type="text" name="company" />
                  </Field>

                  <Field className="sm:col-span-2">
                    <Label>Address</Label>
                    <Input type="text" name="address" required />
                  </Field>

                  <Field className="sm:col-span-2">
                    <Label>Apartment, suite, etc.</Label>
                    <Input type="text" name="apartment" />
                  </Field>

                  <Field>
                    <Label>City</Label>
                    <Input type="text" name="city" required />
                  </Field>

                  <Field>
                    <Label>Country</Label>
                    <Select className="mt-3 sm:col-span-2 sm:mt-0" name="country" required>
                      <option>Canada</option>
                      <option>Mexico</option>
                      <option>United States</option>
                    </Select>
                  </Field>

                  <Field>
                    <Label>State / Province</Label>
                    <Input type="text" name="region" />
                  </Field>

                  <Field>
                    <Label>Postal code</Label>
                    <Input type="text" name="postal-code" required />
                  </Field>

                  <Field className="sm:col-span-2">
                    <Label>Phone</Label>
                    <Input type="tel" name="phone" />
                  </Field>
                </div>
              </div>

              {/* Delivery */}
              <div className="mt-10 border-t border-zinc-200 pt-10">
                <Fieldset>
                  <Heading fontSize="text-2xl font-medium text-zinc-950" level={3}>
                    <span data-slot="italic">Delivery</span> method
                  </Heading>

                  <DeliveryRadio />
                </Fieldset>
              </div>

              {/* Payment */}
              <div className="mt-10 border-t border-zinc-200 pt-10">
                <Heading fontSize="text-2xl font-medium text-zinc-950" level={3}>
                  <span data-slot="italic">Payment</span> method
                </Heading>

                <input type="hidden" name="payment-method" value="Card" />
                <Text className="mt-4 max-w-xl text-sm/6 text-zinc-500">
                  Payments are processed securely by Stripe. After clicking Confirm order, you will be redirected to
                  Stripe Checkout to complete card payment.
                </Text>
              </div>
            </div>

            {/* Order summary */}
            <div className="mt-10 lg:mt-0">
              <Heading fontSize="text-2xl font-medium text-zinc-950" level={3}>
                <span data-slot="italic">Order</span> summary
              </Heading>

              <CheckoutSummary />
            </div>
          </form>
        </div> 
        <Divider />
      </div>
    </AuthGate>
  )
}