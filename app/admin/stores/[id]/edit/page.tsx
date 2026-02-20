import EditStorePage from './EditStorePage';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <EditStorePage params={params} />;
}
