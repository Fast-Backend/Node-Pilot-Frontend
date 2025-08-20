/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';
import { WorkflowProps, Properties, ValidationRule, FieldTypes, ValidationTypes } from '@/types/types';
import { useWorkflowStore } from '@/lib/store/workflowStore';

interface EntityEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string | null;
}

export default function EntityEditModal({ isOpen, onClose, entityId }: EntityEditModalProps) {
  const { nodes, updateNode } = useWorkflowStore();
  const [entityData, setEntityData] = useState<WorkflowProps>({
    name: '',
    props: [],
    relations: []
  });

  const entityNode = entityId ? nodes.find(n => n.id === entityId) : null;

  useEffect(() => {
    if (entityNode) {
      setEntityData(entityNode.data);
    }
  }, [entityNode]);

  const handleSave = () => {
    if (entityId && entityData.name.trim()) {
      updateNode(entityId, entityData);
      onClose();
    }
  };

  const addProperty = () => {
    setEntityData(prev => ({
      ...prev,
      props: [...prev.props, {
        name: '',
        type: 'string',
        nullable: false,
        validation: []
      }]
    }));
  };

  const updateProperty = (index: number, updates: Partial<Properties>) => {
    setEntityData(prev => ({
      ...prev,
      props: prev.props.map((prop, i) => 
        i === index ? { ...prop, ...updates } : prop
      )
    }));
  };

  const removeProperty = (index: number) => {
    setEntityData(prev => ({
      ...prev,
      props: prev.props.filter((_, i) => i !== index)
    }));
  };

  const addValidationRule = (propIndex: number) => {
    setEntityData(prev => ({
      ...prev,
      props: prev.props.map((prop, i) =>
        i === propIndex
          ? {
              ...prop,
              validation: [...(prop.validation || []), { type: 'minLength', value: 1 }]
            }
          : prop
      )
    }));
  };

  const updateValidationRule = (propIndex: number, ruleIndex: number, rule: ValidationRule) => {
    setEntityData(prev => ({
      ...prev,
      props: prev.props.map((prop, i) =>
        i === propIndex
          ? {
              ...prop,
              validation: prop.validation?.map((r, ri) =>
                ri === ruleIndex ? rule : r
              ) || []
            }
          : prop
      )
    }));
  };

  const removeValidationRule = (propIndex: number, ruleIndex: number) => {
    setEntityData(prev => ({
      ...prev,
      props: prev.props.map((prop, i) =>
        i === propIndex
          ? {
              ...prop,
              validation: prop.validation?.filter((_, ri) => ri !== ruleIndex) || []
            }
          : prop
      )
    }));
  };

  if (!entityNode) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Entity</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Entity Name */}
          <div>
            <Label htmlFor="entityName">Entity Name</Label>
            <Input
              id="entityName"
              value={entityData.name}
              onChange={(e) => setEntityData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter entity name"
            />
          </div>

          {/* Properties */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Properties</Label>
              <Button onClick={addProperty} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
            </div>

            <div className="space-y-4">
              {entityData.props.map((prop, propIndex) => (
                <div key={propIndex} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Label>Name</Label>
                      <Input
                        value={prop.name}
                        onChange={(e) => updateProperty(propIndex, { name: e.target.value })}
                        placeholder="Property name"
                      />
                    </div>
                    <div className="flex-1">
                      <Label>Type</Label>
                      <Select
                        value={prop.type}
                        onValueChange={(value) => updateProperty(propIndex, { type: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FieldTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`nullable-${propIndex}`}
                        checked={prop.nullable}
                        onCheckedChange={(checked) => 
                          updateProperty(propIndex, { nullable: !!checked })
                        }
                      />
                      <Label htmlFor={`nullable-${propIndex}`}>Nullable</Label>
                    </div>
                    <Button
                      onClick={() => removeProperty(propIndex)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Validation Rules */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm">Validation Rules</Label>
                      <Button
                        onClick={() => addValidationRule(propIndex)}
                        size="sm"
                        variant="outline"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Rule
                      </Button>
                    </div>

                    {prop.validation?.map((rule, ruleIndex) => (
                      <div key={ruleIndex} className="flex items-center gap-2 mb-2">
                        <Select
                          value={rule.type}
                          onValueChange={(value) => {
                            const newRule: ValidationRule = { type: value as any };
                            if (['minLength', 'maxLength', 'min', 'max'].includes(value)) {
                              (newRule as any).value = 1;
                            } else if (value === 'pattern') {
                              (newRule as any).value = '';
                            } else if (value === 'enum') {
                              (newRule as any).values = [''];
                            }
                            updateValidationRule(propIndex, ruleIndex, newRule);
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ValidationTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {(['minLength', 'maxLength', 'min', 'max'].includes(rule.type)) && (
                          <Input
                            type="number"
                            value={(rule as any).value || ''}
                            onChange={(e) => updateValidationRule(propIndex, ruleIndex, {
                              ...rule,
                              value: parseInt(e.target.value) || 0
                            } as any)}
                            className="w-20"
                          />
                        )}

                        {rule.type === 'pattern' && (
                          <Input
                            value={(rule as any).value || ''}
                            onChange={(e) => updateValidationRule(propIndex, ruleIndex, {
                              ...rule,
                              value: e.target.value
                            } as any)}
                            placeholder="Regular expression"
                            className="flex-1"
                          />
                        )}

                        <Button
                          onClick={() => removeValidationRule(propIndex, ruleIndex)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!entityData.name.trim()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}