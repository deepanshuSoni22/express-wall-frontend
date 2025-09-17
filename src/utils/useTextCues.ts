import { useMemo } from "react";

export function useTextCues(text, config = {}) {
  const DEFAULTS = { topNKeywords: 8, wpm: 200 };
  const { topNKeywords, wpm } = { ...DEFAULTS, ...config };

  const STOPWORDS = new Set("a an and the is are am to of in on for with at as by from this that these those be been being was were it its it's we're you're they're i you he she we they them us our your their my mine yours his her hers ours theirs do does did doing done not no yes or but if then so than too very just really".split(/\s+/));
  const POS = new Set("good great excellent awesome kind love like happy smile calm helpful inspiring brilliant smart beautiful win progress improve growth learn".split(/\s+/));
  const NEG = new Set("bad worse worst sad angry hate upset tired fail failure problem issue broken stuck anxious toxic crisis".split(/\s+/));
  const PROFANITY = new Set(["damn","shit","fuck","fucking","bastard","asshole","bitch"]);
  const TOPIC_HINTS = {
    kindness: ["smile","kind","help","support","gratitude","thanks"],
    productivity: ["focus","goal","habit","plan","task","deadline","ship","build"],
    learning: ["learn","study","practice","course","read","experiment"],
    community: ["team","together","we","community","share"],
    wellness: ["health","sleep","walk","run","breathe","calm","stress"],
  };
  const EMOJI_RE = /[\u231A-\u231B\u23E9-\u23FA\u2600-\u27BF\uFE0F]|[\uD83C-\uDBFF][\uDC00-\uDFFF]/g;
  const URL_RE = /\bhttps?:\/\/[^\s)]+/gi;
  const HASHTAG_RE = /(^|\s)#([a-z0-9_]{2,})\b/gi;
  const MENTION_RE = /(^|\s)@([a-z0-9_]{2,})\b/gi;
  const LANG_GUESS = [
    { lang: "hi/devanagari", re: /[\u0900-\u097F]/ },
    { lang: "ta/tamil", re: /[\u0B80-\u0BFF]/ },
    { lang: "ml/malayalam", re: /[\u0D00-\u0D7F]/ },
    { lang: "kn/kannada", re: /[\u0C80-\u0CFF]/ },
    { lang: "te/telugu", re: /[\u0C00-\u0C7F]/ },
    { lang: "bn/bengali", re: /[\u0980-\u09FF]/ },
    { lang: "gu/gujarati", re: /[\u0A80-\u0AFF]/ },
    { lang: "pa/gurmukhi", re: /[\u0A00-\u0A7F]/ },
    { lang: "or/odia", re: /[\u0B00-\u0B7F]/ },
    { lang: "si/sinhala", re: /[\u0D80-\u0DFF]/ },
    { lang: "en/latin-ish", re: /[A-Za-z]/ },
  ];

  const tokenize = (t) => t.toLowerCase()
    .replace(/[\u2018\u2019']/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);

  const sentenceSplit = (t) => t.split(/(?<=[\.!\?।])\s+/).filter((s) => s.trim().length);
  const topNFreq = (arr, n) => {
    const m = new Map();
    for (const w of arr) m.set(w, (m.get(w) || 0) + 1);
    return [...m.entries()].sort((a,b)=>b[1]-a[1]).slice(0,n).map(([term,count])=>({term,count}));
  };
  const guessLanguage = (t) => (LANG_GUESS.find(({re})=>re.test(t))?.lang ?? "unknown");
  const getTopicTags = (words) => {
    const tags = new Set();
    for (const [tag, keys] of Object.entries(TOPIC_HINTS)) {
      for (const k of keys) if (words.includes(k)) { tags.add(tag); break; }
    }
    return [...tags];
  };
  const getSentiment = (words) => {
    let score = 0;
    for (const w of words) { if (POS.has(w)) score++; if (NEG.has(w)) score--; }
    const label = score > 1 ? "positive" : score < -1 ? "negative" : "neutral";
    return { score, label };
  };
  const hasProfanity = (words) => words.some((w) => PROFANITY.has(w));

  return useMemo(() => {
    const raw = (text || "").trim();
    if (!raw) {
      return {
        ok: true, chars: 0, words: 0, sentences: 0, avgWordLen: 0, readingTimeSec: 0,
        sentiment: { score: 0, label: "neutral" }, keywords: [], hashtags: [],
        mentions: [], urls: [], emojiCount: 0, hasQuestion: false, language: "unknown",
        profanityFlag: false, topicTags: [], diagnostic: { empty: true },
      };
    }
    const sentences = sentenceSplit(raw);
    const tokens = tokenize(raw);
    const words = tokens.length;
    const avgWordLen = words ? tokens.join("").length / words : 0;
    const readingTimeSec = Math.round((words / wpm) * 60);

    const urls = raw.match(URL_RE) || [];
    const hashtags = [...raw.matchAll(HASHTAG_RE)].map((m)=>m[2].toLowerCase());
    const mentions = [...raw.matchAll(MENTION_RE)].map((m)=>m[2].toLowerCase());
    const emojis = raw.match(EMOJI_RE) || [];
    const hasQuestion = /\?/.test(raw);
    const language = guessLanguage(raw);

    const contentWords = tokens.filter((w)=>!STOPWORDS.has(w) && w.length>=3);
    const keywords = topNFreq(contentWords, topNKeywords);
    const sentiment = getSentiment(tokens);
    const profanityFlag = hasProfanity(tokens);
    const topicTags = getTopicTags(tokens);

    return {
      ok: true,
      chars: raw.length,
      words,
      sentences: sentences.length,
      avgWordLen: Number(avgWordLen.toFixed(2)),
      readingTimeSec,
      sentiment,
      keywords,
      hashtags,
      mentions,
      urls,
      emojiCount: emojis.length,
      hasQuestion,
      language,
      profanityFlag,
      topicTags,
      diagnostic: { truncated: false },
    };
  }, [text, topNKeywords, wpm]);
}