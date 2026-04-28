import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Tell Next.js this route is always dynamic (never statically generated)
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // Initialize inside the handler so it only runs at request time,
  // not during the build when env vars aren't available
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: '2025-02-24.acacia' as any,
  });

  try {
    const { productName } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: productName || 'VCV Web Solutions Package' },
            unit_amount: 49700,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vcv-web-solutions.vercel.app'}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vcv-web-solutions.vercel.app'}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
