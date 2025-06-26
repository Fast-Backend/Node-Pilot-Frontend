'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Pencil, Check, X, Plus, Trash2 } from 'lucide-react';
import {
  WorkflowProps,
  FieldType,
  Properties,
  // RouteMethods,
  //   Properties,
  //   RouteMethods,
} from '@/types/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import EditableCard from './node-modal';
import { Handle, Position } from '@xyflow/react';

interface ConfigSummaryProps {
  id: string;
  data: WorkflowProps;
  onUpdate: (data: WorkflowProps) => void;
}

export default function ConfigSummary({
  data,
  onUpdate,
  id,
}: ConfigSummaryProps) {
  const [initialData, setInitialData] = useState<WorkflowProps>(data);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(data.name);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPropertyIndex, setEditingPropertyIndex] = useState<
    number | null
  >(null);
  const [tempPropertyName, setTempPropertyName] = useState('');

  const handleNameSave = () => {
    setInitialData((props) => {
      return { ...props, name: tempName };
    });
    setEditingName(false);
  };

  const handleNameCancel = () => {
    setTempName(initialData.name);
    setEditingName(false);
  };

  const handlePropertyNameSave = (index: number) => {
    // onPropertyNameChange(index, tempPropertyName);
    setInitialData((prev) => ({
      ...prev,
      props:
        prev.props &&
        prev.props.map((prop, i) =>
          i === index ? { ...prop, name: tempPropertyName } : prop
        ),
    }));
    // updateProperty(index, tempPropertyName);
    setEditingPropertyIndex(null);
  };

  const handlePropertyNameCancel = () => {
    setEditingPropertyIndex(null);
  };
  const removeProperty = (index: number) => {
    setInitialData((prev) => ({
      ...prev,
      props: prev.props && prev.props.filter((_, i) => i !== index),
    }));
  };

  const startEditingProperty = (index: number, currentName: string) => {
    setEditingPropertyIndex(index);
    setTempPropertyName(currentName);
  };
  const addProperty = () => {
    const newProp: Properties = {
      name: '',
      type: 'string',
      nullable: false,
      validation: [],
    };
    setInitialData((prev) => {
      //   if (prev.props) {
      return { ...prev, props: [...prev.props, newProp] };
      //   }
      //   return prev;
    });
  };
  // const toggleRoute = (method: RouteMethods) => {
  //   setInitialData((prev) => {
  //     if (prev.routes.includes(method)) {
  //       return {
  //         ...prev,
  //         routes: prev.routes.filter((r) => r !== method),
  //       };
  //     } else {
  //       return {
  //         ...prev,
  //         routes: [...prev.routes, method],
  //       };
  //     }
  //   });
  // };
  const togglePropertyNullable = (index: number) => {
    setInitialData((prev) => ({
      ...prev,
      props: prev.props.map((prop, i) =>
        i === index ? { ...prop, nullable: !prop.nullable } : prop
      ),
    }));
  };

  useEffect(() => {
    if (onUpdate) {
      onUpdate(initialData);
    }
  }, [initialData, onUpdate]);

  const fieldTypes: FieldType[] = [
    'string',
    'number',
    'boolean',
    'bigint',
    'symbol',
    'undefined',
    'null',
    'object',
    'array',
    'function',
    'date',
    'any',
    'unknown',
    'void',
    'never',
    'json',
  ];

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{
          width: '15px',
          height: '15px',
        }}
      />
      <Card className="w-80 hover:border-2" key={id}>
        <CardContent>
          {/* Entity Name - Editable */}
          <div>
            <div className="flex justify-between">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Entity
              </h3>
              <Button
                variant="outline"
                onClick={() => {
                  setModalOpen(true);
                }}
              >
                <Pencil />
              </Button>
            </div>

            {editingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="h-8 text-base"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNameSave}
                  title="Save"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNameCancel}
                  title="Cancel"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="flex items-center justify-between group cursor-pointer"
                onClick={() => {
                  setEditingName(true);
                  setTempName(initialData.name);
                }}
              >
                <p className="text-lg font-semibold">
                  {initialData.name || 'Unnamed Entity'}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100"
                  title="Edit name"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>

          <Separator className="my-1" />

          {/* Routes - Toggleable Pills */}
          {/* <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              HTTP Methods
            </h3>
            <div className="flex flex-wrap gap-2">
              {(
                ['GET', 'POST', 'PUT', 'DELETE', 'GET_ID'] as RouteMethods[]
              ).map((method) => {
                const isSelected = initialData.routes.includes(method);
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => {
                      toggleRoute(method);
                    }}
                    className={`px-[6px] py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {method}
                  </button>
                );
              })}
            </div>
            {initialData.routes && initialData.routes.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No methods selected
              </p>
            )}
          </div> */}

          {/* <Separator className="my-2" /> */}

          {/* Properties - Editable */}
          <div className="space-y-2">
            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Properties ({initialData.props && initialData.props.length})
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addProperty}
                    title="Add new property"
                  >
                    Add new Property
                    <Plus className="h-4 w-4" />
                  </Button>
                  {initialData.props && initialData.props.length > 0 ? (
                    <div className="space-y-1">
                      {initialData.props.map((prop, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-1.5 group"
                        >
                          {/* Property Name */}
                          {editingPropertyIndex === index ? (
                            <div className="flex items-center gap-1 flex-1">
                              <Input
                                value={tempPropertyName}
                                onChange={(e) =>
                                  setTempPropertyName(e.target.value)
                                }
                                className="h-7 text-sm"
                                autoFocus
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handlePropertyNameSave(index)}
                                title="Save"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={handlePropertyNameCancel}
                                title="Cancel"
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <div
                              className="flex items-center gap-1 cursor-pointer flex-1"
                              onClick={() =>
                                startEditingProperty(index, prop.name)
                              }
                            >
                              <span className="text-sm font-medium">
                                {prop.name || 'unnamed'}
                                <button
                                  className="ml-1 text-muted-foreground hover:text-foreground"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    togglePropertyNullable(index);
                                  }}
                                >
                                  {prop.nullable ? '?' : ''}
                                </button>
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 opacity-0 group-hover:opacity-100"
                                title="Edit property name"
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                            </div>
                          )}

                          {/* Property Type */}
                          <div className="flex items-center gap-1">
                            <Select
                              value={prop.type}
                              onValueChange={(value) => {
                                setInitialData((prev) => {
                                  if (prev.props) {
                                    return {
                                      ...prev,
                                      props: prev.props.map((prop, i) =>
                                        i === index
                                          ? { ...prop, type: value }
                                          : prop
                                      ),
                                    };
                                  }
                                  return prev;
                                });
                              }}
                            >
                              <SelectTrigger className="h-7 w-24 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {fieldTypes.map((type) => (
                                  <SelectItem
                                    key={type}
                                    value={type}
                                    className="text-xs"
                                  >
                                    {type}
                                  </SelectItem>
                                ))}
                                <SelectItem value="custom" className="text-xs">
                                  Custom Type
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100"
                              onClick={() => removeProperty(index)}
                              title="Remove property"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No properties defined
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {/* <div className="flex justify-between"></div> */}
          </div>
        </CardContent>
      </Card>
      <EditableCard
        workflow={initialData}
        modalOpen={modalOpen}
        onModalOpen={() => setModalOpen(false)}
        onSave={(data) => {
          setInitialData(data);
          setModalOpen(false);
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={{
          width: '15px',
          height: '15px',
        }}
      />
    </>
  );
}
