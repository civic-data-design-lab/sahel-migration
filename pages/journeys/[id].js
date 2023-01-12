import { useRouter } from 'next/router';
import Menu from '../../components/menu';
import DataTab from '../../components/data-tab';
export default function JourneysPage() {
  const router = useRouter();
  const id = router.query.id;

  return (
    <>
      <Menu />
      <h1>Journey: {id}</h1>
      <DataTab />
    </>
  );
}
