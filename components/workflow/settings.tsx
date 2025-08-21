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
  ProjectFeatures,
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
  onSave: (name: string, cors: CorsOptionsCustom, features: ProjectFeatures) => void;
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
  
  // Project Features State
  const [features, setFeatures] = useState<ProjectFeatures>({
    testDataSeeding: {
      enabled: false,
      recordCount: 10,
      locale: 'en',
      customSeed: false,
    },
    apiDocumentation: {
      enabled: false,
      title: '',
      description: '',
      version: '1.0.0',
      includeSwaggerUI: true,
    },
    emailAuth: {
      enabled: false,
      provider: 'nodemailer',
      templates: {
        verification: true,
        passwordReset: true,
        welcome: false,
      },
    },
    oauthProviders: {
      enabled: false,
      providers: [],
      callbackUrls: {},
    },
    paymentIntegration: {
      enabled: false,
      provider: 'stripe',
      features: [],
    },
  });

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
    console.log('Settings:', projectName, corsSettings, features);
    onSave(projectName, corsSettings, features);
    handleOpen();
  };

  // Features update helpers
  const updateFeatureFlag = (feature: keyof ProjectFeatures, enabled: boolean) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: {
        ...prev[feature],
        enabled,
      },
    }));
  };

  const updateTestDataConfig = (config: Partial<ProjectFeatures['testDataSeeding']>) => {
    setFeatures(prev => ({
      ...prev,
      testDataSeeding: {
        ...prev.testDataSeeding,
        ...config,
      },
    }));
  };

  const updateApiDocsConfig = (config: Partial<ProjectFeatures['apiDocumentation']>) => {
    setFeatures(prev => ({
      ...prev,
      apiDocumentation: {
        ...prev.apiDocumentation,
        ...config,
      },
    }));
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
              {/* Test Data Seeding */}
              <AccordionItem value="features-testdata">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">🧪 Test Data Seeding</h3>
                    {features.testDataSeeding.enabled && (
                      <Badge variant="secondary" className="text-xs">
                        Enabled
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    {/* Enable Test Data */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">
                          Generate Test Data
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Create realistic fake data based on your schema
                        </p>
                      </div>
                      <Switch
                        checked={features.testDataSeeding.enabled}
                        onCheckedChange={(checked) =>
                          updateFeatureFlag('testDataSeeding', checked)
                        }
                      />
                    </div>

                    {features.testDataSeeding.enabled && (
                      <div className="space-y-4 pl-4 border-l-2 border-muted">
                        {/* Record Count */}
                        <div className="space-y-2">
                          <Label htmlFor="recordCount" className="text-sm font-medium">
                            Records per Entity
                          </Label>
                          <Input
                            id="recordCount"
                            type="number"
                            min="1"
                            max="1000"
                            value={features.testDataSeeding.recordCount}
                            onChange={(e) =>
                              updateTestDataConfig({
                                recordCount: parseInt(e.target.value) || 10,
                              })
                            }
                            placeholder="10"
                          />
                          <p className="text-xs text-muted-foreground">
                            Number of fake records to generate per entity
                          </p>
                        </div>

                        {/* Locale */}
                        <div className="space-y-2">
                          <Label htmlFor="locale" className="text-sm font-medium">
                            Data Locale
                          </Label>
                          <select
                            id="locale"
                            value={features.testDataSeeding.locale}
                            onChange={(e) =>
                              updateTestDataConfig({ locale: e.target.value })
                            }
                            className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md"
                          >
                            <option value="en">English (US)</option>
                            <option value="en_GB">English (UK)</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="it">Italian</option>
                            <option value="pt">Portuguese</option>
                            <option value="ja">Japanese</option>
                            <option value="ko">Korean</option>
                            <option value="zh">Chinese</option>
                          </select>
                          <p className="text-xs text-muted-foreground">
                            Language/region for generated data
                          </p>
                        </div>

                        {/* Custom Seed */}
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-sm font-medium">
                              Custom Seed Script
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Include a customizable seeding script
                            </p>
                          </div>
                          <Switch
                            checked={features.testDataSeeding.customSeed || false}
                            onCheckedChange={(checked) =>
                              updateTestDataConfig({ customSeed: checked })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* API Documentation */}
              <AccordionItem value="features-apidocs">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">📘 API Documentation</h3>
                    {features.apiDocumentation.enabled && (
                      <Badge variant="secondary" className="text-xs">
                        Enabled
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    {/* Enable API Docs */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">
                          Generate API Documentation
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Auto-generate OpenAPI/Swagger documentation
                        </p>
                      </div>
                      <Switch
                        checked={features.apiDocumentation.enabled}
                        onCheckedChange={(checked) =>
                          updateFeatureFlag('apiDocumentation', checked)
                        }
                      />
                    </div>

                    {features.apiDocumentation.enabled && (
                      <div className="space-y-4 pl-4 border-l-2 border-muted">
                        {/* API Title */}
                        <div className="space-y-2">
                          <Label htmlFor="apiTitle" className="text-sm font-medium">
                            API Title
                          </Label>
                          <Input
                            id="apiTitle"
                            value={features.apiDocumentation.title || projectName + ' API'}
                            onChange={(e) =>
                              updateApiDocsConfig({ title: e.target.value })
                            }
                            placeholder={`${projectName} API`}
                          />
                        </div>

                        {/* API Description */}
                        <div className="space-y-2">
                          <Label htmlFor="apiDescription" className="text-sm font-medium">
                            Description
                          </Label>
                          <textarea
                            id="apiDescription"
                            value={features.apiDocumentation.description || ''}
                            onChange={(e) =>
                              updateApiDocsConfig({ description: e.target.value })
                            }
                            placeholder="Describe your API..."
                            className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md min-h-[80px] resize-y"
                          />
                        </div>

                        {/* API Version */}
                        <div className="space-y-2">
                          <Label htmlFor="apiVersion" className="text-sm font-medium">
                            API Version
                          </Label>
                          <Input
                            id="apiVersion"
                            value={features.apiDocumentation.version || '1.0.0'}
                            onChange={(e) =>
                              updateApiDocsConfig({ version: e.target.value })
                            }
                            placeholder="1.0.0"
                          />
                        </div>

                        {/* Include Swagger UI */}
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-sm font-medium">
                              Include Swagger UI
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Generate interactive documentation interface
                            </p>
                          </div>
                          <Switch
                            checked={features.apiDocumentation.includeSwaggerUI}
                            onCheckedChange={(checked) =>
                              updateApiDocsConfig({ includeSwaggerUI: checked })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CORS Configuration */}
              <AccordionItem value="cors-config">
                <AccordionTrigger>
                  <h3 className="font-medium">🌐 CORS Configuration</h3>
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
                          checked={corsSettings.credentials || false}
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
                          checked={corsSettings.preflightContinue || false}
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
