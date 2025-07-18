import { Translate } from '@google-cloud/translate/build/src/v2/index.js';

// Initialize the translation client with API key
const translate = new Translate({
    key: process.env.GOOGLE_TRANSLATE_API_KEY
});

/**
 * Detect the language of a text
 * @param {string} text - The text to detect language for
 * @returns {string} - The detected language code
 */
export const detectLanguage = async (text) => {
    try {
        if (!text || text.trim() === '') return 'en';
        
        const [detection] = await translate.detect(text);
        return detection.language;
    } catch (error) {
        console.error('Language detection error:', error);
        return 'en'; // Default to English if detection fails
    }
};

/**
 * Translate text from one language to another
 * @param {string} text - The text to translate
 * @param {string} targetLanguage - The target language code
 * @param {string} sourceLanguage - The source language code (optional)
 * @returns {string} - The translated text
 */
export const translateText = async (text, targetLanguage, sourceLanguage = null) => {
    try {
        if (!text || text.trim() === '') return text;
        
        // If target language is 'default', return original text
        if (targetLanguage === 'default') return text;
        
        // Detect source language if not provided
        if (!sourceLanguage) {
            sourceLanguage = await detectLanguage(text);
        }
        
        // If source and target languages are the same, return original text
        if (sourceLanguage === targetLanguage) return text;
        
        const [translation] = await translate.translate(text, {
            from: sourceLanguage,
            to: targetLanguage
        });
        
        return translation;
    } catch (error) {
        console.error('Translation error:', error);
        return text; // Return original text if translation fails
    }
};

/**
 * Get supported languages
 * @returns {Array} - Array of supported language objects
 */
export const getSupportedLanguages = async () => {
    try {
        const [languages] = await translate.getLanguages();
        return languages;
    } catch (error) {
        console.error('Error fetching supported languages:', error);
        // Return common languages as fallback
        return [
            { code: 'default', name: 'Default (No Translation)' },
            { code: 'en', name: 'English' },
            { code: 'hi', name: 'Hindi' },
            { code: 'es', name: 'Spanish' },
            { code: 'fr', name: 'French' },
            { code: 'de', name: 'German' },
            { code: 'it', name: 'Italian' },
            { code: 'pt', name: 'Portuguese' },
            { code: 'ru', name: 'Russian' },
            { code: 'ja', name: 'Japanese' },
            { code: 'ko', name: 'Korean' },
            { code: 'zh', name: 'Chinese' },
            { code: 'ar', name: 'Arabic' }
        ];
    }
};

/**
 * Check if a language code is supported
 * @param {string} languageCode - The language code to check
 * @returns {boolean} - Whether the language is supported
 */
export const isLanguageSupported = async (languageCode) => {
    try {
        const languages = await getSupportedLanguages();
        return languages.some(lang => lang.code === languageCode);
    } catch (error) {
        console.error('Error checking language support:', error);
        return false;
    }
};
