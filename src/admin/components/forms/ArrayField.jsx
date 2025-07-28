import { useFieldArray } from 'react-hook-form';
import { Plus, X, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ArrayField = ({ 
  control, 
  name, 
  label, 
  placeholder = "Enter value",
  required = false,
  description,
  maxItems = 10,
  minItems = 1
}) => {
  const { fields, append, remove, swap } = useFieldArray({ 
    control, 
    name 
  });

  const addItem = () => {
    if (fields.length < maxItems) {
      append("");
    }
  };

  const removeItem = (index) => {
    if (fields.length > minItems) {
      remove(index);
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-xs text-foreground/60">{description}</p>
      )}

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div 
            key={field.id} 
            className="flex items-center gap-2 group"
          >
            {/* Drag handle (for future drag-and-drop functionality) */}
            <button
              type="button"
              className="p-1 text-foreground/40 hover:text-foreground/60 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
              title="Drag to reorder"
            >
              <GripVertical className="h-4 w-4" />
            </button>

            {/* Input field */}
            <input
              {...control.register(`${name}.${index}`)}
              placeholder={`${placeholder} ${index + 1}`}
              className={cn(
                "flex-1 px-3 py-2 border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background transition-colors"
              )}
            />

            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeItem(index)}
              disabled={fields.length <= minItems}
              className={cn(
                "p-2 rounded-lg transition-colors",
                fields.length <= minItems
                  ? "text-foreground/30 cursor-not-allowed"
                  : "text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              )}
              title={fields.length <= minItems ? `Minimum ${minItems} item(s) required` : "Remove item"}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add button */}
      <button
        type="button"
        onClick={addItem}
        disabled={fields.length >= maxItems}
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-sm rounded-lg border-2 border-dashed transition-colors",
          fields.length >= maxItems
            ? "border-border/50 text-foreground/50 cursor-not-allowed"
            : "border-border hover:border-primary text-foreground/70 hover:text-foreground hover:bg-accent"
        )}
      >
        <Plus className="h-4 w-4" />
        Add {label?.toLowerCase() || 'item'}
        {fields.length >= maxItems && (
          <span className="text-xs">({maxItems} max)</span>
        )}
      </button>

      {/* Items counter */}
      <div className="flex justify-between text-xs text-foreground/60">
        <span>{fields.length} item{fields.length !== 1 ? 's' : ''}</span>
        <span>
          {minItems > 0 && `Min: ${minItems} • `}
          Max: {maxItems}
        </span>
      </div>
    </div>
  );
};

export default ArrayField; 