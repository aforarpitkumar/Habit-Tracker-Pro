'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { QRCodeSVG } from 'qrcode.react';
import { getHabitIconEmoji } from '@/lib/utils';
import { getFrequencyDescription } from '@/lib/utils/frequency';
import { Copy, Share2, Download, Twitter, Facebook, Linkedin, QrCode } from 'lucide-react';
import type { Habit } from '@/types';

interface HabitSharingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: Habit | null;
}

interface ShareableHabit {
  name: string;
  description: string;
  icon: string;
  color: string;
  frequency: Habit['frequency'];
  sharedBy: string;
  sharedAt: string;
}

export function HabitSharingModal({ open, onOpenChange, habit }: HabitSharingModalProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (habit && open) {
      generateShareUrl();
      setMessage(`Check out this awesome habit I'm tracking: "${habit.name}"! 🎯`);
    }
  }, [habit, open]);

  const generateShareUrl = () => {
    if (!habit) return;

    const shareableHabit: ShareableHabit = {
      name: habit.name,
      description: habit.description,
      icon: habit.icon,
      color: habit.color,
      frequency: habit.frequency,
      sharedBy: userName || 'Anonymous',
      sharedAt: new Date().toISOString(),
    };

    // Encode the habit data
    const encodedData = btoa(JSON.stringify(shareableHabit));
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${baseUrl}/shared/habit?data=${encodedData}`;
    setShareUrl(url);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const shareToSocialMedia = (platform: string) => {
    const text = encodeURIComponent(message);
    const url = encodeURIComponent(shareUrl);
    
    let shareLink = '';
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
  };

  const downloadQRCode = () => {
    const svg = document.querySelector('#qr-code-svg') as SVGElement;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `${habit?.name}-habit-qr.png`;
      link.href = canvas.toDataURL();
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  if (!habit) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Habit
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Habit Preview */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <span 
                className="text-2xl p-2 rounded-lg"
                style={{ backgroundColor: `${habit.color}20` }}
              >
                {getHabitIconEmoji(habit.icon)}
              </span>
              <div className="flex-1">
                <h3 className="font-semibold">{habit.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {getFrequencyDescription(habit.frequency)}
                </p>
              </div>
              <Badge variant="secondary">Habit</Badge>
            </div>
            {habit.description && (
              <p className="text-sm text-muted-foreground">{habit.description}</p>
            )}
          </div>

          {/* User Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Name (Optional)</label>
            <Input
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onBlur={generateShareUrl}
            />
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Share Message</label>
            <Textarea
              placeholder="Add a personal message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Share URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Share Link</label>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="shrink-0"
              >
                <Copy className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">QR Code</label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQR(!showQR)}
              >
                <QrCode className="h-4 w-4 mr-2" />
                {showQR ? 'Hide' : 'Show'} QR Code
              </Button>
            </div>
            
            {showQR && (
              <div className="flex flex-col items-center space-y-3 p-4 bg-white rounded-lg border">
                <QRCodeSVG
                  id="qr-code-svg"
                  value={shareUrl}
                  size={200}
                  level="M"
                  includeMargin
                />
                <p className="text-xs text-muted-foreground text-center">
                  Scan to view habit details
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadQRCode}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
              </div>
            )}
          </div>

          {/* Social Media Sharing */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Share on Social Media</label>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareToSocialMedia('twitter')}
                className="flex items-center gap-2"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareToSocialMedia('facebook')}
                className="flex items-center gap-2"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareToSocialMedia('linkedin')}
                className="flex items-center gap-2"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Close
            </Button>
            <Button 
              onClick={copyToClipboard}
              className="flex-1"
            >
              <Share2 className="h-4 w-4 mr-2" />
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}