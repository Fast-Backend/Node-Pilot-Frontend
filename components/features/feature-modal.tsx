'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

// Sample data - you can replace this with your own items
const fearureItems = [
  {
    id: 'registration-login',
    label: 'User Registration & Login',
    description: 'Traditional email and password authentication',
  },
];

interface FeatureModalProps {
  open: boolean;
  handleModal: () => void;
  handleSavedFeatures: (data: string[]) => void;
}

export default function FeatureModal({
  handleModal,
  open,
  handleSavedFeatures,
}: FeatureModalProps) {
  //   const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleItemToggle = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSave = () => {
    // Get the full item details for selected items
    // const selectedItemDetails = fearureItems.filter((item) =>
    //   selectedItems.includes(item.id)
    // );
    handleSavedFeatures(selectedItems);
    // Close the modal after saving
    handleModal();
    // Reset selections (optional - remove if you want to keep selections)
    // setSelectedItems([])
  };

  const handleCancel = () => {
    handleModal();
    // Optionally reset selections on cancel
    // setSelectedItems([])
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Dialog open={open} onOpenChange={handleModal}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>🔐 Features</DialogTitle>
            <DialogDescription>
              Select the features you want to enable for your application.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-96 pr-4">
            <div className="space-y-4">
              {fearureItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50"
                >
                  <Checkbox
                    id={item.id}
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => handleItemToggle(item.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <label
                      htmlFor={item.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {item.label}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}{' '}
              selected
            </p>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={selectedItems.length === 0}
              >
                Save Selection
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
