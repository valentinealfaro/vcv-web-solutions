import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: '2025-02-24.acacia' as any,
  });

  try {
    const { productName, amount } = await req.json();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vcv-web-solutions.vercel.app';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: productName || 'VCV Web Solutions Package' },
            unit_amount: amount || 9700, // cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/success`,
      cancel_url:  `${baseUrl}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
