export interface TranscriptLine {
  id: string
  start: number // in seconds
  end: number
  speaker?: string
  hi: string
  en: string
}

export const sampleTranscripts: Record<string, TranscriptLine[]> = {
  'gully-se-world-cup': [
    {
      id: 't-1',
      start: 0,
      end: 6,
      speaker: 'Host (अनुज)',
      hi: 'नमस्ते दोस्तों! कॉर्नर कोना के विशेष पॉडकास्ट में आपका स्वागत है।',
      en: 'Hello friends! Welcome to this special podcast on Corner Kona.',
    },
    {
      id: 't-2',
      start: 6,
      end: 14,
      speaker: 'Host (अनुज)',
      hi: 'आज हम बात कर रहे हैं उन गलियों की, जहाँ न कोई टर्फ था, न लेदर बॉल, सिर्फ़ एक टूटी हुई लकड़ी और अटूट हौसला था।',
      en: 'Today we talk of those alleyways where there were no turf pitches or leather balls—only a broken wooden bat and unbroken grit.',
    },
    {
      id: 't-3',
      start: 14,
      end: 22,
      speaker: 'Guest (आकाश शर्मा)',
      hi: 'बिल्कुल अनुज। छोटे शहरों से निकलकर नीली जर्सी तक पहुँचना सिर्फ़ खेल नहीं, पूरे परिवार का त्याग होता है।',
      en: 'Absolutely Anuj. Rising from small towns to the Indian blue jersey is not just a game; it is the sacrifice of an entire family.',
    },
    {
      id: 't-4',
      start: 22,
      end: 32,
      speaker: 'Host (अनुज)',
      hi: '2008 में जब रांची का एक लड़का अंतरराष्ट्रीय मंच पर छा गया, तब देश के हर नुक्कड़ पर यह यक़ीन जागा कि हम भी कर सकते हैं।',
      en: 'In 2008, when a boy from Ranchi took over the international stage, every corner of the country realized: we can do this too.',
    },
    {
      id: 't-5',
      start: 32,
      end: 42,
      speaker: 'Guest (आकाश शर्मा)',
      hi: 'आज की तारीख़ में 70% भारतीय स्क्वाड टीयर-2 और टीयर-3 शहरों से आ रहा है। यह भारतीय खेल का स्वर्णिम दौर है।',
      en: 'Today, over 70% of the Indian squad hails from Tier-2 and Tier-3 towns. This is truly the golden era of Indian sports.',
    },
    {
      id: 't-6',
      start: 42,
      end: 54,
      speaker: 'Host (अनुज)',
      hi: 'आइए सुनते हैं उस कोच की ज़ुबानी, जिसने अपनी साइकिल बेचकर एक होनहार गेंदबाज़ को पहली स्पाइक वाली जूते दिलाए थे...',
      en: 'Let us listen to the coach who sold his bicycle just to buy the first pair of spiked shoes for a promising fast bowler...',
    },
  ],

  'mann-ka-maun': [
    {
      id: 'm-1',
      start: 0,
      end: 8,
      speaker: 'ऋषि वाणी (Narrator)',
      hi: 'ॐ शांतिः शांतिः शांतिः। अंतर यात्रा में आपका स्वागत है।',
      en: 'Om Shanti, Shanti, Shanti. Welcome to Antar Yatra (The Inner Journey).',
    },
    {
      id: 'm-2',
      start: 8,
      end: 18,
      speaker: 'ऋषि वाणी (Narrator)',
      hi: 'आँखें बंद करें। गहरी सांस लें। बाहर का सारा शोर अब पीछे छूट रहा है।',
      en: 'Close your eyes. Take a deep breath. All the noise of the outside world is now left behind.',
    },
    {
      id: 'm-3',
      start: 18,
      end: 30,
      speaker: 'ऋषि वाणी (Narrator)',
      hi: 'मन जब विचारों की लहरों से मुक्त होता है, तभी चेतना का असली प्रकाश प्रकट होता है।',
      en: 'When the mind becomes free from the turbulent waves of thoughts, only then does the true light of consciousness dawn.',
    },
    {
      id: 'm-4',
      start: 30,
      end: 42,
      speaker: 'ऋषि वाणी (Narrator)',
      hi: 'मौन कोई शून्यता नहीं है; मौन समस्त सृजन का बीज है। अपने भीतर के मौन को सुनें।',
      en: 'Silence is not an emptiness; silence is the very seed of creation. Listen to the silence within.',
    },
    {
      id: 'm-5',
      start: 42,
      end: 56,
      speaker: 'ऋषि वाणी (Narrator)',
      hi: 'सांस भीतर आ रही है — ऊर्जा। सांस बाहर जा रही है — समर्पण। हर क्षण में स्वयं को स्थित करें।',
      en: 'Breath comes in — vitality. Breath goes out — surrender. Rest yourself in this sacred present moment.',
    },
  ],

  'parde-ke-peeche': [
    {
      id: 'p-1',
      start: 0,
      end: 7,
      speaker: 'Music Producer',
      hi: 'एक क्लासिक धुन कभी प्लान करके नहीं बनती। वह बस एक लम्हे में उतरती है।',
      en: 'A timeless melody is never planned. It simply descends upon you in an inspired moment.',
    },
    {
      id: 'p-2',
      start: 7,
      end: 16,
      speaker: 'Host',
      hi: 'हम बात कर रहे हैं 90 के दशक के उस जादुई संगीत सत्र की, जहाँ लगातार 36 घंटे बिना सोए रिकॉर्डिंग हुई।',
      en: 'We are revisiting that magical 90s studio session where recording went on for 36 continuous sleepless hours.',
    },
    {
      id: 'p-3',
      start: 16,
      end: 28,
      speaker: 'Music Producer',
      hi: 'हारमोनियम की पहली तान बजी और लता जी ने कहा — इस स्वर में कुछ अधूरा है, इसे फिर से करो।',
      en: 'The first chord played on the harmonium, and the legend said: something is missing in this note, let us begin again.',
    },
    {
      id: 'p-4',
      start: 28,
      end: 40,
      speaker: 'Host',
      hi: 'और वही री-टेक आगे चलकर भारतीय सिनेमा का अमर गीत बन गया।',
      en: 'And that very retake went on to become an immortal classic in the history of Indian cinema.',
    },
  ],
}

