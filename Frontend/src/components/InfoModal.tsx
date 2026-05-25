import React from 'react';
import { X } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'image' | 'document';
  imageUrl?: string;
  children?: React.ReactNode;
}

export default function InfoModal({
  isOpen,
  onClose,
  title,
  type,
  imageUrl,
  children,
}: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {type === 'image' && imageUrl ? (
            <div className="flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden min-h-[200px]">
              <img 
                src={imageUrl} 
                alt={title} 
                className="max-w-full h-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<div class="text-gray-400 text-sm p-8">Imagem não disponível</div>';
                }}
              />
            </div>
          ) : type === 'document' ? (
            <div className="text-gray-700">
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
