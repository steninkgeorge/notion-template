import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface Rule {
  id: string;
  title: string;
  prompt: string;
  color: string;
  backgroundColor: string;
}

interface ManageRulesProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  rules: Rule[];
}

const colorOptions = [
  '#FF5252',
  '#FF4081',
  '#E040FB',
  '#7C4DFF',
  '#536DFE',
  '#448AFF',
  '#40C4FF',
  '#18FFFF',
  '#64FFDA',
  '#69F0AE',
  '#B2FF59',
  '#EEFF41',
  '#FFFF00',
  '#FFD740',
  '#FFAB40',
  '#FF6E40',
];

export const ManageRules = ({ open, setOpen, rules }: ManageRulesProps) => {
  const [formData, setFormData] = useState({
    title: '',
    prompt: '',
    selectedColor: colorOptions[0],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRule = () => {
    // Implement your add rule logic here
    console.log('Adding rule:', formData);
    // Clear form after adding
    setFormData({
      title: '',
      prompt: '',
      selectedColor: colorOptions[0],
    });
  };

  // Use stopPropagation to prevent dragging
  const stopPropagation = (
    e: React.MouseEvent | React.TouchEvent | React.PointerEvent
  ) => {
    e.stopPropagation();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-2xl max-h-[80vh] flex flex-col"
        onMouseDown={stopPropagation}
        onTouchStart={stopPropagation}
        onPointerDown={stopPropagation}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Manage Rules
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="group relative rounded-lg border p-3 hover:bg-gray-50"
            >
              <div className="flex item-start gap-3">
                <div
                  className="w-3 h-3 rounded-xs mt-1 flex-shrink-0"
                  style={{ backgroundColor: rule.color }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{rule.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{rule.prompt}</p>
                </div>
                <div className="gap-2 flex opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 cursor-pointer"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 text-red-600 hover:text-red-700 cursor-pointer"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium text-sm">Add New Rule</h4>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Rule title"
              className="text-sm"
            />
            <Textarea
              name="prompt"
              placeholder="Detailed prompt"
              className="text-sm min-h-[100px]"
              value={formData.prompt}
              onChange={handleChange}
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Tag:</span>
              <div className="flex gap-1 flex-wrap">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={cn(
                      'w-5 h-5 rounded-sm border border-gray-300 hover:border-gray-400 hover:cursor-pointer transition-colors',
                      color === formData.selectedColor && 'border-gray-500'
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, selectedColor: color }))
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button onClick={handleAddRule}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
