import { useUniversitiesQuery } from '@/features/universities/hooks/useUniversitiesQuery';

export interface UniversityOption {
  value: string;
  label: string;
}

export function useUniversityOptions() {
  const { data: universities = [], isLoading } = useUniversitiesQuery();

  const universityOptions: UniversityOption[] = universities.map((u) => ({
    value: u.id,
    label: u.name,
  }));

  return { universityOptions, isLoading };
}
