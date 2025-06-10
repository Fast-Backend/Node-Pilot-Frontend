/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import {
  EditableData,
  FieldType,
  FieldTypes,
  Properties,
  Relation,
  RouteMethods,
  ValidationRule,
  ValidationTypes,
} from '@/types/types';

interface WorkflowProps {
  workflow: EditableData;
  modalOpen: boolean;
  onModalOpen: () => void;
}

export default function EditableCard({
  workflow,
  modalOpen,
  onModalOpen,
}: WorkflowProps) {
  const [data, setData] = useState<EditableData>(workflow);

  const updateName = (name: string) => {
    setData((prev) => ({ ...prev, name }));
  };

  const addProperty = () => {
    const newProp: Properties = {
      name: '',
      type: 'string',
      nullable: false,
      validation: [],
    };
    setData((prev) => ({ ...prev, props: [...prev.props, newProp] }));
  };

  const updateProperty = (index: number, updates: Partial<Properties>) => {
    setData((prev) => ({
      ...prev,
      props: prev.props.map((prop, i) =>
        i === index ? { ...prop, ...updates } : prop
      ),
    }));
  };

  const removeProperty = (index: number) => {
    setData((prev) => ({
      ...prev,
      props: prev.props.filter((_, i) => i !== index),
    }));
  };

  const addValidationRule = (propIndex: number) => {
    const newRule: ValidationRule = { type: 'minLength', value: 1 };
    setData((prev) => ({
      ...prev,
      props: prev.props.map((prop, i) =>
        i === propIndex
          ? { ...prop, validation: [...(prop.validation || []), newRule] }
          : prop
      ),
    }));
  };

  const updateValidationRule = (
    propIndex: number,
    ruleIndex: number,
    rule: ValidationRule
  ) => {
    setData((prev) => ({
      ...prev,
      props: prev.props.map((prop, i) =>
        i === propIndex
          ? {
              ...prop,
              validation:
                prop.validation?.map((r, ri) =>
                  ri === ruleIndex ? rule : r
                ) || [],
            }
          : prop
      ),
    }));
  };

  const removeValidationRule = (propIndex: number, ruleIndex: number) => {
    setData((prev) => ({
      ...prev,
      props: prev.props.map((prop, i) =>
        i === propIndex
          ? {
              ...prop,
              validation:
                prop.validation?.filter((_, ri) => ri !== ruleIndex) || [],
            }
          : prop
      ),
    }));
  };

  const addRelation = () => {
    const newRelation: Relation = {
      relation: 'one-to-one',
      isParent: false,
      controller: '',
    };
    setData((prev) => ({
      ...prev,
      relations: [...prev.relations, newRelation],
    }));
  };

  const updateRelation = (index: number, updates: Partial<Relation>) => {
    setData((prev) => ({
      ...prev,
      relations: prev.relations.map((rel, i) =>
        i === index ? { ...rel, ...updates } : rel
      ),
    }));
  };

  const removeRelation = (index: number) => {
    setData((prev) => ({
      ...prev,
      relations: prev.relations.filter((_, i) => i !== index),
    }));
  };

  const renderValidationRule = (
    rule: ValidationRule,
    propIndex: number,
    ruleIndex: number
  ) => {
    const updateRule = (updates: ValidationRule) => {
      updateValidationRule(propIndex, ruleIndex, { ...rule, ...updates });
    };

    return (
      <div
        key={ruleIndex}
        className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50"
      >
        <div className="flex-shrink-0">
          <Label className="text-xs text-muted-foreground">TYPE</Label>
          <Select
            value={rule.type}
            onValueChange={(type) => {
              let newRule: ValidationRule;
              switch (type) {
                case 'minLength':
                case 'maxLength':
                case 'min':
                case 'max':
                  newRule = { type: type as any, value: 1 };
                  break;
                case 'pattern':
                case 'startsWith':
                case 'endsWith':
                case 'custom':
                  newRule = { type: type as any, value: '' };
                  break;
                case 'enum':
                  newRule = { type: 'enum', values: [''] };
                  break;
                default:
                  newRule = { type: type as any };
              }
              updateValidationRule(propIndex, ruleIndex, newRule);
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ValidationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {'value' in rule && (
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">VALUE</Label>
            <Input
              type={typeof rule.value === 'number' ? 'number' : 'text'}
              value={rule.value}
              onChange={(e) =>
                updateRule({
                  value: e.target.value,
                  type: 'endsWith',
                })
              }
              placeholder={`Enter ${rule.type} value`}
            />
          </div>
        )}

        {'values' in rule && (
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">
              VALUES (comma-separated)
            </Label>
            <Input
              value={rule.values.join(', ')}
              onChange={(e) =>
                updateRule({
                  values: e.target.value.split(', ').filter(Boolean),
                  type: rule.type,
                })
              }
              placeholder="option1, option2, option3"
            />
          </div>
        )}

        {!('value' in rule) && !('values' in rule) && (
          <div className="flex-1 text-sm text-muted-foreground italic">
            No additional configuration needed
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeValidationRule(propIndex, ruleIndex)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="">
      {' '}
      <Dialog open={modalOpen} onOpenChange={onModalOpen}>
        {/* <DialogTrigger asChild>
          <Button variant="outline">
            <Pencil />
          </Button>
        </DialogTrigger> */}
        <DialogContent className="sm:max-w-md overflow-auto max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Entity Configuration</DialogTitle>
            <DialogDescription>
              Configure your entity properties, routes, and relations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => updateName(e.target.value)}
              placeholder="Entity name"
            />
          </div>
          <ScrollArea className="h-full max-h-[60vh] pr-4">
            {/* Name */}

            {/* Routes */}
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  {' '}
                  <Label className="text-lg font-semibold">Routes</Label>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-sm text-muted-foreground">
                        Select which HTTP methods are available for this entity
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {(
                          [
                            'GET',
                            'POST',
                            'PUT',
                            'DELETE',
                            'GET_ID',
                          ] as RouteMethods[]
                        ).map((method) => {
                          const isSelected = data.routes.includes(method);
                          return (
                            <button
                              key={method}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setData((prev) => ({
                                    ...prev,
                                    routes: prev.routes.filter(
                                      (r) => r !== method
                                    ),
                                  }));
                                } else {
                                  setData((prev) => ({
                                    ...prev,
                                    routes: [...prev.routes, method],
                                  }));
                                }
                              }}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                isSelected
                                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                  : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-border'
                              }`}
                            >
                              {method}
                            </button>
                          );
                        })}
                      </div>
                      {data.routes.length === 0 && (
                        <div className="text-sm text-muted-foreground italic">
                          No HTTP methods selected
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Separator className="mt-5" />

            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <Label className="text-lg font-semibold">Properties</Label>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex items-center justify-between mb-4">
                    <Button variant="outline" size="sm" onClick={addProperty}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Property
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {data.props.map((prop, propIndex) => (
                      <Card key={propIndex} className="border-2">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-lg">
                                {prop.name || 'Unnamed'}
                              </span>
                              <Badge variant="outline">{prop.type}</Badge>
                              {prop.nullable && (
                                <Badge variant="secondary">nullable</Badge>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProperty(propIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input
                                value={prop.name}
                                onChange={(e) =>
                                  updateProperty(propIndex, {
                                    name: e.target.value,
                                  })
                                }
                                placeholder="Enter name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Data Type</Label>
                              <Select
                                value={prop.type}
                                onValueChange={(type: FieldType) =>
                                  updateProperty(propIndex, { type })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {FieldTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                  <SelectItem value="custom">
                                    Custom Type
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Options</Label>
                              <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                  id={`nullable-${propIndex}`}
                                  checked={prop.nullable}
                                  onCheckedChange={(checked) =>
                                    updateProperty(propIndex, {
                                      nullable: !!checked,
                                    })
                                  }
                                />
                                <Label htmlFor={`nullable-${propIndex}`}>
                                  Allow null values
                                </Label>
                              </div>
                            </div>
                          </div>

                          {/* Custom type input */}
                          {!FieldTypes.includes(prop.type) && (
                            <div className="space-y-2">
                              <Label>Custom Type Name</Label>
                              <Input
                                value={prop.type}
                                onChange={(e) =>
                                  updateProperty(propIndex, {
                                    type: e.target.value as FieldType,
                                  })
                                }
                                placeholder="Enter custom type name"
                              />
                            </div>
                          )}

                          <Separator />

                          {/* Validation Rules */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="font-medium">
                                Validation Rules
                              </Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addValidationRule(propIndex)}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Rule
                              </Button>
                            </div>

                            {prop.validation && prop.validation.length > 0 ? (
                              <div className="space-y-2">
                                {prop.validation.map((rule, ruleIndex) =>
                                  renderValidationRule(
                                    rule,
                                    propIndex,
                                    ruleIndex
                                  )
                                )}
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground italic">
                                No validation rules defined
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {data.props.length === 0 && (
                      <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                          <div className="text-muted-foreground mb-4">
                            No properties defined
                          </div>
                          <Button variant="outline" onClick={addProperty}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Your First Property
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Properties */}

            <Separator className="mb-5" />

            {/* Relations */}
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  {' '}
                  <Label className="text-lg font-semibold">Relations</Label>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" onClick={addRelation}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Relation
                      </Button>
                    </div>

                    {data.relations.map((relation, index) => (
                      <Card key={index}>
                        <CardContent>
                          <div className="flex items-center justify-between mb-4">
                            <Badge variant="outline">{relation.relation}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRelation(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Relation Type</Label>
                              <Select
                                value={relation.relation}
                                onValueChange={(
                                  value:
                                    | 'one-to-one'
                                    | 'one-to-many'
                                    | 'many-to-many'
                                ) => updateRelation(index, { relation: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="one-to-one">
                                    One to One
                                  </SelectItem>
                                  <SelectItem value="one-to-many">
                                    One to Many
                                  </SelectItem>
                                  <SelectItem value="many-to-many">
                                    Many to Many
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Controller</Label>
                              <Input
                                value={relation.controller}
                                onChange={(e) =>
                                  updateRelation(index, {
                                    controller: e.target.value,
                                  })
                                }
                                placeholder="Controller name"
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-4">
                            <Checkbox
                              id={`parent-${index}`}
                              checked={relation.isParent}
                              onCheckedChange={(checked) =>
                                updateRelation(index, { isParent: !!checked })
                              }
                            />
                            <Label htmlFor={`parent-${index}`}>Is Parent</Label>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Debug Output */}
            <Separator />
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  {' '}
                  <Label>Current Configuration (JSON)</Label>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 mt-5">
                    <Textarea
                      value={JSON.stringify(data, null, 2)}
                      readOnly
                      className="font-mono text-sm h-40"
                    />
                  </div>{' '}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
