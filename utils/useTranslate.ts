import { Audio } from 'expo-av';
import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';

export const translate = async (text: string) => {
  const { data, error } = await supabase.functions.invoke('translate', {
    body: JSON.stringify({ input: text, from: 'English', to: 'Spanish' }),
  });
  console.log(error);
  console.log(data);

  return data?.content || 'Something went wrong';
};

export const textToSpeech = async (text: string) => {
  const { data, error } = await supabase.functions.invoke('text-to-speech', {
    body: JSON.stringify({ input: text }),
  });
  console.log(data, 'Data');
  console.log(error, ' error');
  if (data) {
    const { sound } = await Audio.Sound.createAsync({
      uri: `data:audio/mp3;base64,${data.mp3Base64}`,
    });
    sound.playAsync();
  }
};

export const audioToText = async (uri: string) => {
  const audioBase64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
  const { data, error } = await supabase.functions.invoke('speech-to-text', {
    body: JSON.stringify({ audioBase64 }),
  });
  return data.text;
};
