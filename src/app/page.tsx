
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, Volume2, Volume1, VolumeX, Power, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AppLogo from '@/components/images/Logo.png';

const STREAM_URL = 'https://a9.asurahosting.com/listen/sl_radio_middle_east/radio.mp3';

export default function RadioPlayerPage() {
  const [isRadioOn, setIsRadioOn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50); // Percentage 0-100
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();
      audioRef.current.volume = volume / 100;

      const handleAudioError = (event: Event) => {
        const audioElement = event.target as HTMLAudioElement;
        
        if (audioElement.error &&
            audioElement.error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED &&
            audioElement.error.message && audioElement.error.message.includes("Empty src attribute") &&
            !isRadioOn 
        ) {
          console.warn("Audio element reported 'Empty src attribute' while radio was already off. Likely a cleanup artifact.", audioElement.error);
          if (isPlaying) setIsPlaying(false); 
          return; 
        }

        let toastMessage = "An unknown audio error occurred.";
        let rawErrorObject: MediaError | null = null;
        let errorCode: number | null = null;

        if (audioElement.error) {
            rawErrorObject = audioElement.error;
            errorCode = rawErrorObject.code;
            switch (errorCode) {
                case MediaError.MEDIA_ERR_ABORTED:
                    toastMessage = "Audio playback aborted by user.";
                    break;
                case MediaError.MEDIA_ERR_NETWORK:
                    toastMessage = "A network error caused audio download to fail. Please check your internet connection and the stream availability.";
                    break;
                case MediaError.MEDIA_ERR_DECODE:
                    toastMessage = "Audio playback aborted due to a decoding problem. The stream format might be incompatible.";
                    break;
                case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    toastMessage = "Audio source not supported or stream unavailable. This can happen if the stream is down, the format is unsupported, or due to mixed content issues (HTTP stream on an HTTPS page).";
                    break;
                default:
                    toastMessage = `An audio error occurred (code: ${errorCode}).`;
            }
        }

        let consoleLogMessage = `Audio Player Error: ${toastMessage}`;
        if (rawErrorObject) {
          consoleLogMessage += ` (Raw MediaError code: ${errorCode}, message: ${rawErrorObject.message})`;
        }
        
        console.error(consoleLogMessage, rawErrorObject || '(No MediaError object)');

        toast({
          title: "Radio Error",
          description: toastMessage,
          variant: "destructive",
        });
        setIsPlaying(false);
        setIsRadioOn(false);
      };

      audioRef.current.addEventListener('error', handleAudioError);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('error', handleAudioError);
          audioRef.current.pause();
          if (audioRef.current.src) {
            audioRef.current.src = '';
             try {
              audioRef.current.load(); 
            } catch (e) {
              console.warn("Error during audio cleanup load:", e);
            }
          }
        }
      };
    }
  }, [toast, isRadioOn, isPlaying]); 

  useEffect(() => {
    if (!audioRef.current) return;

    if (isRadioOn) {
      if (audioRef.current.src !== STREAM_URL) {
        audioRef.current.src = STREAM_URL;
        audioRef.current.load();
      }
    } else {
      audioRef.current.pause();
      if (audioRef.current.src) {
        audioRef.current.src = '';
        audioRef.current.load(); 
      }
    }
  }, [isRadioOn]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isRadioOn && isPlaying) {
      if (audioRef.current.src !== STREAM_URL) {
        audioRef.current.src = STREAM_URL;
        audioRef.current.load();
      }
      // Check if paused before playing, especially after src might have been set
      if (audioRef.current.paused) {
        // If stream was paused or just loaded, ensure load() is called before play() for live streams
        audioRef.current.load(); 
        audioRef.current.play().catch(error => {
          console.error("Error attempting to play audio:", error);
          let description = "Could not start radio playback.";
          if (typeof window !== 'undefined' && window.location.protocol === 'https:' && STREAM_URL.startsWith('http:')) {
            description = "Could not start radio playback due to mixed content. Ensure stream is HTTPS.";
          }
          toast({
            title: "Playback Error",
            description: description,
            variant: "destructive",
          });
          setIsPlaying(false);
        });
      }
    } else {
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isRadioOn, toast]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const toggleRadioOn = useCallback(() => {
    setIsRadioOn(prevIsRadioOn => {
      const newIsRadioOn = !prevIsRadioOn;
      if (newIsRadioOn) {
        setIsPlaying(true); 
      } else {
        setIsPlaying(false); 
      }
      return newIsRadioOn;
    });
  }, []); 

  const togglePlayPause = useCallback(() => {
    if (!isRadioOn) return; 
    setIsPlaying(prev => !prev);
  }, [isRadioOn]);

  const handleVolumeChange = useCallback((newVolume: number[]) => {
    setVolume(newVolume[0]);
  }, []);
  
  const VolumeIcon = volume === 0 ? VolumeX : volume <= 50 ? Volume1 : Volume2;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 selection:bg-primary selection:text-primary-foreground">
      <Card className="w-full max-w-md shadow-2xl rounded-xl bg-card text-card-foreground">
        <CardHeader className="items-center">
          <Image 
            src={AppLogo} 
            alt="SL Radio Middle East Logo" 
            width={128} 
            height={128} 
            className="rounded-lg"
            data-ai-hint="radio logo"
            priority
          />
          <CardTitle className="text-xl font-headline mt-4 text-center">SL Radio Middle East</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 pt-6 pb-8">
          <div className="flex items-center justify-between px-2 py-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Power className={`w-6 h-6 transition-colors duration-300 ${isRadioOn ? 'text-primary' : 'text-muted-foreground'}`} />
              <Label htmlFor="on-off-switch" className="text-lg font-medium">
                Radio {isRadioOn ? "On" : "Off"}
              </Label>
            </div>
            <Switch
              id="on-off-switch"
              checked={isRadioOn}
              onCheckedChange={toggleRadioOn}
              aria-label={isRadioOn ? "Turn radio off" : "Turn radio on"}
            />
          </div>

          <div className="flex justify-center">
            <Button
              onClick={togglePlayPause}
              disabled={!isRadioOn}
              aria-label={isPlaying ? "Pause radio" : "Play radio"}
              size="lg"
              className="w-20 h-20 rounded-full text-primary-foreground bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg"
            >
              {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10" />}
            </Button>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="volume-slider" className="flex items-center text-base font-medium text-muted-foreground">
              <VolumeIcon className="w-5 h-5 mr-2" /> Volume
            </Label>
            <Slider
              id="volume-slider"
              min={0}
              max={100}
              step={1}
              value={[volume]}
              onValueChange={handleVolumeChange}
              disabled={!isRadioOn}
              aria-label="Volume control"
              className="[&>span:first-child]:bg-primary/30 [&_[role=slider]]:bg-primary [&_[role=slider]]:hover:bg-primary/80 [&_[role=slider]]:focus-visible:ring-primary/50 disabled:opacity-50"
            />
          </div>

          <div>
            <Button asChild className="w-full">
              <a
                href="https://wa.me/971544231299"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact via WhatsApp"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Contact via WhatsApp
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
