
import OrderPage from "./OrderPage";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;

  return <OrderPage id={id} />;
}
