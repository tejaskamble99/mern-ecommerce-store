import './globals.css';
import Providers from '@/components/Providers';

export const metadata = { title: 'My Next App' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <header className="bg-white shadow p-4">Header</header>
            <main className="flex-1 container mx-auto p-4">{children}</main>
            <footer className="bg-gray-50 p-4">Footer</footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
