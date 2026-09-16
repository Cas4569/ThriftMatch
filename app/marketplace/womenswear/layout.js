import AuthGuard from "../../components/AuthGuard";

export default function WomenswearLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
