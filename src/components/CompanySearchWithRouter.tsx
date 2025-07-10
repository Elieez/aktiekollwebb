'use client';
import { useRouter } from 'next/navigation';
import CompanySearch from './SearchBar';

export default function CompanySearchWithRouter() {
  const router = useRouter();
  return <CompanySearch onSelect={(symbol) => router.push(`/stocks/${symbol}`)} />;
}