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

    const systemInstruction = `You are "TeaGo Dost", a super friendly, cheerful cafe buddy and personal tea expert for "TeaGo Artisanal Cafe".
The customer is sitting at Table ${tableNumber || '01'} ordering from their phone. Talk to them like a close friend / best buddy sitting right across the table!

FRIENDLY PERSONA GUIDELINES:
1. TONE: Warm, friendly, enthusiastic, relatable, respectful yet casual — like a food-loving buddy (use friendly words like "Arre dost", "Bhai", "Yaar", "Batao kya mood hai aaj", "Ek number cheez batata hoon!").
2. GREETINGS: When they say "Hello", "Hi", "Namaste", "Hey", greet them with high energy and warmth:
   (e.g., "Arre hello dost! Kaise ho? Table ${tableNumber || '01'} par swagat hai! Batao aaj kya peene ya khane ka man hai — ek garam kadak chai ho jaye ya kuch crispy snack?")
3. LANGUAGE:
   - If they ask in Hindi/Hinglish (e.g. "kuch achha batao", "chai pilao", "sasta combo", "kya special hai"), reply in natural, fun, conversational Hinglish!
   - If they ask in English, reply in warm, cheerful, friendly conversational English with the same buddy vibe.
4. HONEST SUGGESTIONS: Give genuine foodie recommendations! Mention exact item names and prices in ₹ (e.g. "Special Kulhad Masala Chai sirf ₹45 me").
5. PAIRINGS: Suggest classic combos like Chai + Samosa, Filter Coffee + Sandwich, Kadak Adrak Chai + Maska Bun.
6. JSON OUTPUT FORMAT:
   - "reply": 2-3 fun, appetizing, friendly sentences directly answering their craving like a best friend.
   - "suggestedDrinkIds": Array of matching product IDs from the catalog below so they can 1-tap add to order.

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
  
  // 1. GREETINGS (Hello, Hi, Hey, Namaste, etc.)
  const isGreeting = /^(hello|hi|hey|heyy|namaste|namaskar|pranam|good\s*(morning|evening|afternoon)|hola|kaise\s*ho|yo|hii|hiii)\b/i.test(lower) ||
    lower === 'hello' || lower === 'hi' || lower === 'hey' || lower === 'namaste';

  if (isGreeting) {
    return {
      reply: `Arre hello dost! Kaise ho? Table ${tableNumber} par swagat hai! Batao aaj kya peene ya khane ka mood hai — ek kadak kulhad chai lagayein ya kuch mast crispy snack? ☕✨`,
      suggestedDrinkIds: ['tg-01', 'tg-08', 'tg-04']
    };
  }

  // 2. GRATITUDE / THANKS INTENTS
  if (lower.includes('thank') || lower.includes('shukriya') || lower.includes('dhanyawad') || lower.includes('thx')) {
    return {
      reply: `Arre welcome mere bhai! 😊 Table ${tableNumber} par aaram se enjoy karo. Kuch aur chahiye ho to bas bata dena, apun hamesha haazir hai!`,
      suggestedDrinkIds: []
    };
  }

  // 3. BESTSELLER / SPECIAL INQUIRIES
  if (lower.includes('special') || lower.includes('bestseller') || lower.includes('popular') || lower.includes('kya achha hai') || lower.includes('recommend') || lower.includes('kuch achha')) {
    return {
      reply: `Dost, bina soche hamari Special Kulhad Masala Chai (₹45) ke sath Garama-Garam Crispy Samosa (₹50) ya Irani Maska Bun (₹45) order kar lo, din ban jayega! 😋`,
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
      reply: `Bhai tumhari pasand ke hisab se hamara fresh ${namesWithPrices} ekdum perfect rahega! Table ${tableNumber} par garam-garam bhejte hain!`,
      suggestedDrinkIds: topMatches.map(p => p.id)
    };
  }

  if (lower.includes('100') || lower.includes('budget') || lower.includes('cheap') || lower.includes('sasta') || lower.includes('combo')) {
    return {
      reply: `Arre budget ki fikar mat karo! Hamari Special Kulhad Masala Chai (₹45) aur Crispy Samosa (₹50) dono milakar sirf ₹95 me ho jayega! Ekdum solid combo hai! 🚀`,
      suggestedDrinkIds: ['tg-01', 'tg-08']
    };
  }

  if (lower.includes('coffee') || lower.includes('filter') || lower.includes('cold') || lower.includes('cappuccino')) {
    return {
      reply: `Coffee lover ho dost? To fir South Indian Filter Coffee (₹60) ya thick wali Cold Coffee (₹110) try karo — mood ekdum fresh ho jayega! ☕🧊`,
      suggestedDrinkIds: ['tg-04', 'tg-06']
    };
  }

  if (lower.includes('chai') || lower.includes('tea') || lower.includes('kadak') || lower.includes('masala') || lower.includes('ginger') || lower.includes('adrak')) {
    return {
      reply: `Bhai chai ke shaukeen ho to hamari Adrak Elaichi Kadak Chai (₹40) ya Special Kulhad Chai (₹45) try karo, ek ghoont me dil khush ho jayega! 🍵`,
      suggestedDrinkIds: ['tg-01', 'tg-02']
    };
  }

  if (lower.includes('snack') || lower.includes('khana') || lower.includes('food') || lower.includes('samosa') || lower.includes('pakoda') || lower.includes('sandwich') || lower.includes('bun')) {
    return {
      reply: `Kuch chatpata khana hai? Crispy Samosa (₹50), Irani Maska Bun (₹45), ya Grilled Cheese Corn Sandwich (₹110) try karo, zabardast swaad hai! 🥪✨`,
      suggestedDrinkIds: ['tg-08', 'tg-09', 'tg-10']
    };
  }

  return {
    reply: `Batao dost, Table ${tableNumber} ke liye kya layein? Chai, Cold coffee, Snacks ya koi mast budget combo? Jo bologe sab badhiya milega! 😊`,
    suggestedDrinkIds: ['tg-01', 'tg-08', 'tg-04']
  };
}
