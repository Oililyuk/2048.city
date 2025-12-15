import { Metadata } from 'next';
import HowToPlay from '@/components/HowToPlay/HowToPlay';

export const metadata: Metadata = {
  title: 'How to Play 2048',
  description: 'Learn how to play 2048 and master winning strategies',
};

export default function HowToPlayPage() {
  return <HowToPlay />;
}
