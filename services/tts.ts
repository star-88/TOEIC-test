export const speak = (text: string, lang: 'en' | 'fr') => {
  if (!window.speechSynthesis) {
    alert("Your browser does not support text-to-speech.");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set language code
  utterance.lang = lang === 'en' ? 'en-US' : 'fr-FR';
  
  // Attempt to find a specific voice for better quality if available
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang.startsWith(lang === 'en' ? 'en' : 'fr'));
  if (voice) {
    utterance.voice = voice;
  }

  utterance.rate = 0.9; // Slightly slower for learning
  window.speechSynthesis.speak(utterance);
};