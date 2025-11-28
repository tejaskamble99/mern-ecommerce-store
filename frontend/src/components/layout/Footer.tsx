import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-gradient-to-tr from-indigo-600 to-blue-400 flex items-center justify-center text-white font-bold">
                N
              </div>
              <span className="text-white font-semibold text-lg">MyStore</span>
            </Link>
            <p className="mt-3 text-sm text-gray-400 max-w-sm">
              A minimal demo store using FakeStoreAPI — built with Next.js & Tailwind.
            </p>
            <p className="mt-4 text-xs text-gray-500">© {new Date().getFullYear()} MyStore. All rights reserved.</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:underline">Products</Link></li>
              <li><Link href="/categories" className="hover:underline">Categories</Link></li>
              <li><Link href="/about" className="hover:underline">About</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Contact</h4>
            <p className="text-sm text-gray-400">support@mystore.example</p>
            <p className="text-sm text-gray-400 mt-2">+91 98765 43210</p>
            <div className="flex gap-3 mt-4">
              <a className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center" href="#" aria-label="Twitter">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.92c-.7.31-1.45.52-2.24.61.81-.5 1.43-1.3 1.72-2.25-.77.46-1.61.79-2.5.97A4.03 4.03 0 0 0 12.04 9c0 .32.04.64.1.95C8.05 9.8 4.51 7.95 2.22 5.02c-.35.6-.55 1.3-.55 2.05 0 1.42.72 2.68 1.81 3.42-.66-.02-1.28-.2-1.82-.5v.05c0 1.97 1.38 3.6 3.21 3.98-.33.09-.67.14-1.02.14-.25 0-.5-.02-.74-.07.51 1.59 1.98 2.75 3.72 2.78A8.08 8.08 0 0 1 2 19.54 11.4 11.4 0 0 0 8.29 21c7.55 0 11.68-6.27 11.68-11.7v-.53A8.22 8.22 0 0 0 22 5.92z"/></svg>
              </a>
              <a className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center" href="#" aria-label="Instagram">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.5A4.5 4.5 0 1 0 16.5 13 4.5 4.5 0 0 0 12 8.5zM18.5 6a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

