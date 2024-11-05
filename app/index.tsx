import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Text, View, TextInput, FlatList } from 'react-native';
import { translate, textToSpeech, audioToText } from '~/utils/useTranslate';
import AudioRecorder from '~/components/AudioRecorder';
import { languages } from '~/assets/languages';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [languageFrom, setLanguageFrom] = useState('English');
  const [languageTo, setLanguageTo] = useState('Spanish');
  const [selectLanguageMode, setSelectedLanguageMode] = useState<'from' | 'to' | null>();
  
  const onTranslate = async () => {
    const translation = await translate(input,languageFrom,languageTo);
    setOutput(translation);
  };

  const speechToText = async (uri: string) => {
    const text = await audioToText(uri);
    setInput(text);
    const translation = await translate(text,languageFrom,languageTo);
    setOutput(translation);
  };

  if (selectLanguageMode)
    return (
      <FlatList
        className="mx-auto w-full max-w-xl flex-1"
        data={languages}
        renderItem={({ item }) => (
          <Text
            className="p-3"
            onPress={() => {
              if (selectLanguageMode === 'from') {
                setLanguageFrom(item.name);
              } else {
                setLanguageTo(item.name);
              }
              setSelectedLanguageMode(null);
            }}>
            {item.name}
          </Text>
        )}
      />
    );

  return (
    <View className='max-w-xl mx-auto w-full'>
      <Stack.Screen options={{ title: 'Translate' }} />

      {/* Language selector */}
      <View className="flex-row justify-around p-5">
        <Text className="flex-1 text-center font-semibold color-blue-600" onPress={()=>setSelectedLanguageMode('from')}>{languageFrom}</Text>
        <FontAwesome5 name="exchange-alt" size={16} color="gray"  onPress={()=>{
          setLanguageFrom(languageTo)
          setLanguageTo(languageFrom)
        }}/>
        <Text className="flex-1 text-center font-semibold color-blue-600"  onPress={()=>setSelectedLanguageMode('to')}>{languageTo}</Text>
      </View>
      {/* INput container */}

      {/* Input */}
      <View className="gap-5 border-b border-t border-gray-300 p-5">
        <View className="flex-row items-center ">
          <TextInput
            placeholder="Enter text"
            value={input}
            onChangeText={setInput}
            className="max-h-40 min-h-24 flex-1 text-xl"
            multiline
            maxLength={5000}
          />
          <FontAwesome6
            name="circle-arrow-right"
            size={24}
            color="royalblue"
            onPress={onTranslate}
          />
        </View>
        <View className="flex-row items-center justify-between">
          <AudioRecorder onFinishedRecording={(uri: string) => speechToText(uri)} />
          <Text className="text-sm color-gray-600">{input.length} / 5,000</Text>
        </View>
      </View>
      {/* OUtput container */}
      {output && (
        <View className="gap-5 bg-gray-200 p-5">
          <Text className="min-h-24 text-xl">{output}</Text>
          <View className="flex-row items-center justify-between">
            <FontAwesome6
              name="volume-high"
              size={18}
              color="dimgray"
              onPress={() => textToSpeech(output)}
            />
            <FontAwesome5 name="copy" size={18} color="dimgray" />
          </View>
        </View>
      )}
    </View>
  );
}
