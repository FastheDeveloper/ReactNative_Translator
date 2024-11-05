import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Text, View, TextInput } from 'react-native';
import { supabase } from '~/utils/supabase';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system'
export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [recording, setRecording] = useState<Audio.Recording>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const translate = async (text: string) => {
    const { data, error } = await supabase.functions.invoke('translate', {
      body: JSON.stringify({ input: text, from: 'English', to: 'Spanish' }),
    });
    console.log(error);
    console.log(data);

    return data?.content || 'Something went wrong';
  };

  const textToSpeech = async (text: string) => {
    const { data, error } = await supabase.functions.invoke('text-to-speech',{
		body:JSON.stringify({input:text})
	});
	console.log(data, "Data")
	console.log(error," error")
	if (data) {
		const { sound } = await Audio.Sound.createAsync({
		  uri: `data:audio/mp3;base64,${data.mp3Base64}`,
		});
		sound.playAsync();
	  }
  };

  
  const onTranslate = async () => {
    console.log('running');
    const translation = await translate(input);
    setOutput(translation);
  };

  async function startRecording() {
    try {
		setInput('')
		setOutput('')
      if (permissionResponse?.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
	if(!recording){
		return
	}
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    const uri = recording.getURI();
	console.log('Recording stopped and stored at', uri);
	if(uri){

		const audioBase64=await FileSystem.readAsStringAsync(uri,{ encoding: 'base64' })
		const {data,error}=await supabase.functions.invoke("speech-to-text",{
		body:JSON.stringify({audioBase64})
	
		})
		setInput(data.text)
		const translation = await translate(data.text)
		setOutput(translation)
		console.log('================DATA====================');
		console.log(data);
		console.log('====================================');

		console.log('================Error====================');
		console.log(error);
		console.log('====================================');
	}
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />

      {/* Language selector */}
      <View className="flex-row justify-around p-5">
        <Text className="flex-1 text-center font-semibold color-blue-600">English</Text>
        <FontAwesome5 name="exchange-alt" size={16} color="gray" />
        <Text className="flex-1 text-center font-semibold color-blue-600">Spanish</Text>
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
			{recording?
          <FontAwesome5 name="stop" size={18} color="dimgray" onPress={stopRecording}/>
			
			:
			
          <FontAwesome6 name="microphone" size={18} color="dimgray" onPress={startRecording}/>
			}
          <Text className="text-sm color-gray-600">{input.length} / 5,000</Text>
        </View>
      </View>
      {/* OUtput container */}
      {output && (
        <View className="gap-5 bg-gray-200 p-5">
          <Text className="min-h-24 text-xl">{output}</Text>
          <View className="flex-row items-center justify-between">
            <FontAwesome6 name="volume-high" size={18} color="dimgray" onPress={()=>textToSpeech(output)} />
            <FontAwesome5 name="copy" size={18} color="dimgray" />
          </View>
        </View>
      )}
    </>
  );
}
