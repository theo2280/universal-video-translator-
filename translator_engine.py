import sys
import asyncio
from faster_whisper import WhisperModel
import edge_tts

async def process_video(audio_path, target_lang, output_audio_path):
    # 1. Transcription et traduction avec Faster-Whisper (Modèle gratuit)
    model = WhisperModel("tiny", device="cpu", compute_type="int8")
    segments, info = model.transcribe(audio_path, task="translate")
    
    translated_text = " ".join([segment.text for segment in segments])
    print(f"Texte traduit : {translated_text}")

    # 2. Génération du doublage vocal gratuit avec Edge-TTS
    voice = "fr-FR-HenriNeural" if target_lang == "fr" else "en-US-ChristopherNeural"
    communicate = edge_tts.Communicate(translated_text, voice)
    await communicate.save(output_audio_path)
    print("Doublage vocal généré avec succès.")

if __name__ == "__main__":
    audio_input = sys.argv[1]
    lang_target = sys.argv[2]
    audio_output = sys.argv[3]
    asyncio.run(process_video(audio_input, lang_target, audio_output))

