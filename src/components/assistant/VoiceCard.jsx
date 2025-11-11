import React, { useEffect } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
// import audio1 from '../../assets/voices/output_Angus.wav';
// import audio2 from '../../assets/voices/output_Arcas.wav';
// import audio3 from '../../assets/voices/output_Asteria.wav';
// import audio4 from '../../assets/voices/output_Athena.wav';
// import audio5 from '../../assets/voices/output_Helios.wav';
// import audio6 from '../../assets/voices/output_Hera.wav';
// import audio7 from '../../assets/voices/output_Luna.wav';
// import audio8 from '../../assets/voices/output_Orion.wav';
// import audio9 from '../../assets/voices/output_Orpheus.wav';
// import audio10 from '../../assets/voices/output_Perseus.wav';
// import audio11 from '../../assets/voices/output_Stella.wav';
// import audio12 from '../../assets/voices/output_Zeus.wav';

// openai

import audio13 from '../../assets/voices/openai/alloy.mp3';
import audio14 from '../../assets/voices/openai/ash.mp3';
import audio15 from '../../assets/voices/openai/ballad.mp3';
import audio16 from '../../assets/voices/openai/coral.mp3';
import audio17 from '../../assets/voices/openai/echo.mp3';
import audio18 from '../../assets/voices/openai/fable.mp3';
import audio19 from '../../assets/voices/openai/nova.mp3';
import audio20 from '../../assets/voices/openai/onyx.mp3';
import audio21 from '../../assets/voices/openai/sage.mp3';
import audio22 from '../../assets/voices/openai/shimmer.mp3';
import audio23 from '../../assets/voices/openai/verse.mp3';

const VoiceSettings = ({ handleChange, assistantData }) => {
  const voiceOptions = [
    { name: 'Alloy', description: 'Modern and neutral tone', audioUrl: audio13, style: 'Neutral', category: 'General' },
    { name: 'Ash', description: 'Calm and warm tone', audioUrl: audio14, style: 'Calming', category: 'Meditation' },
    { name: 'Ballad', description: 'Soft and melodic voice', audioUrl: audio15, style: 'Melodic', category: 'Creative' },
    { name: 'Coral', description: 'Bright and cheerful tone', audioUrl: audio16, style: 'Cheerful', category: 'Customer Service' },
    { name: 'Echo', description: 'Echoing and deep tone', audioUrl: audio17, style: 'Deep', category: 'Storytelling' },
    { name: 'Fable', description: 'Storytelling voice with a warm tone', audioUrl: audio18, style: 'Storytelling', category: 'Entertainment' },
    { name: 'Nova', description: 'Futuristic and energetic tone', audioUrl: audio19, style: 'Energetic', category: 'Gaming' },
    { name: 'Onyx', description: 'Bold and commanding tone', audioUrl: audio20, style: 'Authoritative', category: 'Business' },
    { name: 'Sage', description: 'Wise and thoughtful tone', audioUrl: audio21, style: 'Wise', category: 'Education' },
    { name: 'Shimmer', description: 'Soft and smooth voice with shimmer', audioUrl: audio22, style: 'Soft', category: 'Meditation' },
    { name: 'Verse', description: 'Poetic and rhythmic tone', audioUrl: audio23, style: 'Poetic', category: 'Creative' }
  ];


  const [currentlyPlaying, setCurrentlyPlaying] = React.useState(assistantData.voice);
  const audioRef = React.useRef(null);

  useEffect(() => {
    // Automatically highlight the voice based on the assistantData.voice
    const defaultVoice = voiceOptions.find(voice => voice.name === assistantData.voice) || voiceOptions[0];
    setCurrentlyPlaying(defaultVoice.name);

    // If the voice in assistantData changes, update it.
    if (defaultVoice && defaultVoice.name !== assistantData.voice) {
      handleChange('voice', defaultVoice.name);
    }
  }, [assistantData.voice, handleChange]);

  const handlePlay = (voiceName, audioUrl) => {
    if (currentlyPlaying === voiceName) {
      audioRef.current.pause();
      setCurrentlyPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setCurrentlyPlaying(voiceName);
      handleChange('voice', voiceName);

      audioRef.current.onended = () => {
        setCurrentlyPlaying(null);
      };
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {voiceOptions.map((voice) => (
          <div 
            key={voice.name}
            className={`p-5 rounded-xl border ${currentlyPlaying === voice.name ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-primary/50'} transition-all cursor-pointer group`}
            onClick={() => handlePlay(voice.name, voice.audioUrl)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-primary truncate">{voice.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{voice.description}</p>
              </div>
              <button 
                className={`p-2 rounded-full ml-2 ${currentlyPlaying === voice.name ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary'} transition-colors`}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlay(voice.name, voice.audioUrl);
                }}
              >
                {currentlyPlaying === voice.name ? <FaPause /> : <FaPlay />}
              </button>
            </div>
            
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-200">
              <div>
                <span className="text-xs font-medium text-gray-500 block">STYLE</span>
                <span className="text-sm font-medium text-gray-700">{voice.style}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-gray-500 block">BEST FOR</span>
                <span className="text-sm font-medium text-gray-700">{voice.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-6">
        <p className="text-gray-500 text-sm max-w-2xl mx-auto">
          Tip: Click on any voice card to preview the audio. Mix and match voices to find the perfect fit for your application.
        </p>
      </div>
    </div>
  );
};

export default VoiceSettings;
