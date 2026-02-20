import EditCategoryPage from './EditCategoryPage';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <EditCategoryPage params={params} />;
}
