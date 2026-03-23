interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function Section({ children, className }: Props) {
  return (
    <section
      className={`rounded-lg ${className}`}
    >
      {children}
    </section>
  );
}
