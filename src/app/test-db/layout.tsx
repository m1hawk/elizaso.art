export default function DashboardLayout({
                                          children,
                                        }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
          <section>
            <nav>child layout</nav>
            {children}
          </section>
  )
}