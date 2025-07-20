interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function Page({ children, className }: Props) {
  return (
    <main className={`w-11/12 mx-auto my-6 ${className}`}>
      {children}
    </main>
  );
}
