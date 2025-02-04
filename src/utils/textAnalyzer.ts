interface TextAnalysis {
    wordCount: number;
    sentenceCount: number;
    characterCount: number;
    letterFrequency: { [key: string]: number };
  }
  
  export function analyzeText(text: string): TextAnalysis {
    // Remove extra whitespace and trim
    const cleanText = text.trim().replace(/\s+/g, ' ');
  
    // Count words
    const wordCount = cleanText.split(' ').filter(word => word.length > 0).length;
  
    // Count sentences (looking for . ! ?)
    const sentenceCount = cleanText
      .split(/[.!?]+/)
      .filter(sentence => sentence.trim().length > 0).length;
  
    // Count characters (excluding whitespace)
    const characterCount = text.replace(/\s/g, '').length;
  
    // Count letter frequency
    const letterFrequency: { [key: string]: number } = {};
    const letters = text.toLowerCase().match(/[a-z]/g) || [];
    
    letters.forEach(letter => {
      letterFrequency[letter] = (letterFrequency[letter] || 0) + 1;
    });
  
    return {
      wordCount,
      sentenceCount,
      characterCount,
      letterFrequency
    };
  }