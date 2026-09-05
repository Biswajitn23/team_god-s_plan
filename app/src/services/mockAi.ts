export async function generateMockAnswer(prompt: string): Promise<{ text: string }> {
  const p = prompt.toLowerCase();
  
  if (p.includes('hello') || p.includes('hi')) {
    return { text: "Hello! I am AyuSetu's offline assistant. It seems my AI services are currently resting, but I can still help with basic questions about Ayurvedic farming." };
  }
  
  if (p.includes('help')) {
    return { text: "You can manage your herb batches in the 'Overview' tab, sell them in the 'Sell' tab, and check your records in 'History'. If you need technical help, please contact support." };
  }

  if (p.includes('price') || p.includes('market')) {
    return { text: "Current market rates for herbs like Ashwagandha and Tulsi are available in the 'Sell' tab. Check the real-time tickers there." };
  }

  return { text: "I'm currently operating in basic mode. I can still help you with herb batches, marketplace selling, and history. How can I assist you today?" };
}
