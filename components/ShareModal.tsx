
import React, { useState, useCallback } from 'react';
import type { DreamAnalysis } from '../types';
import { TwitterIcon } from './icons/TwitterIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface ShareModalProps {
  analysis: DreamAnalysis;
  imageUrl: string;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ analysis, imageUrl, onClose }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const shareText = `I just visualized my dream with Dream Weaver!

Title: ${analysis.title}
Summary: ${analysis.summary}
`;

  const handleCopyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy text.');
    });
  }, [shareText]);

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  // Note: Facebook share is better with a URL, but quote works for text. Image sharing requires more complex APIs.
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=https://example.com&quote=${encodeURIComponent(shareText)}`;

  return (
    <div
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg m-4 p-6 text-slate-200"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="share-modal-title" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
            Share Your Dream
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <img src={imageUrl} alt="Dream visualization" className="rounded-lg w-full object-cover aspect-video" />
          
          <p className="text-sm text-slate-400 text-center bg-slate-900/50 p-2 rounded-md">
            Right-click or long-press the image to save it, then attach it to your post.
          </p>

          <div className="p-4 bg-slate-900 rounded-lg max-h-40 overflow-y-auto">
            <p className="font-semibold text-purple-300">{analysis.title}</p>
            <p className="text-sm text-slate-300 whitespace-pre-wrap">{analysis.summary}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white font-semibold rounded-lg hover:bg-[#1a91da] transition-colors"
            >
              <TwitterIcon className="w-5 h-5" /> Share on X
            </a>
            <a
              href={facebookShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1877F2] text-white font-semibold rounded-lg hover:bg-[#166eeb] transition-colors"
            >
              <FacebookIcon className="w-5 h-5" /> Share on Facebook
            </a>
             <button
              onClick={handleCopyToClipboard}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 transition-colors"
            >
              <ClipboardIcon className="w-5 h-5" />
              <span>{copyStatus === 'copied' ? 'Copied!' : 'Copy Text'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
