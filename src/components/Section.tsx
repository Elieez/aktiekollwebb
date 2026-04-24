interface Props {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function Section({ children, className, id }: Props) {
  return (
    <section id={id} className={`rounded-lg ${className}`}>
      {children}
    </section>
  );
}
