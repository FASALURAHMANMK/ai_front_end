export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 py-6 px-6 mt-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="font-bold text-lg mb-2">AI Interview</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Revolutionizing the hiring process with AI-powered interviews
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:gap-16">
            <div>
              <h4 className="font-semibold mb-3 text-sm">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {currentYear} AI Interview. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

