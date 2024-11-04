import { Stack } from 'expo-router';
import { Text } from 'react-native';


export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
    <Text className='text-xl font-bold color-red-500 m-10'>Hello my work</Text>
    </>
  );
}
