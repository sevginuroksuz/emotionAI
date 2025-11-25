const HF_API_URL =
  'https://router.huggingface.co/hf-inference/models/tabularisai/multilingual-sentiment-analysis';


const HF_API_TOKEN = '*********************';

export async function analyzeTextWithAI(text) {
  try {
    console.log('HF request text =>', text);

    const res = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text,
      }),
    });

    const raw = await res.text();
    console.log('HF raw response =>', res.status, raw);

    if (!res.ok) {
      throw new Error(`HF error ${res.status}: ${raw}`);
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      throw new Error('Invalid JSON from HF: ' + e.message);
    }

    // Beklenen format: [[ { label, score }, { label, score }, ... ]]
    let label = '';
    if (Array.isArray(data) && Array.isArray(data[0]) && data[0].length > 0) {
      const candidates = data[0];
      // En yüksek skorlu label alma
      const top = candidates.reduce(
        (best, curr) => (curr.score > best.score ? curr : best),
        candidates[0],
      );
      label = (top.label || '').toLowerCase();
    } else if (Array.isArray(data) && data.length > 0 && data[0].label) {
      // Güvenlik için: [ { label, score } ] formatı da destekleniyor
      label = (data[0].label || '').toLowerCase();
    }

    let sentiment = 'neutral';
    if (label.includes('very positive') || label === 'positive' || label.includes('positive')) {
      sentiment = 'positive';
    } else if (
      label.includes('very negative') ||
      label === 'negative' ||
      label.includes('negative')
    ) {
      sentiment = 'negative';
    } else {
      sentiment = 'neutral';
    }

    let summary = '';
    let suggestion = '';

    if (sentiment === 'positive') {
      summary = 'Your mood seems clearly positive and uplifting.';
      suggestion = 'Enjoy this energy and maybe do something you love today.';
    } else if (sentiment === 'negative') {
      summary = 'Your text suggests a negative or heavy emotional tone.';
      suggestion =
        'Be kind to yourself. A short break, a walk, or talking to someone might help.';
    } else {
      summary = 'Your emotional tone appears balanced or close to neutral.';
      suggestion =
        'Taking a moment to reflect on your feelings may bring more clarity.';
    }

    return { sentiment, summary, suggestion };
  } catch (err) {
    console.log('AI error →', err?.message || err);

    return {
      sentiment: 'neutral',
      summary:
        'Unable to reach AI service or parse its response, showing a fallback message.',
      suggestion: 'Please try again in a little while.',
    };
  }
}
