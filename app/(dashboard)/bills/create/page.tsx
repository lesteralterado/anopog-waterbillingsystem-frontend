// "use client";

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { billsAPI } from '@/lib/api';
// import { Button } from '@/app/components/ui/Button';
// import { ArrowLeft } from 'lucide-react';
// import { Input } from '@/app/components/ui/Input';

// export default function CreateBillPage() {
//   const [consumerEmail, setConsumerEmail] = useState('');
//   const [amount, setAmount] = useState('');
//   const [consumption, setConsumption] = useState('');
//   const [dueDate, setDueDate] = useState('');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const validate = () => {
//     if (!consumerEmail.trim()) return 'Consumer email is required';
//     if (!amount || Number(amount) <= 0) return 'Amount must be greater than 0';
//     return null;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const err = validate();
//     if (err) {
//       alert(err);
//       return;
//     }

//     setLoading(true);
//     // This route no longer serves a separate page. Redirect visitors to the bills list.
//     import { redirect } from 'next/navigation';

//     export default function Page() {
//       // Server-side redirect to the bills list page
//       redirect('/dashboard/bills');
//     }

