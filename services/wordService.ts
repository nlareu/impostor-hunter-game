import { WordData } from '../types';
import { secretWords } from '../words';

export const fetchSecretWord = async (): Promise<WordData> => {
  // Simulate a small delay for UX suspense
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const randomIndex = Math.floor(Math.random() * secretWords.length);
  return secretWords[randomIndex];
};