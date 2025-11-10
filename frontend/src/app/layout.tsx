import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: '每日励志语录 - AI语录生成系统',
  description: '基于AI的个性化励志语录生成系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-bg-primary min-h-screen">
        {children}
      </body>
    </html>
  );
}
