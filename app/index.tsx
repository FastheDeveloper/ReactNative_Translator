import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Text, View,TextInput } from 'react-native';
import { supabase } from '~/utils/supabase';
 
export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

const translate =async(text:string)=>{
const {data,error} = await supabase.functions.invoke('translate',{
	body:JSON.stringify({input:text,from:'English',to:"Spanish"})
})
console.log(error)
console.log(data)

return data?.content || "Something went wrong"
}

  const onTranslate=async()=>{
	console.log("running")
    const  translation=await translate(input)
	setOutput(translation)
  }
  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />

    {/* Language selector */}
    <View className='flex-row justify-around p-5'>
    <Text className="flex-1 text-center font-semibold color-blue-600">
		        English
		      </Text>
		      <FontAwesome5
		        name="exchange-alt"
		        size={16}
		        color="gray"
		      />
		      <Text className="flex-1 text-center font-semibold color-blue-600">
		        Spanish
		      </Text>
    </View>
    {/* INput container */}

 {/* Input */}
 <View className="gap-5 border-b border-t border-gray-300 p-5">
		      <View className="flex-row items-center ">
		        <TextInput
		          placeholder="Enter text"
		          value={input}
		          onChangeText={setInput}
		          className="min-h-24 max-h-40 flex-1 text-xl"
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
		        <FontAwesome6 name="microphone" size={18} color="dimgray" />
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
		          />
		          <FontAwesome5 name="copy" size={18} color="dimgray" />
		        </View>
		      </View>
		    )}
    </>
  );
}
