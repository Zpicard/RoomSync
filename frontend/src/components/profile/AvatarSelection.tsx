import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';

// Define the avatar interface
interface Avatar {
  id: number;
  url: string;
  alt: string;
}

// Generate diverse avatars using the avataaars style
const generateAvatars = (): Avatar[] => {
  const avatars: Avatar[] = [];
  
  // Generate 50 unique avatars
  for (let id = 1; id <= 50; id++) {
    // Use simple random seeds for more reliable generation
    const seed = id.toString();
    const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    
    avatars.push({
      id,
      url,
      alt: `Avatar option ${id}`
    });
  }

  return avatars;
};

const avatars = generateAvatars();

interface AvatarSelectionProps {
  selectedUrl: string;
  onSelect: (url: string) => void;
}

const FALLBACK_AVATAR = 'https://api.dicebear.com/7.x/bottts/svg?seed=fallback';

const AvatarSelection: React.FC<AvatarSelectionProps> = ({ selectedUrl, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredAvatar, setHoveredAvatar] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const filteredAvatars = searchTerm
    ? avatars.filter(avatar => 
        avatar.alt.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !failedImages.has(avatar.id)
      )
    : avatars.filter(avatar => !failedImages.has(avatar.id));

  const handleImageError = (avatarId: number) => {
    setFailedImages(prev => new Set(Array.from(prev).concat([avatarId])));
    // If the selected avatar fails, use the fallback
    if (selectedUrl === avatars.find(a => a.id === avatarId)?.url) {
      onSelect(FALLBACK_AVATAR);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-32 h-32 rounded-full border-2 border-gray-300 hover:border-primary-500 transition-colors duration-200 overflow-hidden flex items-center justify-center bg-gray-50 shadow-sm hover:shadow-md"
      >
        {selectedUrl ? (
          <img
            src={selectedUrl}
            alt="Selected avatar"
            className="w-full h-full object-contain p-2"
            onError={() => {
              onSelect(FALLBACK_AVATAR);
            }}
          />
        ) : (
          <div className="text-gray-500">
            Choose Avatar
          </div>
        )}
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-4xl w-full bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Select Your Avatar
            </Dialog.Title>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search avatars by style..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 max-h-[60vh] overflow-y-auto p-2">
              {filteredAvatars.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => {
                    onSelect(avatar.url);
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setHoveredAvatar(avatar.id.toString())}
                  onMouseLeave={() => setHoveredAvatar(null)}
                  className={`relative aspect-square rounded-lg transition-all duration-200 overflow-hidden border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm hover:shadow-md ${
                    selectedUrl === avatar.url
                      ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-800 border-primary-500 dark:border-primary-500'
                      : 'hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <img
                    src={avatar.url}
                    alt={avatar.alt}
                    className="w-full h-full object-contain p-2"
                    onError={() => handleImageError(avatar.id)}
                    loading="lazy"
                  />
                  {hoveredAvatar === avatar.id.toString() && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="text-white text-sm font-medium">Select</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredAvatars.length} avatars available
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:border-gray-500 shadow-sm hover:shadow-md"
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default AvatarSelection; 