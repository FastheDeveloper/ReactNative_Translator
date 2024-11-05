import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { Audio } from 'expo-av';


const AudioRecorder = ({onFinishedRecording}:{onFinishedRecording:(uri:string)=>void}) => {
  const [recording, setRecording] = useState<Audio.Recording>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  async function startRecording() {
    try {
      if (permissionResponse?.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) {
      return;
    }
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    if (uri) onFinishedRecording(uri);
  }
  if (recording) {
    return <FontAwesome5 name="stop" size={18} color="dimgray" onPress={stopRecording} />;
  }

  return <FontAwesome6 name="microphone" size={18} color="dimgray" onPress={startRecording} />;
};

export default AudioRecorder;

const styles = StyleSheet.create({});
