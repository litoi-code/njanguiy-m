import './globals.css'
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
         <AppProvider>
          <Navbar />
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
