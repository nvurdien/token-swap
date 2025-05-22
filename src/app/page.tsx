'use client';

import { Providers } from '@/components/DndProvider';
import { DropZone } from '@/components/DropZone';
import { TokenChip } from '@/components/TokenChip';
import { Token } from '../app/types';
import { useEffect, useState } from 'react';

export default function SwapPage() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [sourceToken, setSourceToken] = useState<Token | null>(null);
  const [targetToken, setTargetToken] = useState<Token | null>(null);
  const [sourceTokenAmount, setSourceTokenAmount] = useState<number | null>(null);
  const [targetTokenAmount, setTargetTokenAmount] = useState<number | null>(null);

  const availableTokens = tokens.filter(
    t => t.symbol !== sourceToken?.symbol && t.symbol !== targetToken?.symbol
  );

  useEffect(() => {
    const loadTokens = async () => {
      const initialTokens = [
        {
          chainId: '1',
          symbol: 'USDC',
        },
        {
          chainId: '137',
          symbol: 'USDT',
        },
        {
          chainId: '8453',
          symbol: 'ETH',
        },
        {
          chainId: '1',
          symbol: 'WBTC',
        },
      ]
      try {
        const tokenInfoResponses = await Promise.all(
          initialTokens.map(token =>
            fetch(`/api/getTokenInfo?chainId=${token.chainId}&symbol=${token.symbol}`)
          ));
        const tokensData = await Promise.all(tokenInfoResponses.map(res => res.json()));

        const tokenPriceResponses = await Promise.all(
          initialTokens.map((token, index) => fetch(`/api/getTokenPrice?chainId=${token.chainId}&address=${tokensData[index].address}`))
          );
        const tokensPriceData = await Promise.all(tokenPriceResponses.map(res => res.json()));
        
        // Repeat for other tokens or create dynamic loading
        setTokens(
          initialTokens.map((_, index) => ({
            ...tokensData[index],
            ...tokensPriceData[index],
          }))
        );
      } catch (error) {
        console.error('Error loading tokens:', error);
      }
    };

    loadTokens();
  }, []);

  useEffect(() => {
    if (sourceToken && targetToken) {
      const amount = (sourceTokenAmount || 1) / sourceToken.unitPrice;
      setTargetTokenAmount(amount * targetToken.unitPrice);
      setTargetToken({
        ...targetToken,
        amount: sourceToken.amount,
        total: sourceToken.amount * targetToken.unitPrice,
      });
    }
  }, [availableTokens.map(t => t.symbol).join('')]);

  const handleDrop = (
    draggedToken: Token | null,
    fromZone: 'source' | 'target' | undefined,
    toZone: 'source' | 'target'
  ) => {
    if (!draggedToken) {
      // Handle remove action
      if (toZone === 'source') setSourceToken(null);
      else setTargetToken(null);
      return;
    }

    if (fromZone) {
      // Swap between zones
      if (fromZone === 'source' && toZone === 'target') {
        setSourceToken(targetToken);
        setTargetToken(draggedToken);
      } else if (fromZone === 'target' && toZone === 'source') {
        setTargetToken(sourceToken);
        setSourceToken(draggedToken);
      }
    } else {
      // From available to zone
      if (toZone === 'source') {
        setSourceToken(draggedToken);
      } else {
        setTargetToken(draggedToken);
      }
    }
  };

  const updateAmounts = (value: number, type: 'source' | 'target') => {
    if (sourceToken && targetToken) {
      if (type === 'source') {
        setSourceTokenAmount(value);
        const amount = value / sourceToken.unitPrice;
        const total = amount * targetToken.unitPrice;
        setTargetTokenAmount(total);

      }
      if (type === 'target') {
        setTargetTokenAmount(value);
        const amount = value / targetToken.unitPrice;
        const total = amount * sourceToken.unitPrice;
        setSourceTokenAmount(total);
      }
      setSourceToken({
        ...sourceToken,
        amount: sourceToken.amount,
        total: sourceToken.amount * sourceToken.unitPrice,
      });
      setTargetToken({
        ...targetToken,
        amount: sourceToken.amount,
        total: sourceToken.amount * targetToken.unitPrice,
      });
    }
  }

  return (
    <Providers>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 dark:text-white">
            Token Exchange Calculator
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className='mb-6'>
              <h3 className="text-lg font-semibold dark:text-white">
                Available Tokens
              </h3>
              <p className='mb-4'>
                Drag and drop tokens to the left or right to see their exchange rate.
              </p>
              <div className={`flex flex-wrap gap-2 ${availableTokens.length > 0 ? '' : 'animate-pulse'}`}>
                {
                  availableTokens.length > 0 ? 
                  availableTokens.map((token) => (
                    <TokenChip key={token.symbol} token={token} />
                  )) :
                    (
                      <>
                        <div className="h-10 w-23 rounded-full dark:bg-gray-700"></div>
                        <div className="h-10 w-23 rounded-full dark:bg-gray-700"></div>
                        <div className="h-10 w-23 rounded-full dark:bg-gray-700"></div>
                        <div className="h-10 w-23 rounded-full dark:bg-gray-700"></div>
                      </>
                    )
                }
              </div>
            </div>

            <div className="flex items-center justify-center md:gap-8 md:flex-nowrap flex-wrap">
              <div className='h-48'>
                <DropZone 
                  type="source" 
                  token={sourceToken} 
                  onDrop={handleDrop}
                />
                {
                  sourceToken && (
                    <input
                      type="number"
                      placeholder={`Enter ${sourceToken.symbol} amount`}
                      className="md:w-full w-52 p-2 mt-2 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      onChange={(e) => updateAmounts(parseFloat(e.target.value), 'source')}
                      value={sourceTokenAmount || ''}
                      min="0"
                    />
                  )
                }
              </div>
              <div className="text-2xl text-gray-500 dark:text-gray-400 mb-17 md:block hidden">→</div>
              <div className="text-2xl text-gray-500 dark:text-gray-400 mb-9 md:hidden block basis-full text-center">↓</div>
              <div className='h-48'>
                <DropZone 
                  type="target" 
                  token={targetToken} 
                  onDrop={handleDrop}
                />
                {
                  targetToken && (
                    <input
                      type="number"
                      placeholder={`Enter ${targetToken.symbol} amount`}
                      className="md:w-full w-52 p-2 mt-2 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      onChange={(e) => updateAmounts(parseFloat(e.target.value), 'target')}
                      value={targetTokenAmount || ''}
                      min="0"
                    />
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </Providers>
  );
}
