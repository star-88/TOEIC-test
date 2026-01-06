// @ts-nocheck
const speak = (text, lang) => {
  if (!window.speechSynthesis) {
    alert("Your browser does not support text-to-speech.");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'en' ? 'en-US' : 'fr-FR';
  
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang.startsWith(lang === 'en' ? 'en' : 'fr'));
  if (voice) {
    utterance.voice = voice;
  }

  utterance.rate = 0.9; 
  window.speechSynthesis.speak(utterance);
};

// Expose to global namespace
window.TOEIC = window.TOEIC || {};
window.TOEIC.speak = speak;