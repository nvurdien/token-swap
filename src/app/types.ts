export interface Token {
  address: string;
  chain: string;
  decimals: number;
  name: string;
  symbol: string;
  unitPrice: number;
  amount: number;
  total: number;
}

export interface PriceInfo {
  price: number;
  // Add other relevant fields from API response
}
