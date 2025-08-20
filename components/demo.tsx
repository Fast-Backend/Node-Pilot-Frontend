'use client';

import { useState, useEffect } from 'react';
import { YouTubeEmbed } from '@next/third-parties/google';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X, Play } from 'lucide-react';

// https://www.youtube.com/embed/EPD-FRibjBg?si=NgIfA8Ot3TUWZzxG

interface YouTubeDemoModalProps {
  videoId?: string;
  title?: string;
  showOnFirstVisit?: boolean;
}

export default function YouTubeDemoModal({
  videoId = 'EPD-FRibjBg', // Replace with your actual video ID
  showOnFirstVisit = true,
}: YouTubeDemoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTrigger, setShowTrigger] = useState(false);

  useEffect(() => {
    if (showOnFirstVisit) {
      // Check if user has visited before
      const hasVisited = localStorage.getItem('hasVisitedBefore');

      if (!hasVisited) {
        // Show modal after a short delay for first-time visitors
        const timer = setTimeout(() => {
          setIsOpen(true);
          localStorage.setItem('hasVisitedBefore', 'true');
        }, 1000);

        return () => clearTimeout(timer);
      } else {
        // Show trigger button for returning visitors
        setShowTrigger(true);
      }
    }
      return undefined; // <-- make return type consistent

  }, [showOnFirstVisit]);

  return (
    <div>
      {/* Trigger button for returning visitors */}
      {showTrigger && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-blue-600 hover:bg-blue-700 z-40"
          size="icon"
        >
          <Play className="w-6 h-6" />
        </Button>
      )}

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
        <DialogContent className="p-0 border-0 m-0" showCloseButton={false}>
          <DialogHeader className="hidden">
            <DialogTitle />
          </DialogHeader>
          <div className="relative ">
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-1 z-50 text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
            <YouTubeEmbed
              videoid={videoId}
              //   height={500}
              params="controls=1&modestbranding=1&rel=0&autoplay=1"
              style="border-radius: 10px"
            />
          </div>
          {/* <DialogFooter className="hidden" /> */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