/**
 * Returns synchronized transcript lines for any episode slug.
 * Generates an intelligent contextual transcript if a dedicated custom transcript is not present.
 */
export function getTranscriptForSlug(slug: string, titleHi: string, titleEn: string): TranscriptLine[] {
  if (sampleTranscripts[slug]) {
    return sampleTranscripts[slug]
  }

  // Contextual fallback transcript generator
  return [
    {
      id: 'gen-1',
      start: 0,
      end: 8,
      speaker: 'Corner Kona Host',
      hi: `नमस्ते! कॉर्नर कोना के इस विशेष संस्करण में आपका स्वागत है: ${titleHi}`,
      en: `Welcome to this special Corner Kona presentation: ${titleEn}`,
    },
    {
      id: 'gen-2',
      start: 8,
      end: 18,
      speaker: 'Host & Analyst',
      hi: 'हम इस विषय की गहराइयों में उतर रहे हैं ताकि हर पहलू को सरल भाषा में समझा सकें।',
      en: 'We are diving deep into this topic to unpack every dimension in clean, accessible language.',
    },
    {
      id: 'gen-3',
      start: 18,
      end: 30,
      speaker: 'Key Insights',
      hi: 'इस कहानी के माध्यम से आप जानेंगे वो बातें जो आमतौर पर हेडलाइंस में छूट जाती हैं।',
      en: 'Through this story, you will discover the nuances that often get overlooked in mainstream headlines.',
    },
    {
      id: 'gen-4',
      start: 30,
      end: 45,
      speaker: 'Narrator',
      hi: 'विचार, दृष्टिकोण और असली आवाज़ें — सिर्फ़ कॉर्नर कोना पर। सुनते रहिए।',
      en: 'Perspectives, depth, and authentic voices — only on Corner Kona. Stay tuned.',
    },
  ]
}
