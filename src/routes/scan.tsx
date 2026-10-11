import { createFileRoute } from '@tanstack/react-router';
import { Scan } from '@/features/annarakshak/scan';
import { pageHead } from '@/features/annarakshak/meta';
export const Route = createFileRoute('/scan')({head:()=>pageHead('Scan Product','Explore the demo packaging capture and date-evidence review workspace. No live scanner is connected.'),component:Scan});
