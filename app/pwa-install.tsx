'use client';

import { useEffect, useState } from 'react';
import { Download, Smartphone } from 'lucide-react';

import { Button } from '@/components/ui/button';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export function PwaInstall() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [message, setMessage] = useState('');
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    }

    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setInstalled(standalone);

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      setMessage('已安装到手机桌面');
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(''), 5000);
    return () => window.clearTimeout(timer);
  }, [message]);

  const install = async () => {
    if (installed) {
      setMessage('应用已经安装，可以从手机桌面打开');
      return;
    }
    if (!installPrompt) {
      setMessage('请在浏览器菜单中选择“添加到主屏幕”');
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setMessage('正在添加到手机桌面…');
    }
    setInstallPrompt(null);
  };

  return (
    <div className="install-wrap">
      <Button type="button" variant="outline" onClick={install} className="install-button">
        {installed ? <Smartphone /> : <Download />}
        <span>{installed ? '已安装' : '安装到手机'}</span>
      </Button>
      {message && <div className="install-tip" role="status">{message}</div>}
    </div>
  );
}
