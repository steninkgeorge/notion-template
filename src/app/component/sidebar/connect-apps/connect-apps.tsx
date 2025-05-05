'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { connect } from 'http2';
import { Mail } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export const ConnectApps = () => {
  const [open, setOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConnect = useCallback(async () => {
    setLoading(true);
    try {
      const status = await fetch('/api/auth/status');
      const { authenticated } = await status.json();

      if (authenticated) {
        // Disconnect logic
        const disconnectResponse = await fetch('/api/gmail/disconnect', {
          method: 'POST',
        });

        if (disconnectResponse.ok) {
          setConnected(false);
          // Clear any client-side storage
          localStorage.removeItem('gmail_tokens');
          return;
        } else {
          throw new Error('Failed to disconnect');
        }
      }

      const response = await fetch('/api/gmail/auth');
      if (!response.ok) {
        throw new Error('Failed to connect to Gmail');
      }

      const { authUrl } = await response.json();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error connecting to Gmail:', error);
      alert('Failed to connect to Gmail');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if we have tokens in cookies by making an API call
        const response = await fetch('/api/auth/status');
        const data = await response.json();

        if (data.authenticated) {
          setConnected(true);
        } else {
          setConnected(false);
        }

        // Check for URL params (if coming from OAuth redirect)
        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get('error');

        if (errorParam) {
          console.error('Authentication error:', errorParam);
          alert(`Gmail authentication failed: ${errorParam}`);
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [handleConnect]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start cursor-pointer">
          <Mail className="h-4 w-4 mr-2" />
          Connect Apps
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect to Gmail</DialogTitle>
          <DialogDescription>
            Connect your Gmail account to send emails directly from the editor.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-4 py-4">
          <Mail className="h-10 w-10 text-primary" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">Gmail Connection</p>
            <p className="text-sm text-muted-foreground">
              {connected ? 'Connected' : 'Not connected'}
            </p>
          </div>
          <Switch
            disabled={loading}
            checked={connected}
            onCheckedChange={handleConnect}
          />
          {loading && <div className="size-6 animate-spin text-black"></div>}
        </div>
      </DialogContent>
    </Dialog>
  );
};
