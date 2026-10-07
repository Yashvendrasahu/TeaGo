import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

export const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export const isGeminiConfigured = Boolean(apiKey && apiKey.length > 5);

/**
 * Ask AI Sommelier for food, chai, snack and combo recommendations
 */
export async function askAiSommelier({ prompt, tableNumber, availableProducts, userPreferences }) {
  if (!isGeminiConfigured) {
    // Graceful intelligent fallback when running without API key
    return fallbackSommelierResponse(prompt, availableProducts, tableNumber);
  }

  try {
    const simplifiedMenu = (availableProducts || []).map(p => ({
      id: p.id,
      name: p.name,
      category: p.categoryName || p.category,
      price: `₹${p.price}`,
      description: p.description,
      tags: p.dietaryTags || [],
      isVeg: p.isVeg,
      isBestseller: p.isBestseller
    }));

    const systemInstruction = `You are "TeaGo AI Sommelier", a warm, polite and knowledgeable digital tea master and dining assistant for "TeaGo Artisanal Cafe".
The diner is seated at Table ${tableNumber || '01'} and is interacting through the digital table ordering menu.

CONVERSATION & GREETING RULES:
1. GREETING: If the customer says "Hello", "Hi", "Hey", "Namaste", "Good morning/evening", etc., greet them warmly (e.g., "Hello! Namaste 🙏 Welcome to TeaGo Table ${tableNumber || '01'}! How can I help you today? Would you like a warm cup of authentic Chai, an artisanal coffee, or some crispy snacks?").
2. LANGUAGE: If the customer writes in Hindi or Hinglish (e.g., "kya achha hai", "chai batao", "namaste"), reply in natural, welcoming Hinglish/Hindi. If in English, reply in English.
3. ACCURACY: Recommend ONLY items that exist in the CURRENT RESTAURANT MENU CATALOG provided below with their exact prices in ₹.
4. SPECIFICITY: If they ask for budget options, recommend combos with exact totals. If they ask about caffeine or sugar, provide accurate dietary info.
5. In your response JSON, return:
   - "reply": 2-3 sentences answering directly what the customer asked in a warm, appetizing tone.
   - "suggestedDrinkIds": Array of exact product IDs from the catalog (e.g. ["tg-01", "tg-08"]).

CURRENT RESTAURANT MENU CATALOG:
${JSON.stringify(simplifiedMenu, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Customer Question: "${prompt}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.6
      }
    });

    const text = response.text;
    if (text) {
      try {
        const parsed = JSON.parse(text);
        return {
          reply: parsed.reply || text,
          suggestedDrinkIds: Array.isArray(parsed.suggestedDrinkIds) ? parsed.suggestedDrinkIds : []
        };
      } catch {
        return {
          reply: text,
          suggestedDrinkIds: []
        };
      }
    }

    return fallbackSommelierResponse(prompt, availableProducts, tableNumber);
  } catch (error) {
    console.error('Gemini API Sommelier Error:', error);
    return fallbackSommelierResponse(prompt, availableProducts, tableNumber);
  }
}

/**
 * Generate appetizing description and tasting notes for a new menu item
 */
export async function generateMenuDescription({ name, category, price, isVeg }) {
  if (!isGeminiConfigured) {
    return {
      description: `Delicious artisanal ${name} handcrafted fresh with premium ingredients.`,
      tastingNotes: 'Aromatic, rich flavor with a smooth finish.',
      prepTime: '4-5 mins'
    };
  }

  try {
    const prompt = `Write an appetizing menu description, tasting notes, and estimated prep time for a new cafe menu item:
Item Name: ${name}
Category: ${category}
Price: ₹${price}
Vegetarian: ${isVeg ? 'Yes' : 'No'}

Respond in JSON with:
{
  "description": "Appetizing 2-3 sentence description emphasizing freshness, aroma, and authentic taste",
  "tastingNotes": "Short 4-6 word flavor profile (e.g., 'Rich spicy warmth, aromatic cardamom, creamy malt finish')",
  "prepTime": "e.g. 4-5 mins"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error('Gemini API Description Error:', error);
    return {
      description: `Delicious artisanal ${name} handcrafted fresh with premium ingredients.`,
      tastingNotes: 'Aromatic, rich flavor with a smooth finish.',
      prepTime: '4-5 mins'
    };
  }
}

function fallbackSommelierResponse(prompt, products = [], tableNumber = '01') {
  const lower = (prompt || '').trim().toLowerCase();
  
  // 1. GREETING INTENTS (e.g. Hello, Hi, Hey, Namaste, Good morning, etc.)
  const isGreeting = /^(hello|hi|hey|heyy|namaste|namaskar|pranam|good\s*(morning|evening|afternoon)|hola|kaise\s*ho|yo|hii|hiii)\b/i.test(lower) ||
    lower === 'hello' || lower === 'hi' || lower === 'hey' || lower === 'namaste';

  if (isGreeting) {
    return {
      reply: `Hello! Namaste 🙏 Welcome to TeaGo Table ${tableNumber}! How can I assist you today? Would you like a piping hot cup of Kadak Chai, an artisanal Coffee, or some crispy Snacks?`,
      suggestedDrinkIds: ['tg-01', 'tg-04', 'tg-08']
    };
  }

  // 2. GRATITUDE / THANKS INTENTS
  if (lower.includes('thank') || lower.includes('shukriya') || lower.includes('dhanyawad') || lower.includes('thx')) {
    return {
      reply: `You're very welcome! 😊 Enjoy your time at TeaGo Table ${tableNumber}. Let me know if you need anything else!`,
      suggestedDrinkIds: []
    };
  }

  // 3. BESTSELLER / SPECIAL INQUIRIES
  if (lower.includes('special') || lower.includes('bestseller') || lower.includes('popular') || lower.includes('kya achha hai') || lower.includes('recommend')) {
    return {
      reply: `Our top cafe specials for Table ${tableNumber} are the Special Kulhad Masala Chai (₹45), Irani Maska Bun (₹45), and Crispy Samosas (₹50)!`,
      suggestedDrinkIds: ['tg-01', 'tg-09', 'tg-08']
    };
  }

  // 4. Intelligent dynamic product matching based on actual catalog
  const matchingProducts = products.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(lower);
    const catMatch = (p.categoryName || p.category || '').toLowerCase().includes(lower);
    const descMatch = (p.description || '').toLowerCase().includes(lower);
    const tagMatch = (p.dietaryTags || []).some(t => t.toLowerCase().includes(lower));
    return nameMatch || catMatch || descMatch || tagMatch;
  });

  if (matchingProducts.length > 0) {
    const topMatches = matchingProducts.slice(0, 3);
    const namesWithPrices = topMatches.map(p => `${p.name} (₹${p.price})`).join(', ');
    return {
      reply: `Based on your request, I recommend our fresh ${namesWithPrices}. They are freshly prepared for Table ${tableNumber}!`,
      suggestedDrinkIds: topMatches.map(p => p.id)
    };
  }

  if (lower.includes('100') || lower.includes('budget') || lower.includes('cheap') || lower.includes('sasta') || lower.includes('combo')) {
    return {
      reply: `For great value under ₹100, our Special Kulhad Masala Chai (₹45) paired with Crispy Samosas (₹50) is only ₹95 total!`,
      suggestedDrinkIds: ['tg-01', 'tg-08']
    };
  }

  if (lower.includes('coffee') || lower.includes('filter') || lower.includes('cold') || lower.includes('cappuccino')) {
    return {
      reply: `For coffee lovers, our Classic South Indian Filter Coffee (₹60) and Signature Thick Cold Coffee (₹110) are the top picks!`,
      suggestedDrinkIds: ['tg-04', 'tg-06']
    };
  }

  if (lower.includes('chai') || lower.includes('tea') || lower.includes('kadak') || lower.includes('masala') || lower.includes('ginger') || lower.includes('adrak')) {
    return {
      reply: `Our Special Kulhad Masala Chai (₹45) and Adrak Elaichi Kadak Chai (₹40) are brewed fresh with organic ginger and cardamom.`,
      suggestedDrinkIds: ['tg-01', 'tg-02']
    };
  }

  if (lower.includes('snack') || lower.includes('khana') || lower.includes('food') || lower.includes('samosa') || lower.includes('pakoda') || lower.includes('sandwich') || lower.includes('bun')) {
    return {
      reply: `For tasty quick bites, try our Crispy Samosas (₹50), Irani Maska Bun (₹45), or Grilled Cheese Corn Sandwich (₹110)!`,
      suggestedDrinkIds: ['tg-08', 'tg-09', 'tg-10']
    };
  }

  return {
    reply: `I can help you explore our authentic teas, coffees, snacks, and combos for Table ${tableNumber}. What flavors or items are you in the mood for?`,
    suggestedDrinkIds: ['tg-01', 'tg-08', 'tg-04']
  };
}
