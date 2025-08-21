'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProjectFeatures } from '@/types/types';
import { Sparkles, Database, Mail, Rocket } from 'lucide-react';

interface InitialSetupModalProps {
  onSetupComplete: (config: InitialSetupConfig) => void;
  showOnFirstVisit?: boolean;
}

export interface InitialSetupConfig {
  projectName: string;
  enableEmailAuth: boolean;
  emailProvider: 'nodemailer' | 'sendgrid' | 'resend';
  useInitialSetup: boolean;
  features: ProjectFeatures;
}

export default function InitialSetupModal({
  onSetupComplete,
  showOnFirstVisit = true,
}: InitialSetupModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState('project');
  const [enableEmailAuth, setEnableEmailAuth] = useState(false);
  const [emailProvider, setEmailProvider] = useState<'nodemailer' | 'sendgrid' | 'resend'>('nodemailer');
  const [useInitialSetup, setUseInitialSetup] = useState(false);

  useEffect(() => {
    if (showOnFirstVisit) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [showOnFirstVisit]);

  const handleComplete = () => {
    const features: ProjectFeatures = {
      testDataSeeding: {
        enabled: useInitialSetup,
        recordCount: 10,
        locale: 'en',
        customSeed: false,
      },
      apiDocumentation: {
        enabled: useInitialSetup,
        title: `${projectName} API`,
        description: `API documentation for ${projectName}`,
        version: '1.0.0',
        includeSwaggerUI: true,
      },
      emailAuth: {
        enabled: enableEmailAuth,
        provider: emailProvider,
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
    };

    const config: InitialSetupConfig = {
      projectName,
      enableEmailAuth,
      emailProvider,
      useInitialSetup,
      features,
    };

    setIsOpen(false);
    onSetupComplete(config);
  };

  const handleSkip = () => {
    setIsOpen(false);
    
    onSetupComplete({
      projectName: 'Untitled Project',
      enableEmailAuth: false,
      emailProvider: 'nodemailer',
      useInitialSetup: false,
      features: {
        testDataSeeding: { enabled: false, recordCount: 10, locale: 'en', customSeed: false },
        apiDocumentation: { enabled: false, title: '', description: '', version: '1.0.0', includeSwaggerUI: true },
        emailAuth: { enabled: false, provider: 'nodemailer', templates: { verification: true, passwordReset: true, welcome: false } },
        oauthProviders: { enabled: false, providers: [], callbackUrls: {} },
        paymentIntegration: { enabled: false, provider: 'stripe', features: [] },
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-6 h-6 text-blue-600" />
            Welcome to VIBES!
          </DialogTitle>
          <DialogDescription>
            Let&apos;s get your backend project set up quickly. You can always change these settings later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="projectName" className="text-sm font-medium flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              Project Name
            </Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My Awesome Backend"
            />
          </div>

          <Separator />

          {/* Email Authentication */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Authentication
                </Label>
                <p className="text-xs text-muted-foreground">
                  Generate complete user authentication with email verification
                </p>
              </div>
              <Switch
                checked={enableEmailAuth}
                onCheckedChange={setEnableEmailAuth}
              />
            </div>

            {enableEmailAuth && (
              <div className="pl-6 space-y-3 border-l-2 border-muted">
                <div className="space-y-2">
                  <Label htmlFor="emailProvider" className="text-sm font-medium">
                    Email Provider
                  </Label>
                  <select
                    id="emailProvider"
                    value={emailProvider}
                    onChange={(e) => setEmailProvider(e.target.value as 'nodemailer' | 'sendgrid' | 'resend')}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="nodemailer">Nodemailer (SMTP)</option>
                    <option value="sendgrid">SendGrid</option>
                    <option value="resend">Resend</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Initial Setup */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Start with Example Setup
                </Label>
                <p className="text-xs text-muted-foreground">
                  Pre-populate canvas with User, Post, and Comment entities with API docs and test data
                </p>
              </div>
              <Switch
                checked={useInitialSetup}
                onCheckedChange={setUseInitialSetup}
              />
            </div>

            {useInitialSetup && (
              <div className="pl-6 border-l-2 border-muted">
                <div className="space-y-2">
                  <p className="text-sm font-medium">What&apos;s included:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• User entity {enableEmailAuth ? '(with authentication fields)' : '(basic fields)'}</li>
                    <li>• Post entity with relationships</li>
                    <li>• Comment entity with relationships</li>
                    <li>• Interactive Swagger API documentation</li>
                    <li>• Test data seeding with realistic fake data</li>
                    <li>• CRUD endpoints for all entities</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleSkip}>
            Skip Setup
          </Button>
          <Button onClick={handleComplete}>
            {useInitialSetup ? 'Create Project with Examples' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}