import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: '2025-02-24.acacia' as any,
  });

  try {
    const { productName, amount, setupFee, setupFeeName } = await req.json();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vcv-web-solutions.vercel.app';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lineItems: any[] = [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: productName || 'VCV Web Solutions Package' },
          unit_amount: amount || 9700,
        },
        quantity: 1,
      },
    ];

    // Optional one-time setup fee added as a separate line item
    if (typeof setupFee === 'number' && setupFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: setupFeeName || 'One-Time Setup Fee',
            description: 'Includes phone setup, Nova training, website launch',
          },
          unit_amount: setupFee,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
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
