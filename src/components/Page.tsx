interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function Page({ children, className }: Props) {
  return (
    <main className={`mx-auto ${className}`}>
      {children}
    </main>
  );
}
