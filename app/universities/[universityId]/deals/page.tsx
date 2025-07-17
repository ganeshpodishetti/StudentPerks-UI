
import { universityService } from '@/features/universities/services/universityService';
import UniversityDealsPage from '../../UniversityDealsPage';

// Required for static export (output: 'export')
export async function generateStaticParams() {
  // This must be a fetch, not a client-side hook
  const universities = await universityService.getUniversities();
  return universities.map((u) => ({ universityId: u.id }));
}

export default function UniversityDealsRoute() {
  return <UniversityDealsPage />;
}
