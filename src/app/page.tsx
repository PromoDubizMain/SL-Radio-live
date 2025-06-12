
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, Volume2, Volume1, VolumeX, Power } from "lucide-react";
import { BizFMLogo } from "@/components/icons/BizFMLogo";
import { useToast } from "@/hooks/use-toast";


// const STREAM_URL = 'http://88.150.230.110:31076/stream'; // Biz FM actual stream
const STREAM_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; // Placeholder for testing


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
        console.error("Audio Error:", event);
        const audioElement = event.target as HTMLAudioElement;
        let errorMessage = "An unknown audio error occurred.";
        if (audioElement.error) {
            switch (audioElement.error.code) {
                case MediaError.MEDIA_ERR_ABORTED:
                    errorMessage = "Audio playback aborted by user.";
                    break;
                case MediaError.MEDIA_ERR_NETWORK:
                    errorMessage = "A network error caused audio download to fail.";
                    break;
                case MediaError.MEDIA_ERR_DECODE:
                    errorMessage = "Audio playback aborted due to a decoding problem.";
                    break;
                case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    errorMessage = "Audio source not supported or stream unavailable. This can happen with HTTP streams on an HTTPS page (mixed content) or if the stream is down.";
                    break;
                default:
                    errorMessage = `An audio error occurred (code: ${audioElement.error.code}).`;
            }
        }
        toast({
          title: "Radio Error",
          description: errorMessage,
          variant: "destructive",
        });
        setIsPlaying(false);
        setIsRadioOn(false); // Turn off radio on critical error
      };

      audioRef.current.addEventListener('error', handleAudioError);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('error', handleAudioError);
          audioRef.current.pause();
          audioRef.current.src = '';
        }
      };
    }
  }, [toast]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isRadioOn) {
      if (audioRef.current.src !== STREAM_URL) {
        audioRef.current.src = STREAM_URL;
        audioRef.current.load(); // Ensure the new source is loaded
      }
    } else {
      audioRef.current.pause();
      if (audioRef.current.src) {
        audioRef.current.src = '';
         // audioRef.current.load(); // May help to fully release resources
      }
    }
  }, [isRadioOn]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isRadioOn && isPlaying) {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
        toast({
          title: "Playback Error",
          description: "Could not start radio playback.",
          variant: "destructive",
        });
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, isRadioOn, toast]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const toggleRadioOn = useCallback(() => {
    setIsRadioOn(prev => {
      const newIsOn = !prev;
      if (!newIsOn) {
        setIsPlaying(false); // Also turn off playback if radio is turned off
      } else {
        // When turning on, if not already playing, set to play
        if (!isPlaying && audioRef.current && audioRef.current.paused) {
            setIsPlaying(true);
        }
      }
      return newIsOn;
    });
  }, [isPlaying]);

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
          <BizFMLogo className="w-24 h-24 text-primary" />
          <CardTitle className="text-4xl font-headline mt-4 text-center">Biz FM</CardTitle>
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
        </CardContent>
      </Card>
    </div>
  );
}

    