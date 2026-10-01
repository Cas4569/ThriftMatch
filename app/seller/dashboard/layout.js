import SellerGuard from "@/app/components/SellerGuard";

export default function SellerDashboardLayout({
  children,
}) {
  return (
    <SellerGuard>
      {children}
    </SellerGuard>
  );
}