import { Card, CardContent } from '@/shared/components/ui/card';
import { University } from "@/shared/types/entities/university";
import AdminUniversitiesTable from '../AdminUniversitiesTable/AdminUniversitiesTable';

interface AdminUniversitiesListProps {
  universities: University[];
  onEditUniversity?: (universityId: string) => void;
  onDeleteUniversity?: (universityId: string) => void;
}

export default function AdminUniversitiesList({ universities, onEditUniversity, onDeleteUniversity }: AdminUniversitiesListProps) {
  return (
    <Card className="border-0">
      <CardContent className="p-0 sm:p-3 md:p-6">
        {/* Desktop Table View */}
        <AdminUniversitiesTable 
          universities={universities}
          onEditUniversity={onEditUniversity}
          onDeleteUniversity={onDeleteUniversity}
        />

        {universities.length === 0 && (
          <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
            No universities found. Create your first university to get started!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
