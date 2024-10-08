import { CohereClient } from 'cohere-ai';

export async function generateJSON(prompt: string) {
  const cohere = new CohereClient({
    token: process.env.COHERE_KEY || '',
  });

  const chat = await cohere.chat({
    message: `Donne un tableau de data JSON. Ex: [{id: 1233, name: 'Guy'},{id: 7436, name: 'Dude'}]. Sous forme tableau. Longueur de tableau: 7, Description: ${prompt}, Contrainte: donne moi juste le json en tant que texte et ne dit aucun phrase`,
  });

  const json = JSON.parse(chat.text.replace('json', '').replace('```', ''))

  return json;
}
