// Rule-based local bot engine. Message content is loaded from repository JSON; no AI API is used.
let libraryPromise = null;
let library = null;
const usedLines = new Map();
const CATEGORIES = ["general","study","career","relationships","emotions","confidence","habits","creativity","social","fun"];

export async function loadBotLibrary() {
  if (library) return library;
  if (!libraryPromise) {
    libraryPromise = fetch(new URL("./bot-library.json", import.meta.url), {cache:"no-store"})
      .then(response => {
        if (!response.ok) throw new Error("Bot library could not be loaded.");
        return response.json();
      })
      .then(data => {
        const bots = data && Array.isArray(data.bots) ? data.bots : [];
        const answerers = bots.filter(bot => bot.kind === "answerer");
        const questioners = bots.filter(bot => bot.kind === "questioner");
        if (bots.length !== 40 || answerers.length !== 20 || questioners.length !== 20 ||
            bots.some(bot => !Array.isArray(bot.replies) || bot.replies.length !== 100)) {
          throw new Error("Bot library must contain 20 bots per role and 100 messages per bot.");
        }
        library = data;
        return library;
      })
      .catch(error => {
        libraryPromise = null;
        throw error;
      });
  }
  return libraryPromise;
}

export function chooseBot(kind) {
  if (!library) throw new Error("Bot library is not ready.");
  const eligible = library.bots.filter(bot => bot.kind === kind);
  if (!eligible.length) throw new Error("No bot profiles are available for this role.");
  return eligible[Math.floor(Math.random() * eligible.length)];
}

export function categoryFor(text) {
  const value = String(text || "").toLowerCase();
  const rules = [
    ["study", /\\b(study|studying|exam|college|school|subject|teacher|learn|learning|homework|semester|university|class|math|revision)\\b/],
    ["career", /\\b(job|career|salary|work|profession|interview|resume|business|internship|office|company|skill|project|startup)\\b/],
    ["relationships", /\\b(friend|friendship|relationship|partner|love|dating|family|parents|trust|breakup|argument|communication)\\b/],
    ["emotions", /\\b(sad|anxious|anxiety|stress|stressed|angry|lonely|overwhelmed|tired|worried|fear|feel|feeling|mood)\\b/],
    ["confidence", /\\b(confidence|confident|shy|nervous|self esteem|insecure|failure|mistake|brave|courage)\\b/],
    ["habits", /\\b(habit|routine|discipline|procrastinat|focus|productive|productivity|sleep|exercise|time management)\\b/],
    ["creativity", /\\b(create|creative|design|art|draw|music|write|writing|idea|imagine|invent|video|photo)\\b/],
    ["social", /\\b(social|talk|conversation|meet|meeting|people|introvert|extrovert|group|network)\\b/],
    ["fun", /\\b(fun|game|movie|film|song|music|food|snack|weekend|travel|hobby|joke|random)\\b/]
  ];
  for (const [category, pattern] of rules) if (pattern.test(value)) return category;
  return "general";
}

function takeMessage(bot, category) {
  const used = usedLines.get(bot.id) || new Set();
  const preferred = bot.replies.filter(item => item.category === category && !used.has(item.text));
  const fallback = bot.replies.filter(item => !used.has(item.text));
  const choices = preferred.length ? preferred : fallback.length ? fallback : bot.replies;
  const selected = choices[Math.floor(Math.random() * choices.length)];
  used.add(selected.text);
  usedLines.set(bot.id, used);
  return selected;
}

export function nextBotAnswer(bot, category) {
  return takeMessage(bot, category || "general");
}

export function nextBotQuestion(bot, category) {
  const selectedCategory = category || CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  return takeMessage(bot, selectedCategory);
}
