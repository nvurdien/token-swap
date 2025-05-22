// app/api/getTokenInfo/route.ts
import { getAssetErc20ByChainAndSymbol } from "@funkit/api-base";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const tokenInfo = await getAssetErc20ByChainAndSymbol({
      chainId: searchParams.get("chainId")!,
      symbol: searchParams.get("symbol")!,
      apiKey: process.env.FUN_API_KEY!,
    });

    return NextResponse.json(tokenInfo);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch token info" },
      { status: 500 }
    );
  }
}
