/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { AccordionContent } from '@radix-ui/react-accordion';
import {
  CorsAllowedHeader,
  CorsExposedHeader,
  CorsHttpMethod,
  CorsOptionsCustom,
} from '@/types/types';

const HTTP_METHODS: CorsHttpMethod[] = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'OPTIONS',
  'HEAD',
  'CONNECT',
  'TRACE',
];

const ALLOWED_HEADERS: CorsAllowedHeader[] = [
  'Accept',
  'Authorization',
  'Content-Type',
  'Origin',
  'X-Requested-With',
  'Access-Control-Allow-Origin',
  'Access-Control-Allow-Headers',
  'Cache-Control',
  'Pragma',
];

const EXPOSED_HEADERS: CorsExposedHeader[] = [
  'Content-Length',
  'X-Knowledge-Base-Version',
  'X-Request-ID',
  'X-RateLimit-Limit',
  'X-RateLimit-Remaining',
  'X-RateLimit-Reset',
  'Authorization',
];

interface SettingsDrawerProps {
  openDrawer: boolean;
  handleOpen: () => void;
  onSave: (name: string, cors: CorsOptionsCustom) => void;
}

export default function SettingsDrawer({
  handleOpen,
  openDrawer,
  onSave,
}: SettingsDrawerProps) {
  const [corsSettings, setCorsSettings] = useState<CorsOptionsCustom>({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: [],
    credentials: false,
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const [origins, setOrigins] = useState<string[]>(['*']);
  const [newOrigin, setNewOrigin] = useState('');
  const [customExposedHeader, setCustomExposedHeader] = useState('');
  const [projectName, setProjectName] = useState('Untitled');

  const handleMethodChange = (method: CorsHttpMethod, checked: boolean) => {
    const currentMethods = Array.isArray(corsSettings.methods)
      ? corsSettings.methods
      : corsSettings.methods
        ? [corsSettings.methods]
        : [];

    if (checked) {
      setCorsSettings({
        ...corsSettings,
        methods: [...currentMethods, method],
      });
    } else {
      setCorsSettings({
        ...corsSettings,
        methods: currentMethods.filter((m) => m !== method),
      });
    }
  };

  const handleAllowedHeaderChange = (
    header: CorsAllowedHeader,
    checked: boolean
  ) => {
    const currentHeaders = Array.isArray(corsSettings.allowedHeaders)
      ? corsSettings.allowedHeaders
      : corsSettings.allowedHeaders
        ? [corsSettings.allowedHeaders]
        : [];

    if (checked) {
      setCorsSettings({
        ...corsSettings,
        allowedHeaders: [...currentHeaders, header],
      });
    } else {
      setCorsSettings({
        ...corsSettings,
        allowedHeaders: currentHeaders.filter((h) => h !== header),
      });
    }
  };

  const handleExposedHeaderChange = (
    header: CorsExposedHeader,
    checked: boolean
  ) => {
    const currentHeaders = Array.isArray(corsSettings.exposedHeaders)
      ? corsSettings.exposedHeaders
      : corsSettings.exposedHeaders
        ? [corsSettings.exposedHeaders]
        : [];

    if (checked) {
      setCorsSettings({
        ...corsSettings,
        exposedHeaders: [...currentHeaders, header],
      });
    } else {
      setCorsSettings({
        ...corsSettings,
        exposedHeaders: currentHeaders.filter((h) => h !== header),
      });
    }
  };

  const addOrigin = () => {
    if (newOrigin.trim() && !origins.includes(newOrigin.trim())) {
      const updatedOrigins = [
        ...origins.filter((o) => o !== '*'),
        newOrigin.trim(),
      ];
      setOrigins(updatedOrigins);
      setCorsSettings({
        ...corsSettings,
        origin:
          updatedOrigins.length === 1 ? updatedOrigins[0] : updatedOrigins,
      });
      setNewOrigin('');
    }
  };

  const removeOrigin = (origin: string) => {
    const updatedOrigins = origins.filter((o) => o !== origin);
    if (updatedOrigins.length === 0) {
      updatedOrigins.push('*');
    }
    setOrigins(updatedOrigins);
    setCorsSettings({
      ...corsSettings,
      origin: updatedOrigins.length === 1 ? updatedOrigins[0] : updatedOrigins,
    });
  };

  const addCustomExposedHeader = () => {
    if (customExposedHeader.trim()) {
      const currentHeaders = Array.isArray(corsSettings.exposedHeaders)
        ? corsSettings.exposedHeaders
        : corsSettings.exposedHeaders
          ? [corsSettings.exposedHeaders]
          : [];

      if (!currentHeaders.includes(customExposedHeader.trim())) {
        setCorsSettings({
          ...corsSettings,
          exposedHeaders: [...currentHeaders, customExposedHeader.trim()],
        });
      }
      setCustomExposedHeader('');
    }
  };

  const handleSave = () => {
    console.log('Settings:', projectName, corsSettings);
    onSave(projectName, corsSettings);
    handleOpen();
  };

  const currentMethods = Array.isArray(corsSettings.methods)
    ? corsSettings.methods
    : corsSettings.methods
      ? [corsSettings.methods]
      : [];

  const currentAllowedHeaders = Array.isArray(corsSettings.allowedHeaders)
    ? corsSettings.allowedHeaders
    : corsSettings.allowedHeaders
      ? [corsSettings.allowedHeaders]
      : [];

  const currentExposedHeaders = Array.isArray(corsSettings.exposedHeaders)
    ? corsSettings.exposedHeaders
    : corsSettings.exposedHeaders
      ? [corsSettings.exposedHeaders]
      : [];

  return (
    <div className="p-8">
      <Drawer open={openDrawer} onOpenChange={handleOpen} direction="right">
        <DrawerContent className="h-screen">
          <DrawerHeader>
            <DrawerTitle>Configuration</DrawerTitle>
            <DrawerDescription>
              Configure settings for the project
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-6 flex items-center gap-4">
            <h3>name:</h3>
            <Input
              placeholder="Project Name"
              onChange={(e) => {
                setProjectName(e.currentTarget.value);
              }}
              value={projectName}
            />
          </div>

          <div className="px-4 pb-4 overflow-y-auto">
            <Accordion type="single" collapsible>
              <AccordionItem value="value-1">
                <AccordionTrigger>
                  <h3 className="font-medium">CORS Configuration</h3>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6">
                    {/* Origins */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Allowed Origins
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://example.com"
                          value={newOrigin}
                          onChange={(e) => setNewOrigin(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addOrigin()}
                        />
                        <Button onClick={addOrigin} size="sm" variant="outline">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {origins.map((origin) => (
                          <Badge
                            key={origin}
                            variant="secondary"
                            className="gap-1"
                          >
                            {origin}
                            {origin !== '*' && (
                              <button
                                onClick={() => removeOrigin(origin)}
                                className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* HTTP Methods */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Allowed Methods
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                        {HTTP_METHODS.map((method) => (
                          <div
                            key={method}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`method-${method}`}
                              checked={currentMethods.includes(method)}
                              onCheckedChange={(checked) =>
                                handleMethodChange(method, checked as boolean)
                              }
                            />
                            <Label
                              htmlFor={`method-${method}`}
                              className="text-sm"
                            >
                              {method}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Allowed Headers */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Allowed Headers
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {ALLOWED_HEADERS.map((header) => (
                          <div
                            key={header}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`allowed-${header}`}
                              checked={currentAllowedHeaders.includes(header)}
                              onCheckedChange={(checked) =>
                                handleAllowedHeaderChange(
                                  header,
                                  checked as boolean
                                )
                              }
                            />
                            <Label
                              htmlFor={`allowed-${header}`}
                              className="text-sm"
                            >
                              {header}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Exposed Headers */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Exposed Headers
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {EXPOSED_HEADERS.map((header) => (
                          <div
                            key={header}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`exposed-${header}`}
                              checked={currentExposedHeaders.includes(header)}
                              onCheckedChange={(checked) =>
                                handleExposedHeaderChange(
                                  header,
                                  checked as boolean
                                )
                              }
                            />
                            <Label
                              htmlFor={`exposed-${header}`}
                              className="text-sm"
                            >
                              {header}
                            </Label>
                          </div>
                        ))}
                      </div>

                      {/* Custom Exposed Header */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Custom header name"
                          value={customExposedHeader}
                          onChange={(e) =>
                            setCustomExposedHeader(e.target.value)
                          }
                          onKeyDown={(e) =>
                            e.key === 'Enter' && addCustomExposedHeader()
                          }
                        />
                        <Button
                          onClick={addCustomExposedHeader}
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Show custom headers */}
                      {currentExposedHeaders.filter(
                        (h) => !EXPOSED_HEADERS.includes(h as any)
                      ).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {currentExposedHeaders
                            .filter((h) => !EXPOSED_HEADERS.includes(h as any))
                            .map((header) => (
                              <Badge
                                key={header}
                                variant="outline"
                                className="gap-1"
                              >
                                {header}
                                <button
                                  onClick={() =>
                                    handleExposedHeaderChange(header, false)
                                  }
                                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Boolean Settings */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm font-medium">
                            Allow Credentials
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Allow cookies and authentication headers
                          </p>
                        </div>
                        <Switch
                          checked={corsSettings.credentials}
                          onCheckedChange={(checked) =>
                            setCorsSettings({
                              ...corsSettings,
                              credentials: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm font-medium">
                            Preflight Continue
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Pass control to next handler after preflight
                          </p>
                        </div>
                        <Switch
                          checked={corsSettings.preflightContinue}
                          onCheckedChange={(checked) =>
                            setCorsSettings({
                              ...corsSettings,
                              preflightContinue: checked,
                            })
                          }
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Numeric Settings */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="maxAge" className="text-sm font-medium">
                          Max Age (seconds)
                        </Label>
                        <Input
                          id="maxAge"
                          type="number"
                          value={corsSettings.maxAge || ''}
                          onChange={(e) =>
                            setCorsSettings({
                              ...corsSettings,
                              maxAge: e.target.value
                                ? Number.parseInt(e.target.value)
                                : undefined,
                            })
                          }
                          placeholder="86400"
                        />
                        <p className="text-xs text-muted-foreground">
                          How long browsers can cache preflight responses
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="optionsStatus"
                          className="text-sm font-medium"
                        >
                          Options Success Status
                        </Label>
                        <Input
                          id="optionsStatus"
                          type="number"
                          value={corsSettings.optionsSuccessStatus || ''}
                          onChange={(e) =>
                            setCorsSettings({
                              ...corsSettings,
                              optionsSuccessStatus: e.target.value
                                ? Number.parseInt(e.target.value)
                                : undefined,
                            })
                          }
                          placeholder="204"
                        />
                        <p className="text-xs text-muted-foreground">
                          Status code for successful OPTIONS requests
                        </p>
                      </div>
                    </div>
                  </div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="value-1">
                      <AccordionTrigger>
                        <h3 className="font-medium">
                          Current CORS Configuration:
                        </h3>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="mt-8 p-4 bg-muted rounded-lg">
                          <pre className="text-sm overflow-x-auto">
                            {JSON.stringify(corsSettings, null, 2)}
                          </pre>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <DrawerFooter>
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={handleOpen}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Preview of current settings */}
    </div>
  );
}
