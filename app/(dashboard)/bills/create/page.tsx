import { redirect } from 'next/navigation';

export default function CreateBillPage() {
  // Redirect to the bills list page where bill creation is handled
  redirect('/bills');
}
