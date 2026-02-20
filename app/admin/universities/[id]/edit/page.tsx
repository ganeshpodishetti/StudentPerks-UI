import EditUniversityPage from './EditUniversityPage';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <EditUniversityPage params={params} />;
}
