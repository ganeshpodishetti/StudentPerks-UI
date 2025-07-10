export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background dark:bg-background" style={{
      backgroundColor: 'hsl(var(--background))',
      color: 'hsl(var(--foreground))',
      minHeight: '100vh',
      WebkitOverflowScrolling: 'touch',
      WebkitTapHighlightColor: 'transparent',
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {children}
    </div>
  )
}
