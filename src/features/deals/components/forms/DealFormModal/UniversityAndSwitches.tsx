import { useUniversitiesQuery } from '@/features/universities/hooks/useUniversitiesQuery';
import { Combobox } from '@/shared/components/ui/combobox';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Deal } from '@/shared/types/entities/deal';
import { FormData } from './types';

interface UniversityAndSwitchesProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  deal?: Deal | null;
}

export default function UniversityAndSwitches({ formData, setFormData, deal }: UniversityAndSwitchesProps) {
  const { data: universities = [] } = useUniversitiesQuery();

  return (
    <>
      <div>
        <Label htmlFor="universityName">University (Optional)</Label>
        <Combobox
          options={universities.map(uni => ({ value: uni.name, label: uni.name }))}
          value={formData.universityName || ''}
          onValueChange={(value) => setFormData(prev => ({ ...prev, universityName: value }))}
          placeholder={deal ? "Select university" : "Select or create university"}
          searchPlaceholder="Search universities..."
          emptyText={deal ? "No universities found." : "No universities found. Type to create new."}
          customText="Create university"
          allowCustom={!deal}
        />
        <p className="text-xs text-gray-500 mt-1">{deal ? "Select from existing universities" : "Select existing or type new university name"}</p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="isUniversitySpecific" 
            checked={formData.isUniversitySpecific || false} 
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isUniversitySpecific: checked }))} 
          />
          <Label htmlFor="isUniversitySpecific">University Exclusive Deal</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="isActive" 
            checked={formData.isActive} 
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))} 
          />
          <Label htmlFor="isActive">Active Deal</Label>
        </div>
      </div>
    </>
  );
}