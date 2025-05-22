// app/api/getTokenPrice/route.ts
import { getAssetPriceInfo } from "@funkit/api-base";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const priceData = await getAssetPriceInfo({
      chainId: searchParams.get("chainId")!,
      assetTokenAddress: searchParams.get("address")!,
      apiKey: process.env.FUN_API_KEY!,
    });

    return NextResponse.json(priceData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch token price" },
      { status: 500 }
    );
  }
}
